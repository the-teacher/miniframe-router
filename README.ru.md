# `MiniframeJS/Router`

Простое и мощное решение для маршрутизации в приложениях на `Express.js`, которое предоставляет чистый и интуитивно понятный способ организации маршрутов и действий.

## Возможности

- Простой синтаксис определения маршрутов (похож на фреймворк Rails)
- Подход, основанный на действиях (похож на фреймворк Hanami)
- Каждое действие в отдельном файле для лучшей поддерживаемости
- Группировка маршрутов для улучшенной организации
- Автоматическая загрузка действий

## Документация

- Development: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- Разработка (RU): [docs/DEVELOPMENT.ru.md](docs/DEVELOPMENT.ru.md)
- Скелет приложения: [docs/demo/README.md](docs/demo/README.md)

## Установка

```bash
npm install miniframe-router
```

```bash
yarn add miniframe-router
```

```bash
pnpm add miniframe-router
```

## Использование

### Базовые маршруты

`routes/index.ts`

```ts
import { root, get, post, getRouter } from "miniframe-router";

// Определение корневого маршрута
root("index#index");  // Использует src/actions/index/indexAction.ts

// Определение GET и POST маршрутов
get("/users", "users#show");    // Использует src/actions/users/showAction.ts
post("/users", "users#create"); // Использует src/actions/users/createAction.ts
```

### Структура файлов действий

Каждое действие определяется в своём собственном файле и **должно экспортировать функцию `perform`**:

```bash
src/
  actions/
    index/
      indexAction.ts    # обработчик для root("index#index")
    users/
      showAction.ts     # обработчик для get("/users", "users#show")
      createAction.ts   # обработчик для post("/users", "users#create")
    admin/
      users/
        listAction.ts   # обработчик для get("/users", "admin/users#list") в scope admin
```

Пример файла действия:

```typescript
// src/actions/users/showAction.ts
import { Request, Response } from "express";

// perform is a required method for each action
export const perform = (req: Request, res: Response) => {
  res.json({ message: "List of users" });
};
```

### Группировка маршрутов

Группируйте связанные маршруты под общим префиксом:

```ts
scope("admin", () => {
  get("/users", "admin/users#list");   // Использует src/actions/admin/users/listAction.ts
  post("/users", "admin/users#create"); // Использует src/actions/admin/users/createAction.ts
});
```

### Маршруты с Middleware

Вы можете добавлять middleware к любому маршруту:

```ts
import { authenticate } from "./middlewares/auth";
import { validateUser } from "./middlewares/validation";

// Один middleware
get("/users/:id", "users#show", {
  withMiddlewares: [authenticate],
});

// Несколько middleware в порядке выполнения
post("/users", "users#create", {
  withMiddlewares: [authenticate, validateUser],
});

// Middleware в сгруппированных маршрутах
scope("admin", () => {
  get("/users", "users#show", {
    withMiddlewares: [authenticate],
  });

  post("/users", "users#create", {
    withMiddlewares: [authenticate, validateUser],
  });
});
```

### Группировка маршрутов с Middleware

Вы можете добавлять middleware как к отдельным маршрутам, так и ко всей группе маршрутов:

```ts
import { authenticate } from "./middlewares/auth";
import { validateUser } from "./middlewares/validation";
import { logRequest } from "./middlewares/logging";

// Применить middleware ко всем маршрутам в группе
scope("admin", () => {
    // Эти маршруты будут требовать аутентификации
    get("/users", "users#index");
    post("/users", "users#create");

    // Этот маршрут будет требовать и аутентификации, и валидации
    post("/users/:id", "users#update", {
      withMiddlewares: [validateUser],
    });
  },
  { withMiddlewares: [authenticate] }
);

// Комбинирование нескольких middleware для группы
scope("api", () => {
    get("/stats", "stats#index");
    get("/health", "health#check");
  },
  { withMiddlewares: [authenticate, logRequest] }
);
```

Middleware, указанные в опциях группы, будут применяться ко всем маршрутам внутри этой группы. При этом вы можете добавлять дополнительные middleware к конкретным маршрутам, которые будут выполняться после middleware группы.

Структура файлов приложения:

```bash
src/
  index.ts
  routes/
    index.ts
  actions/
    index/
      indexAction.ts
    users/
      showAction.ts
      createAction.ts
      updateAction.ts
    posts/
      showAction.ts
      createAction.ts
    admin/
      users/
        listAction.ts
        createAction.ts
      posts/
        listAction.ts
        updateAction.ts
```

`index.ts`

```ts
import cors from "cors";
import cookieParser from "cookie-parser";
import getRoutes from "./routes";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(getRoutes());

app.listen(4000, () => {
  console.log(`Сервер запущен на порту: 4000`);
});
```

### Группировка маршрутов

`routes/index.ts`

```ts
import {
  root,
  get,
  post,
  getRouter,
  routeScope as scope,
} from "miniframe-router";

// Корневой маршрут
root("index#index");  // -> src/actions/index/indexAction.ts

// Базовые маршруты
get("/users", "users#show");      // -> src/actions/users/showAction.ts
post("/users", "users#create");   // -> src/actions/users/createAction.ts

// Группировка маршрутов
scope("admin", () => {
  get("/users", "admin/users#list");    // -> src/actions/admin/users/listAction.ts
  post("/users", "admin/users#create");  // -> src/actions/admin/users/createAction.ts
});

export default getRouter;
```

Это создаст маршруты:
- GET `/` -> `src/actions/index/indexAction.ts`
- GET `/users` -> `src/actions/users/showAction.ts`
- POST `/users` -> `src/actions/users/createAction.ts`
- GET `/admin/users` -> `src/actions/admin/users/listAction.ts`
- POST `/admin/users` -> `src/actions/admin/users/createAction.ts`

## API Reference

- `root(controllerAction)`: Определяет корневой маршрут (/)
- `get(path, controllerAction)`: Определяет GET маршрут
- `post(path, controllerAction)`: Определяет POST маршрут
- `routeScope(prefix, callback)`: Группирует маршруты под общим префиксом

### License

MIT.

### Author

Ilya N. Zykin | [the-teacher](https://github.com/the-teacher)
