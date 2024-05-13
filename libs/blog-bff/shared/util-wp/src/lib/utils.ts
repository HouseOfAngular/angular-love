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
