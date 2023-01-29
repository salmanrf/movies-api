import { NextFunction, Request, Response } from "express";
import { AppError } from "../common/utils/custom-error";
import { AnyZodObject, ZodError } from "zod";

export function Validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: false,
          errors: error,
        });
      }
    }
  };
}
