import { DataSource } from "typeorm";
import { ENV } from "./environments";
import { Client } from "../clients/model/client.entity";
import { Project } from "../projects/model/project.entity";
import { MaterialCategory } from "../material_categories/model/material_category.entity";
import { GlobalMaterial } from "../global_materials/model/global_material.entity";
import { ContractorMaterial } from "../contractor_materials/model/contractor_material.entity";
import { PriceQuote } from "../price_quotes/model/price_quote.entity";
import { QuoteItem } from "../quote_items/model/quote_item.entity";
// import { User } from "../users/model/user.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: ENV.DB_URL,
  synchronize: true,
  logging: false,
  entities: [Client, Project, MaterialCategory, GlobalMaterial, ContractorMaterial, PriceQuote, QuoteItem],
});
