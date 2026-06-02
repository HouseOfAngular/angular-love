/** Runs `fn` over `items` with at most `concurrency` calls in flight. */
export async function forEachConcurrent<T>(
  items: readonly T[],
  concurrency: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error(`Invalid concurrency: ${concurrency}`);
  }
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      await fn(items[next++]);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, worker),
  );
}

export async function retry<T>(
  fn: () => Promise<T>,
  { attempts = 3, delayMs = 1000 } = {},
): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }
}
