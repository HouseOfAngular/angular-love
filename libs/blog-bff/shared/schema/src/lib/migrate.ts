import { parseArgs } from 'util';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

const { values } = parseArgs({
  args: process.argv,
  options: {
    'all-regions': { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
  },
  strict: false,
  allowPositionals: true,
});

if (values['all-regions']) {
  await migrateAllRegions({ dryRun: values['dry-run'] });
} else {
  await migrateSingleTarget();
}

async function migrateSingleTarget() {
  const url = process.env.DATABASE_URL ?? 'file:./local.db';
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  console.log(`Migrating: ${url}`);
  const client = drizzle({ connection: { url, authToken } });
  await migrate(client, { migrationsFolder: './drizzle' });
  console.log('Done.');
}

async function migrateAllRegions({ dryRun }: { dryRun: boolean }) {
  // ...iterate blog groups via Turso API, same pattern as insert.ts
}
