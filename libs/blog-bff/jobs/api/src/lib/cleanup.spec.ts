import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { selectBranchBuilds } from './cleanup';

describe('selectBranchBuilds', () => {
  const databases = [
    'blog-eu-main',
    'eu-dev-my-branch-10-11111',
    'usw-dev-my-branch-10-11111',
    'use-dev-my-branch-11-22222',
    'eu-dev-my-branch-12-33333',
    'eu-dev-my-branch-extra-5-44444',
    'eu-prod-my-branch-1-55555',
    'other-dev-my-branch-1-66666',
  ];

  it('selects older builds of the branch in every group, keeping the hash', () => {
    assert.deepEqual(
      selectBranchBuilds(databases, {
        env: 'dev',
        branch: 'my-branch',
        build: 12,
        hash: '22222',
      }),
      ['eu-dev-my-branch-10-11111', 'usw-dev-my-branch-10-11111'],
    );
  });

  it('selects every build when the PR is closed', () => {
    assert.deepEqual(
      selectBranchBuilds(databases, {
        env: 'dev',
        branch: 'my-branch',
        build: 99999,
        hash: '0',
      }),
      [
        'eu-dev-my-branch-10-11111',
        'usw-dev-my-branch-10-11111',
        'use-dev-my-branch-11-22222',
        'eu-dev-my-branch-12-33333',
      ],
    );
  });

  it('never matches branches that merely share a prefix', () => {
    assert.deepEqual(
      selectBranchBuilds(['eu-dev-fix-menu-1-11111'], {
        env: 'dev',
        branch: 'fix',
        build: 99999,
        hash: '0',
      }),
      [],
    );
  });
});
