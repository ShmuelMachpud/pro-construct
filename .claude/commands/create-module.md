Create a new backend module following the shared microservices architecture and conventions defined in CLAUDE.md.

## Before creating any files, ask the user:

1. **Module name** — What should the module be called? (e.g. `users`, `projects`, `clients`)
2. **Server** — Scan the project root for directories that contain a `src/` subdirectory. Present those as the available servers and ask the user which one to add the module to.
3. **CRUD?** — Should the module include basic CRUD operations (getAll, getById, create, update, delete)?
4. **Entity?** — Should the module include an entity file with basic fields (id, createdAt, updatedAt)?

Wait for the user's answers before proceeding.

Use the answers to set:
- `MODULE` = the module name the user provided (lowercase)
- `SERVER` = the server directory the user selected (e.g. `server`, `auth-service`)
- `BASE` = `<SERVER>/src/<MODULE>` — the root of all new files

---

## Module name rules

- Directory name: lowercase as given (e.g. `users`)
- Entity/class name: PascalCase singular (e.g. `User`)
- Function suffix: camelCase plural matching the directory (e.g. `getUsersService`, `createUserDal`)
- Router export: `export const <module>Router = Router()`

---

## Always create these 7 files

All paths below use `BASE` = `<SERVER>/src/<MODULE>`.

---

### `<BASE>/routes/<MODULE>.router.ts`

**Without CRUD:**
```ts
import { Router } from "express";

export const <MODULE>Router = Router();
```

**With CRUD:**
```ts
import { Router } from "express";
import { getAll<MODULEs>, get<MODULE>ById, create<MODULE>, update<MODULE>, remove<MODULE> } from "../controllers/<MODULE>.controller";

export const <MODULE>Router = Router();

<MODULE>Router.get("/", getAll<MODULEs>);
<MODULE>Router.get("/:id", get<MODULE>ById);
<MODULE>Router.post("/", create<MODULE>);
<MODULE>Router.put("/:id", update<MODULE>);
<MODULE>Router.delete("/:id", remove<MODULE>);
```

---

### `<BASE>/controllers/<MODULE>.controller.ts`

**Without CRUD:** empty file with only the imports needed.

**With CRUD:**
```ts
import { Request, Response } from "express";
import { handleError } from "../../utils/handleError";
import {
  getAll<MODULEs>Service,
  get<MODULE>ByIdService,
  create<MODULE>Service,
  update<MODULE>Service,
  remove<MODULE>Service,
} from "../services/<MODULE>.service";

export const getAll<MODULEs> = async (req: Request, res: Response) => {
  try {
    const items = await getAll<MODULEs>Service();
    res.status(200).json(items);
  } catch (error) {
    handleError(error, res);
  }
};

export const get<MODULE>ById = async (req: Request, res: Response) => {
  try {
    const item = await get<MODULE>ByIdService(Number(req.params.id));
    res.status(200).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const create<MODULE> = async (req: Request, res: Response) => {
  try {
    const item = await create<MODULE>Service(req.body);
    res.status(201).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const update<MODULE> = async (req: Request, res: Response) => {
  try {
    const item = await update<MODULE>Service(Number(req.params.id), req.body);
    res.status(200).json(item);
  } catch (error) {
    handleError(error, res);
  }
};

export const remove<MODULE> = async (req: Request, res: Response) => {
  try {
    await remove<MODULE>Service(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
};
```

---

### `<BASE>/services/<MODULE>.service.ts`

**Without CRUD:** empty file.

**With CRUD:**
```ts
import { CustomError } from "../../utils/customError";
import { findAll<MODULEs>, find<MODULE>ById, insert<MODULE>, update<MODULE>ById, delete<MODULE> } from "../dal/<MODULE>.dal";

export const getAll<MODULEs>Service = async () => {
  try {
    return await findAll<MODULEs>();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const get<MODULE>ByIdService = async (id: number) => {
  try {
    const item = await find<MODULE>ById(id);
    if (!item) throw new CustomError("<MODULE> not found", 404);
    return item;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const create<MODULE>Service = async (dto: Create<MODULE>Dto) => {
  try {
    return await insert<MODULE>(dto);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const update<MODULE>Service = async (id: number, dto: Update<MODULE>Dto) => {
  try {
    const item = await update<MODULE>ById(id, dto);
    if (!item) throw new CustomError("<MODULE> not found", 404);
    return item;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const remove<MODULE>Service = async (id: number) => {
  try {
    const deleted = await delete<MODULE>(id);
    if (!deleted) throw new CustomError("<MODULE> not found", 404);
  } catch (error) {
    return Promise.reject(error);
  }
};
```

> **Note:** Define `Create<MODULE>Dto` and `Update<MODULE>Dto` in `types/<MODULE>.types.ts`.

---

### `<BASE>/dal/<MODULE>.dal.ts`

**Without CRUD:** empty file.

**With CRUD:**
```ts
import { AppDataSource } from "../../config/database";
import { <MODULE> } from "../model/<MODULE>.entity";

const repository = AppDataSource.getRepository(<MODULE>);

export const findAll<MODULEs> = async () => {
  return await repository.find({ order: { createdAt: "DESC" } });
};

export const find<MODULE>ById = async (id: number) => {
  return await repository.findOne({ where: { id } });
};

export const insert<MODULE> = async (data: Partial<<MODULE>>) => {
  const item = repository.create(data);
  return await repository.save(item);
};

export const update<MODULE>ById = async (id: number, data: Partial<<MODULE>>) => {
  await repository.update(id, data);
  return await repository.findOne({ where: { id } });
};

export const delete<MODULE> = async (id: number) => {
  const result = await repository.delete(id);
  return (result.affected ?? 0) > 0;
};
```

---

### `<BASE>/helpers/<MODULE>.helpers.ts`

Always create as an empty file.

---

### `<BASE>/types/<MODULE>.types.ts`

**Without CRUD:** create as an empty file.

**With CRUD:**
```ts
export interface Create<MODULE>Dto {
}

export interface Update<MODULE>Dto {
}
```

---

### `<BASE>/model/<MODULE>.entity.ts`

**Without Entity option:** create as an empty file.

**With Entity option:**
```ts
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class <MODULE> {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## After creating all files

Check if `<SERVER>/tsconfig.json` contains `"strictPropertyInitialization": false`. If it does not, add it under `compilerOptions` — this is required for TypeORM entities to compile without errors.

Remind the user to:
1. Register the new router in `<SERVER>/src/middleware/router.ts`
2. Add the entity to the DataSource entities array in `<SERVER>/src/config/database.ts` (if an entity was created)
