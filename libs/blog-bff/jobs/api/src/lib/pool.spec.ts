import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { forEachConcurrent, retry } from './pool';

describe('forEachConcurrent', () => {
  it('processes every item with bounded concurrency', async () => {
    let active = 0;
    let maxActive = 0;
    const seen: number[] = [];

    await forEachConcurrent([1, 2, 3, 4, 5, 6, 7], 3, async (item) => {
      maxActive = Math.max(maxActive, ++active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      seen.push(item);
      active--;
    });

    assert.deepEqual(
      seen.sort((a, b) => a - b),
      [1, 2, 3, 4, 5, 6, 7],
    );
    assert.equal(maxActive, 3);
  });

  it('rejects an invalid concurrency instead of processing nothing', async () => {
    for (const concurrency of [0, -1, Number.NaN, 1.5]) {
      await assert.rejects(
        forEachConcurrent([1], concurrency, async () => undefined),
        /Invalid concurrency/,
      );
    }
  });

  it('rejects when an item fails', async () => {
    await assert.rejects(
      forEachConcurrent([1, 2], 2, async (item) => {
        if (item === 2) throw new Error('boom');
      }),
      /boom/,
    );
  });
});

describe('retry', () => {
  it('retries until success', async () => {
    let calls = 0;
    const result = await retry(
      async () => {
        if (++calls < 3) throw new Error('flaky');
        return 'ok';
      },
      { delayMs: 1 },
    );
    assert.equal(result, 'ok');
    assert.equal(calls, 3);
  });

  it('gives up after the last attempt', async () => {
    await assert.rejects(
      retry(
        async () => {
          throw new Error('down');
        },
        { attempts: 2, delayMs: 1 },
      ),
      /down/,
    );
  });
});
