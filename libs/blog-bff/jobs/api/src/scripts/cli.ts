export function requireEnv<const K extends string[]>(
  ...keys: K
): { [I in keyof K]: string } {
  const values = keys.map((key) => process.env[key]);
  const missing = keys.filter((_, i) => !values[i]);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  return values as { [I in keyof K]: string };
}

/** Runs a script and exits non-zero on failure so Jenkins marks the build red. */
export function run(main: () => Promise<void>): void {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(
        error instanceof Error ? (error.stack ?? error.message) : error,
      );
      process.exit(1);
    });
}
