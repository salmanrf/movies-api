import { DataSource } from "typeorm";

export let AppDataSource: DataSource;

export function initDataSource() {
  AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: +process.env.DB_PORT,
    entities: ["dist/models/entities/**/*.js"],
    synchronize: true,
    logging: true,
  });

  return AppDataSource;
}
