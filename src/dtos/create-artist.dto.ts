import { z } from "zod";

export const CreateArtistSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "name must be specified.",
      })
      .max(255),
  }),
});

export interface CreateArtistDto {
  name: string;
}
