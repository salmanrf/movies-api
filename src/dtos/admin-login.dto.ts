import { z } from "zod";

export const AdminLoginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "email must be specified.",
      })
      .email("not a valid email.")
      .min(6)
      .max(25),
    password: z
      .string({
        required_error: "password must be specified.",
      })
      .min(6),
  }),
});

export interface AdminLoginDto {
  email: string;
  password: string;
}
