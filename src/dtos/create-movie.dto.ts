import { z } from "zod";

export const CreateMovieSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "movie must be specified.",
      })
      .max(255),
    duration: z
      .number({
        required_error: "duration must be specified in minutes.",
      })
      .min(1),
    description: z.string({
      required_error: "description must be specified.",
    }),
    watch_url: z.string({
      required_error: "watch_url must be specified.",
    }),
    artists: z
      .number()
      .array()
      .nonempty({ message: "artists must be specified as array of artist_id." }),
    genres: z
      .number()
      .array()
      .nonempty({ message: "artists must be specified as array of artist_id." }),
  }),
});

export interface CreateMovieDto {
  title: string;
  duration: number;
  watch_url: string;
  description: string;
  artists: number[];
  genres: number[];
}
