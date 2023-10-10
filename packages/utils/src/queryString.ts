export type QueryObject = {
  [key: string]: string;
};

export const getQuery = (urlQuery: string, queries: string[]) => {
  const parsedQuery = new URLSearchParams(urlQuery);
  const queryObj: QueryObject = {};
  for (const query of queries) {
    const queryValue = parsedQuery.get(query);
    queryObj[query] = queryValue || '';
  }

  return queryObj;
};
