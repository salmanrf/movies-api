export interface PaginationRequest {
  page: number | string;

  limit: number | string;

  sort_field: string;

  sort_order: "ASC" | "DESC";
}
