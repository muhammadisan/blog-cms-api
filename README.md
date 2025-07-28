# 📰 Blog CMS API

A simple CMS-style blog backend built with **Node.js**, **Express**, **TypeScript** and **MongoDB**.  
Features:
- **User** CRUD & authentication (JWT)
- **Article** CRUD with draft/published status and ownership checks
- **Page View** tracking, count & aggregation
- Healthcheck endpoint
- Docker & local development support

---

## 🚀 Tech Stack

- **Runtime**: Node.js (v18+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Auth**: JSON Web Tokens (JWT)
- **Password hashing**: bcrypt
- **Validation**: Joi
- **Containerization**: Docker & Docker Compose

---

## 📁 Project Structure

```
src/
├── config/         MongoDB connection
├── controllers/    Request handlers (users, articles, pageviews)
├── middleware/     Auth, error handler, ownership checks
├── models/         Mongoose schemas (User, Article, PageView)
├── routes/         Express routers
├── types/          TS type augmentations
├── utils/          Joi validators
├── app.ts          Express app setup
└── server.ts       Entry point + DB connect + seeding
```

---

## 🔌 Environment

Copy `.env.example` → `.env` and fill:

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/blog_cms
MONGODB_URI_DOCKER=mongodb://mongo:27017/blog_cms
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
BCRYPT_ROUNDS=10
DOCKER_ENV=true
```

- `MONGODB_URI`: local MongoDB URI  
- `MONGODB_URI_DOCKER`: Mongo URI when running in Docker  
- `DOCKER_ENV`: set to `true` in Docker Compose  

---

## 👤 Pre‑seeded Admin User

Upon first startup, the application automatically creates an admin account if it doesn’t exist:

- **Username:** `admin`  
- **Password:** `admin@123`  

Use these credentials to log in immediately via Postman or curl.

---

## 🔧 Running Locally

1. **Install dependencies**  
   ```bash
   npm install
   ```
2. **Start MongoDB** (e.g. `mongod` locally)  
3. **Run in dev mode** (with hot‑reload):  
   ```bash
   npm run dev
   ```
4. **Build & run production**  
   ```bash
   npm run build
   npm start
   ```
5. **Healthcheck**  
   ```
   GET http://localhost:4000/healthz
   ```

---

## 🐳 Running with Docker

Make sure Docker & Docker Compose are installed.

1. **Build & start services**  
   ```bash
   docker-compose up --build -d
   ```
2. **Logs**  
   ```bash
   docker-compose logs -f api
   ```
3. **Healthcheck**  
   ```
   curl http://localhost:4000/healthz
   ```
4. **Stop & remove**  
   ```bash
   docker-compose down
   ```

---

## 🔗 Available Routes

> All routes are prefixed with `/api` (except healthcheck)

### Auth
- `POST /api/auth/login`  
- `POST /api/auth/logout`

### Users
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`

### Articles
- `GET /api/articles`
- `GET /api/articles/:id`
- `GET /api/articles/draft/:id`
- `POST /api/articles`
- `PATCH /api/articles/:id`
- `DELETE /api/articles/:id`

### Page Views
- `POST /api/page-views`
- `GET /api/page-views/count`
- `GET /api/page-views/aggregate-date`

### Healthcheck
- `GET /healthz`

---

## 📝 License

MIT © 2025
