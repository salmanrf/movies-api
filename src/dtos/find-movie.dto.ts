import { z } from "zod";
import { PaginationRequest } from "./pagination.dto";

export const FindMovieSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sort_field: z.string(),
    sort_order: z.string(),
  }),
});

export interface FindMovieDto extends PaginationRequest {
  title: string;
  duration: number;
  watch_url: string;
  description: string;
  artists: string[];
  genres: string[];
}

export class PaginatedResponse<T> {
  total_items: number;
  total_pages: number;
  page: number;
  limit: number;
  sort_field: string;
  sort_order: string;
  items: T[];
}
