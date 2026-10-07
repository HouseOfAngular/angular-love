import { openAsBlob } from 'node:fs';
import { createClient as createLibsqlClient } from '@libsql/client';
import { createClient } from '@tursodatabase/api';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';

export type TursoApi = ReturnType<typeof createTursoApi>;

/** Blog databases live in groups prefixed with `blog-`, one `<group>-main` per group. */
export const BLOG_GROUP_PREFIX = 'blog-';
export const MAIN_DB_SUFFIX = 'main';

export const mainDbName = (group: string) => `${group}-${MAIN_DB_SUFFIX}`;

export function createTursoApi({ org, token }: { org: string; token: string }) {
  const client = createClient({ org, token });

  async function api<T>(path: string, init: RequestInit): Promise<T> {
    const response = await fetch(
      `https://api.turso.tech/v1/organizations/${org}/${path}`,
      {
        ...init,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      throw new Error(
        `Turso API ${init.method} ${path} failed: ${response.status} ${body?.error ?? response.statusText}`,
      );
    }
    return (await response.json()) as T;
  }

  /**
   * Creates a database auth token via a direct API call, bypassing
   * `databases.createToken()`, which always sends a `permissions.read_attach`
   * body that AWS-hosted Turso databases reject.
   */
  async function createDatabaseToken(
    dbName: string,
    options: {
      authorization: 'full-access' | 'read-only';
      expiration: string;
    } = { authorization: 'full-access', expiration: '1h' },
  ): Promise<string> {
    const params = new URLSearchParams(options);
    const { jwt } = await api<{ jwt: string }>(
      `databases/${dbName}/auth/tokens?${params}`,
      { method: 'POST' },
    );
    return jwt;
  }

  /**
   * Creates an empty database awaiting an upload (`database_upload` seed),
   * which the typed client does not support.
   */
  async function createDatabaseForUpload(
    dbName: string,
    group: string,
  ): Promise<{ hostname: string }> {
    const { database } = await api<{ database: { Hostname: string } }>(
      'databases',
      {
        method: 'POST',
        body: JSON.stringify({
          name: dbName,
          group,
          seed: { type: 'database_upload' },
        }),
      },
    );
    return { hostname: database.Hostname };
  }

  return { client, createDatabaseToken, createDatabaseForUpload };
}

/** Lists blog groups (`blog-*`). */
export async function listBlogGroups(turso: TursoApi): Promise<string[]> {
  const groups = await turso.client.groups.list();
  return groups
    .map((group) => group.name)
    .filter((name) => name.startsWith(BLOG_GROUP_PREFIX));
}

/**
 * Prepares a local SQLite file for upload: Turso requires WAL journal mode,
 * and the WAL must be checkpointed so the main file holds every change.
 */
export async function prepareLocalDb(path: string): Promise<void> {
  const client = createLibsqlClient({ url: `file:${path}` });
  try {
    await client.execute('PRAGMA journal_mode=WAL;');
    await client.execute('PRAGMA wal_checkpoint(TRUNCATE);');
    const { rows } = await client.execute('PRAGMA journal_mode;');
    const mode = String(rows[0]?.[0]);
    if (mode !== 'wal') {
      throw new Error(`Expected journal_mode=wal but got "${mode}"`);
    }
  } finally {
    client.close();
  }
}

/** Uploads a local SQLite file to a database created with `seed: database_upload`. */
export async function uploadDatabase(
  path: string,
  hostname: string,
  dbToken: string,
): Promise<void> {
  const response = await fetch(`https://${hostname}/v1/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${dbToken}` },
    body: await openAsBlob(path),
  });
  if (!response.ok) {
    throw new Error(
      `Upload failed (${response.status} ${response.statusText}): ${await response.text()}`,
    );
  }
}

/**
 * Replaces a database with the contents of a local SQLite file without
 * deleting it before the replacement is known to be good:
 *
 * 1. upload the file into a staging database `<dbName>-next` (same group)
 * 2. `validate` the staging database
 * 3. delete `dbName` and recreate it as a copy of the staging database, so it
 *    keeps its name and hostname
 * 4. delete the staging database
 *
 * A failure before step 3 leaves `dbName` untouched. If step 3 fails, the
 * staging database is kept so the data can be restored from it.
 */
export async function replaceDatabase(
  turso: TursoApi,
  dbName: string,
  localDbPath: string,
  validate: (db: LibSQLDatabase) => Promise<void>,
): Promise<void> {
  const { group } = await turso.client.databases.get(dbName);
  if (!group) {
    throw new Error(`Database ${dbName} has no group`);
  }

  const stagingName = `${dbName}-next`;
  await deleteIfExists(turso, stagingName);
  const staging = await turso.createDatabaseForUpload(stagingName, group);
  const stagingToken = await turso.createDatabaseToken(stagingName);
  await uploadDatabase(localDbPath, staging.hostname, stagingToken);
  await validate(
    drizzle({
      connection: {
        url: `libsql://${staging.hostname}`,
        authToken: stagingToken,
      },
    }),
  );

  await turso.client.databases.delete(dbName);
  try {
    await turso.client.databases.create(dbName, {
      group,
      seed: { type: 'database', name: stagingName },
    });
  } catch (error) {
    throw new Error(
      `Deleted ${dbName} but could not recreate it from ${stagingName}, which still holds the new data: ${error}`,
    );
  }
  await turso.client.databases.delete(stagingName);
}

async function deleteIfExists(turso: TursoApi, dbName: string) {
  const exists = await turso.client.databases
    .get(dbName)
    .then(() => true)
    .catch(() => false);
  if (exists) {
    await turso.client.databases.delete(dbName);
  }
}
