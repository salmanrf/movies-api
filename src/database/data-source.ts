import { DataSource } from "typeorm";

export let AppDataSource: DataSource;

export function initDataSource() {
  AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    password: "wildflower123",
    database: "movies",
    port: 5435,
    entities: ["dist/models/entities/**/*.js"],
    synchronize: true,
    logging: true,
  });

  return AppDataSource;
}
