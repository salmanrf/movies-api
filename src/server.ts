import express, { NextFunction, Request, Response } from "express";
import { DataSource } from "typeorm";
import { AppError } from "./common/utils/custom-error";
import { AdminController } from "./controllers/admin.controller";
import { MovieController } from "./controllers/movie.contoller";
import { UserController } from "./controllers/user.controller";
import { initDataSource } from "./database/data-source";

export class Server {
  private readonly app: express.Application;
  private readonly dataSource: DataSource;
  private readonly adminController: AdminController;
  private readonly userController: UserController;
  private readonly movieController: MovieController;

  constructor() {
    this.app = express();
    this.dataSource = initDataSource();

    this.adminController = new AdminController();
    this.userController = new UserController();
    this.movieController = new MovieController();
  }

  public config() {
    this.app.set("port", process.env.PORT || 3000);
    this.app.use(express.json());
  }

  public setupRoutes() {
    this.app.use("/api/admins", this.adminController.getRouter());
    this.app.use("/api/users", this.userController.getRouter());
    this.app.use("/api/movies", this.movieController.getRouter());
    this.app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
      return res.status(err.code).json({
        status: false,
        message: err.message,
      });
    });
  }

  public start() {
    this.dataSource
      .initialize()
      .then(() => {
        this.config();

        this.setupRoutes();

        this.app.listen(this.app.get("port"), () => {
          console.log("Server is listening on port ", this.app.get("port"));
        });
      })
      .catch((error) => {
        console.error("Unable to connect to the database. ", error);
      });
  }
}
