import { DataSource } from "typeorm";
import { ENV } from "./environments";
import { Client } from "../clients/model/client.entity";
import { Project } from "../projects/model/project.entity";
// import { User } from "../users/model/user.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: ENV.DB_URL,
  synchronize: true,
  logging: false,
  entities: [Client, Project],
});
