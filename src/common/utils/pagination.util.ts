import { PaginatedResponse } from "../../dtos/find-movie.dto";

export interface GetPaginatedDataInput<T> {
  count: number;
  page: number;
  limit: number;
  sort_field: string;
  sort_order: string;
  items: T[];
}

export function GetPagination(page: number, page_size: number): { offset: number; limit: number } {
  let pageNumber = +page;
  let pageSize = +page_size;

  if (isNaN(pageNumber)) {
    pageNumber = 1;
  }

  if (isNaN(pageSize)) {
    pageSize = 10;
  }

  const offset = pageNumber < 1 ? 0 : (pageNumber - 1) * pageSize;

  return {
    offset,
    limit: pageSize,
  };
}

export function GetPaginatedData<T>(input: GetPaginatedDataInput<T>): PaginatedResponse<T> {
  const { count, limit, items, sort_field, sort_order, page } = input;

  const total_pages = Math.ceil(count / limit);

  return {
    total_pages,
    total_items: count,
    page,
    limit,
    sort_field,
    sort_order,
    items,
  };
}
