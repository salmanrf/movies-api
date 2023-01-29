import { NextFunction, Request, Response } from "express";
import { AppError } from "../common/utils/custom-error";
import { JwtVerify } from "../common/utils/jwt-utils";

export async function AuthorizeAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers["authorization"];

    if (!authorization) {
      throw new AppError("Unauthorized", 401);
    }

    const token = authorization.split(" ").pop();

    const decoded = await JwtVerify(token, "levitation");

    req["decoded"] = decoded;

    next();
  } catch (error) {
    throw error;
  }
}
