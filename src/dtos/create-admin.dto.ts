import { z } from "zod";

export const CreateAdminSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "email must be specified.",
      })
      .email("not a valid email.")
      .min(6)
      .max(25),
    name: z
      .string({
        required_error: "name must be specified.",
      })
      .min(3)
      .max(100),
    password: z
      .string({
        required_error: "password must be specified.",
      })
      .min(6),
  }),
});

export interface CreateAdminDto {
  email: string;
  name: string;
  password: string;
}
