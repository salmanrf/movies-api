import express, { Request, Response } from "express";
import { DataSource } from "typeorm";
import { AppError } from "./common/utils/custom-error";
import { initDataSource } from "./database/data-source";

export class Server {
  private readonly app: express.Application;
  private readonly dataSource: DataSource;

  constructor() {
    this.app = express();
    this.dataSource = initDataSource();
  }

  public config() {
    this.app.set("port", process.env.PORT || 3000);
  }

  public setupRoutes() {
    this.app.use("/", (err: AppError, req: Request, res: Response) => {
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
