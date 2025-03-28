import type { SQLiteSelect } from 'drizzle-orm/sqlite-core';

export const getPagination = (query: Record<string, string>) => {
  const defaultPaginationQuery = {
    skip: '0',
    take: '12',
  };

  const take = query.take || defaultPaginationQuery.take;
  const skip = query.skip || defaultPaginationQuery.skip;
  const page = Math.floor(Number(skip) / Number(take)) + 1;

  return {
    per_page: take,
    page: page,
  };
};

export function withPagination<T extends SQLiteSelect>(
  qb: T,
  page = 1,
  pageSize = 6,
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize);
}
