import {
  listBlogGroups,
  mainDbName,
  TursoApi,
} from '@angular-love/blog-bff/shared/api-turso';

/** Database name prefixes used by Jenkinsfile.deploy for PR preview branches. */
export const GROUP_PREFIXES: Record<string, string> = {
  'blog-eu': 'eu',
  'blog-us-east': 'use',
  'blog-us-west': 'usw',
};

export interface BranchBuild {
  env: string;
  branch: string;
  /** Builds older than this one are selected. */
  build: number;
  /** The build with this hash is kept. */
  hash: string;
}

/**
 * Selects preview databases (`<prefix>-<env>-<branch>-<build>-<hash>`) of a
 * branch that are older than `build` and don't carry `hash`.
 */
export function selectBranchBuilds(
  databases: string[],
  { env, branch, build, hash }: BranchBuild,
): string[] {
  const patterns = Object.values(GROUP_PREFIXES).map(
    (prefix) => `${prefix}-${env}-${branch}-`,
  );

  return databases.filter((name) => {
    const pattern = patterns.find((p) => name.startsWith(p));
    if (!pattern) return false;
    // Only `<build>-<hash>` may follow the pattern, so a branch name that
    // is a prefix of another one (e.g. `fix` vs `fix-menu`) doesn't match.
    const match = name.slice(pattern.length).match(/^(\d+)-([^-]+)$/);
    if (!match) return false;
    return Number(match[1]) < build && match[2] !== hash;
  });
}

export type CleanupTarget =
  | ({ kind: 'branch' } & BranchBuild)
  | { kind: 'all-but-mains' };

/**
 * Deletes preview databases in the blog groups. `<group>-main` databases are
 * never selected. Returns the names of the selected databases.
 */
export async function cleanupPreviewDatabases({
  turso,
  target,
  dryRun,
}: {
  turso: TursoApi;
  target: CleanupTarget;
  dryRun: boolean;
}): Promise<string[]> {
  const groups = await listBlogGroups(turso);
  const mains = new Set(groups.map(mainDbName));
  const databases = (
    await Promise.all(
      groups.map((group) => turso.client.databases.list({ group })),
    )
  )
    .flat()
    .map((db) => db.name)
    .filter((name) => !mains.has(name));

  const toDelete =
    target.kind === 'all-but-mains'
      ? databases
      : selectBranchBuilds(databases, target);

  console.log(`Found ${toDelete.length} database(s) to delete`);
  for (const name of toDelete) {
    if (dryRun) {
      console.log(`[dry run] would delete ${name}`);
      continue;
    }
    await turso.client.databases.delete(name);
    console.log(`Deleted ${name}`);
  }
  return toDelete;
}
