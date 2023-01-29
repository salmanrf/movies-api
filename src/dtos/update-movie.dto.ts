import { z } from "zod";

export const UpdateMovieSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "movie must be specified.",
      })
      .max(255)
      .optional(),
    duration: z
      .number({
        required_error: "duration must be specified in minutes.",
      })
      .min(1)
      .optional(),
    description: z
      .string({
        required_error: "description must be specified.",
      })
      .optional(),
    watch_url: z
      .string({
        required_error: "watch_url must be specified.",
      })
      .optional(),
    artists: z.number().array().optional(),
    genres: z.number().array().optional(),
  }),
});

export interface UpdateMovieDto {
  title?: string;
  duration?: number;
  watch_url?: string;
  description?: string;
  artists?: number[];
  genres?: number[];
}
