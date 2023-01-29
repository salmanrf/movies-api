import { NextFunction, Request, Response, Router } from "express";
import { request } from "http";
import { AdminLoginSchema } from "../dtos/admin-login.dto";
import { CreateAdminSchema } from "../dtos/create-admin.dto";
import { Validate } from "../dtos/validate";
import { AuthorizeUser } from "../middlewares/authorization";
import { UserService } from "../services/user.service";

export class UserController {
  private router: Router;
  private userService: UserService;

  constructor() {
    this.router = Router();
    this.userService = new UserService();

    this.setupRoutes();
  }

  getRouter(): Router {
    return this.router;
  }

  private setupRoutes() {
    this.router.post("/login", Validate(AdminLoginSchema), this.login);
    this.router.post("/register", Validate(CreateAdminSchema), this.register);
    this.router.get("/self", AuthorizeUser, this.getSelf);
  }

  private getSelf = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(201).json({
        status: true,
        data: req["decoded"],
      });
    } catch (error) {
      next(error);
    }
  };

  private register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;

      const result = await this.userService.register(body);

      return res.status(201).json({
        status: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  private login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;

      const result = await this.userService.login(body);

      res.cookie("access_token", result, {
        httpOnly: true,
        sameSite: "lax",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // ? Expires in 3 days
      });

      return res.status(200).json({
        status: true,
        data: {
          access_token: result,
        },
        message: "Success",
      });
    } catch (error) {
      next(error);
    }
  };
}
