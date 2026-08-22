import { PAGINATION } from "./constants.js";

export function parsePagination(query = {}) {
  const page = Math.max(Number(query.page) || PAGINATION.DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(Number(query.limit) || PAGINATION.DEFAULT_LIMIT, 1),
    PAGINATION.MAX_LIMIT,
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function paginatedResult({ items, total, page, limit }) {
  return {
    items,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit) || 0,
    },
  };
}
