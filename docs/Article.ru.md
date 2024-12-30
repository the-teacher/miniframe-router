## Роутер для Express.JS приложений

**[miniframe-router](https://www.npmjs.com/package/miniframe-router)** — минималистичный роутер для Express.JS приложений в стиле Ruby on Rails и как я его сделал.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/p5t1zaooq2323t3sxf37.png)

---

Пример того, как может выглядеть роутинг в простом приложении.

```js
// Root routes
root("index#home");

// Basic CRUD routes
get("/users", "users#index");
get("/users/:id", "users#show");
post("/users", "users#create");
post("/users/:id", "users#update");
post("/users/:id/destroy", "users#destroy");

// Posts routes with scope
scope("blog", () => {
  get("/posts", "posts#index");
  get("/posts/:id", "posts#show");
  post("/posts", "posts#create");
  post("/posts/:id", "posts#update");
  post("/posts/:id/destroy", "posts#destroy");
});
```

### Ситуация

Я не писал NodeJS приложений около 10 лет. Заинтересовавшись Telegram Mini Apps, решил сделать несколько простых проектов для освоения новой предметной области.

Для этого мне понадобился роутинг в Backend-части приложений. Обзор готовых решений не впечатлил, поэтому решил создать свое, максимально простое и удобное, вдохновленное стилем Ruby on Rails. Это также стало отличным поводом вспомнить создание NPM-пакетов спустя 9 лет.

---

## Дизайн

### Что я ожидаю от своего роутера:

1. **Роутинг определяется в отдельном файле**

   Это упрощает структуру приложения, избегая визуального загрязнения.

```js
import {
  root,
  get,
  post,
  routeScope as scope,
  getRouter,
} from "miniframe-router";

// Root routes
root("index#home");

// Basic CRUD routes
get("/users", "users#index");
get("/users/:id", "users#show");
post("/users", "users#create");
post("/users/:id", "users#update");
post("/users/:id/destroy", "users#destroy");

// Posts routes with scope
scope("blog", () => {
  get("/posts", "posts#index");
  get("/posts/:id", "posts#show");
  post("/posts", "posts#create");
  post("/posts/:id", "posts#update");
  post("/posts/:id/destroy", "posts#destroy");
});

export default getRouter;
```

2. **Подключение роутера в основной файл ExpressJS**

   Простая и эффективная точка входа в приложение: `src/index.js` или `src/main.js`.

```js
import express from "express";
import getRouter from "./routes"; // <<< DEFINE ROUTES

const app = express();
app.use(express.json());
app.use(getRouter()); // <<< USER ROUTES

app.listen(3000, () => {
  console.log("Demo app is running on http://localhost:3000");
});
```

3. **Следование соглашениям о подключении обработчиков из контроллеров**

Контроллеры располагаются в каталоге `src/controllers`.

```bash
MyApp
└── src
    ├── controllers
    │   ├── blog
    │   │   └── postsController.ts
    │   ├── indexController.ts
    │   └── usersController.ts
    ├── index.ts
    └── routes
        └── index.ts
```

### File Structure

- Роуты определяются в `src/routes/index.js`.
- Контроллеры содержат логику работы с запросами:

Например, `src/controllers/usersController.ts` (или `.js`).

```ts
import { Request, Response } from "express";

export const index = (req: Request, res: Response) => {
  res.send("List of all users");
};

export const show = (req: Request, res: Response) => {
  const { id } = req.params;
  res.send(`Showing details for user ${id}`);
};

export const create = (req: Request, res: Response) => {
  const userData = req.body;
  res.send(`Creating new user with data: ${JSON.stringify(userData)}`);
};

export const update = (req: Request, res: Response) => {
  const { id } = req.params;
  const userData = req.body;
  res.send(`Updating user ${id} with data: ${JSON.stringify(userData)}`);
};

export const destroy = (req: Request, res: Response) => {
  const { id } = req.params;
  res.send(`Deleting user ${id}`);
};
```

---

## Реализация

### Этапы работы:

1. Создание контейнера для разработки с помощью **Docker**.
2. Установка **ESLint** для компиляции TypeScript в JavaScript.
3. Установка **Jest** для тестирования.
4. Написание тестов для проверки первой версии роутера.
5. Реализация роутера до прохождения всех тестов.
6. Восстановление логина и пароля для NPM (9 лет спустя).
7. Публикация NPM-пакета версии `1.0.0`.
8. Исправление критических багов и удаление версий `1.0.0` и `1.1.0`.
9. Применение роутера в production проекте с десятком роутов.

---

### Вопросы и ответы

#### Зачем вообще это делать? Столько всего уже придумано!

- Это **интересно**, **полезно** и позволяет добавлять разнообразие в решения.

#### Почему так просто? Надо усложнить!

- Придерживаюсь принципа **KISS**. Усложнять будем только при необходимости.

#### Зачем контроллеры? Они не нужны.

- Контроллеры удобны для небольших проектов. Более сложные абстракции, такие как Action/Operation-like, актуальны для крупных систем.

#### Это решение работоспособно?

- Да! Роутер использовался в мини-приложении которое прекрасно себя показало в production. Приложение было сделано на NodeJS/React и содержало несколько десятков роутов.

#### Для проектов какого размера можно использовать?

- **`miniframe-router`** подходит для приложений с десятками роутов. Ограничений по размеру нет.

---

## Итог

Код проекта и документация: [GitHub - miniframe-router](https://github.com/the-teacher)

NPM пакет: [miniframe-router](https://www.npmjs.com/package/miniframe-router)

Лайк, шер, репост и подписка приветствуются. Конструктивный фидбек всегда ценен!

Страница автора: [GitHub - the-teacher](https://github.com/the-teacher)
