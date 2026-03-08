import { DataSource } from "typeorm";
import { ENV } from "./environments";
import { User } from "../entities/User";
import { Client } from "../entities/Client";
import { Project } from "../entities/Project";
import { Employee } from "../entities/Employee";
import { Task } from "../entities/Task";
import { Expense } from "../entities/Expense";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: ENV.DB_URL,
  synchronize: true,
  logging: true,
  entities: [User, Client, Project, Employee, Task, Expense],
});