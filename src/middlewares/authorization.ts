import { NextFunction, Request, Response } from "express";
import { AppError } from "../common/utils/custom-error";
import { JwtVerify } from "../common/utils/jwt-utils";
import { promiseTuplify } from "../common/utils/promise-utils";

export async function AuthorizeAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers["authorization"];

    if (!authorization) {
      throw new AppError("Unauthorized", 401);
    }

    const token = authorization.split(" ").pop();

    const [decoded, error] = await promiseTuplify(JwtVerify(token, process.env.ADMIN_JWT_SECRET));

    if (error) {
      throw new AppError("Invalid token.", 401);
    }

    req["decoded"] = decoded;

    next();
  } catch (error) {
    next(error);
  }
}

export async function AuthorizeUser(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers["authorization"];

    if (!authorization) {
      throw new AppError("Unauthorized", 401);
    }

    const token = authorization.split(" ").pop();

    const [decoded, error] = await promiseTuplify(JwtVerify(token, process.env.USER_JWT_SECRET));

    if (error) {
      throw new AppError("Invalid token.", 401);
    }

    req["decoded"] = decoded;

    next();
  } catch (error) {
    next(error);
  }
}
