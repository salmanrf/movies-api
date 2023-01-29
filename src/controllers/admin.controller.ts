import { Request, Response, Router } from "express";
import { request } from "http";
import { AdminLoginSchema } from "../dtos/admin-login.dto";
import { CreateAdminSchema } from "../dtos/create-admin.dto";
import { Validate } from "../dtos/validate";
import { AdminService } from "../services/admin.service";

export class AdminController {
  private router: Router;
  private adminService: AdminService;

  constructor() {
    this.router = Router();
    this.adminService = new AdminService();

    this.setupRoutes();
  }

  getRouter(): Router {
    return this.router;
  }

  private setupRoutes() {
    this.router.get("/:admin_id", this.findOne);
    this.router.post("/login", Validate(AdminLoginSchema), this.login);
    this.router.post("/", Validate(CreateAdminSchema), this.create);
  }

  private findOne = async (req: Request, res: Response) => {
    return res.send("an admin");
  };

  private create = async (req: Request, res: Response) => {
    const { body } = req;

    const result = await this.adminService.create(body);

    return res.status(201).json({
      status: true,
      data: result,
    });
  };

  private login = async (req: Request, res: Response) => {
    const { body } = req;

    const result = await this.adminService.login(body);

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
  };
}
