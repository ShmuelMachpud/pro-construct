import { DataSource } from "typeorm";
import { ENV } from "./environment";
import { User } from "../users/model/users.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: ENV.DB_URL,
  synchronize: process.env.NODE_ENV === "development",
  logging: false,
  entities: [User],
});
