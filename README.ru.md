# `MiniframeJS/Router`

Простое и мощное решение для маршрутизации в приложениях на `Express.js`, которое предоставляет чистый и интуитивно понятный способ организации маршрутов и контроллеров.

## Возможности

- Простой синтаксис определения маршрутов
- Действия на основе контроллеров
- Группировка маршрутов для улучшенной организации
- Автоматическая загрузка контроллеров

## Использование

### Базовые маршруты

`routes/index.ts`

```ts
import { root, get, post, getRouter } from "miniframe-router";

// Определение корневого маршрута
root("index#index");

// Определение GET и POST маршрутов
get("/users", "users#show");
post("/users", "users#update");

// Определение GET и POST маршрутов
get("/posts", "posts#show");
post("/posts", "posts#update");

export default getRouter;
```

Структура файлов приложения:

```bash
src
  index.ts

  routes/
      index.ts
  controllers/
      indexController.ts
      usersController.ts
      postsController.ts
```

`index.ts`

```ts
import cors from "cors";
import cookieParser from "cookie-parser";
import getRoutes from "./routes"; // <<< ОПРЕДЕЛЯЕМ МАРШРУТЫ

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(getRoutes()); // <<< ИСПОЛЬЗУЕМ МАРШРУТЫ

app.listen(4000, () => {
  console.log(`Сервер запущен на порту: 4000`);
});
```

### Группировка маршрутов

Группируйте связанные маршруты под общим префиксом:

`routes/index.ts`

```ts
import {
  root,
  get,
  post,
  getRouter,
  routeScope as scope,
} from "miniframe-router/routes";

scope("admin", () => {
  get("/users", "users#show");
  post("/users", "users#update");

  get("/posts", "posts#show");
  post("/posts", "posts#update");
});

export default getRouter;
```

Это создаст маршруты:

- GET `/admin/users` -> `controllers/admin/usersController.ts` (действие `show`)
- POST `/admin/users` -> `controllers/admin/usersController.ts` (действие `update`)
- GET `/admin/posts` -> `controllers/admin/postsController.ts` (действие `show`)
- POST `/admin/posts` -> `controllers/admin/postsController.ts` (действие `update`)

### Структура контроллеров

Контроллеры должны находиться в директории `controllers`. Для маршрутов с префиксами контроллеры автоматически ищутся в соответствующих поддиректориях.

```bash
src
  index.ts

  routes/
      index.ts
  controllers/
      indexController.ts
      usersController.ts
      postsController.ts

      admin/
          usersController.ts
          postsController.ts
```

Пример контроллера:

`controllers/usersController.ts`

```typescript
import { Request, Response } from "express";

export const show = (req: Request, res: Response) => {
  res.send("Список пользователей");
};

export const update = (req: Request, res: Response) => {
  res.send("Пользователь обновлен");
};
```

## Справочник по API

- `root(controllerAction)`: Определяет корневой маршрут (/)
- `get(path, controllerAction)`: Определяет GET маршрут
- `post(path, controllerAction)`: Определяет POST маршрут
- `routeScope(prefix, callback)`: Группирует маршруты под общим префиксом

### License

MIT.

### Author

Ilya N. Zykin | [the-teacher](https://github.com/the-teacher)
