import { SORT_BY_PROPS, SORT_ORDER } from '../constants/index.js';

export const parseSortParams = (query) => {
  const sortOrder = SORT_ORDER.includes(query.sortOrder)
    ? query.sortOrder
    : 'asc';

  const sortBy = SORT_BY_PROPS.includes(query.sortBy) ? query.sortBy : 'name';

  return {
    sortOrder,
    sortBy,
  };
};
