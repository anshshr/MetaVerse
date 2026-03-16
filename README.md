# MetaVerse Backend

MetaVerse Backend is a TypeScript backend for a multiplayer metaverse-style application. It combines an Express HTTP server, a standalone WebSocket server, and a Prisma/PostgreSQL data layer to manage users, spaces, maps, elements, avatars, and realtime movement.

## Major Details

- Built with Node.js, TypeScript, Express 5, Prisma, PostgreSQL, and `ws`
- Supports role-based authentication for `Admin` and `User`
- Uses Prisma Client generated into `src/generated/prisma`
- Uses Zod for request validation
- Includes Jest and Supertest coverage for HTTP and WebSocket behavior
- Ships with a Dockerfile for containerized deployment

## Architecture Overview

The project is split into a few clear layers:

- HTTP layer for the main application server
- WebSocket layer for realtime room and movement handling
- Prisma layer for database access
- Middleware layer for authentication and authorization
- Test layer for integration and unit-style route/socket verification

At runtime:

- The HTTP server starts from `src/server.ts`
- The WebSocket server is initialized separately from `src/websocket/index.ts`
- Environment variables are loaded from `.env` using `src/config/env.ts`
- Prisma uses PostgreSQL through `src/config/prisma.ts`

## Tech Stack

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- WebSocket (`ws`)
- Zod
- Jest
- Supertest

## Project Structure

```text
src/
  app.ts                 Express app setup
  server.ts              HTTP server bootstrap
  router.ts              Route registration
  config/
    env.ts               Environment loading
    prisma.ts            Prisma client setup
    ws.ts                WebSocket server setup
  http/modules/
    auth/                Authentication logic
    admin/               Admin domain logic
    users/               User domain logic
    space/               Space management logic
    arena/               Arena and element placement logic
  middleware/
    admin.middleware.ts  Admin auth middleware
    user.middleware.ts   User auth middleware
  prisma/
    schema.prisma        Prisma schema
    migrations/          Database migrations
  generated/prisma/      Generated Prisma client
  websocket/
    index.ts             WebSocket bootstrap
    handler/             Room and socket handlers
tests/
  http/                  HTTP tests
  websocket/             WebSocket tests
```

## Environment Variables

The application reads environment values from:

- `.env`
- `src/.env` as a fallback

Create a root `.env` file like this:

```env
PORT=3001
WS_PORT=8080
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/metaverse
USER_JWT_SECRET=change-this-user-secret
ADMIN_JWT_SECRET=change-this-admin-secret
```

## Local Setup

### Install dependencies

```bash
npm install
```

### Apply database migrations

This repository keeps Prisma config in `src/prisma.config.ts` and Prisma schema files under `src/prisma`.

For local development:

```bash
npx prisma migrate dev --config src/prisma.config.ts
```

To apply existing migrations only:

```bash
npx prisma migrate deploy --config src/prisma.config.ts
```

### Build the project

```bash
npm run build
```

### Start the backend

```bash
npm run dev
```

Important note:

- `npm run dev` starts the compiled output from `dist/server.js`
- This is not a watch-mode dev server
- Build the project before starting it

## Available Scripts

```bash
npm run build
npm run dev
npm test
```

## Database Overview

The main domain models are:

- `User`
- `Avatar`
- `Element`
- `Map`
- `Space`
- `mapElements`
- `spaceElements`

The schema models a world where users can own spaces, spaces can optionally be linked to maps, and both maps and spaces can contain elements.

## Realtime Layer

The project runs a separate WebSocket server on `WS_PORT`.

This layer is responsible for:

- Joining a user into a space room
- Tracking socket membership by room
- Broadcasting movement updates
- Removing users when they disconnect or leave

Default local assumption in this project is WebSocket port `8080`.

## Testing

Run the full test suite with:

```bash
npm test
```

The workspace state you provided shows the tests are currently passing.

## Docker Setup

This repository includes a Dockerfile with the following behavior:

- Base image: `node:24-alpine`
- Working directory: `/app`
- Installs dependencies with `npm i`
- Copies the full source tree into the container
- Builds the TypeScript project during image build
- Exposes ports `3000` and `8080`
- Starts the application with `npm run dev`

One important runtime detail:

- The application defaults to `PORT=3001`
- The Dockerfile exposes `3000`
- When running the container, set `PORT=3000` so container port mapping matches the app port

### Build the Docker image

```bash
docker build -t metaverse-backend .
```

### Run against PostgreSQL on your host machine

```bash
docker run --rm -p 3000:3000 -p 8080:8080 \
  --env PORT=3000 \
  --env WS_PORT=8080 \
  --env DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/metaverse \
  --env USER_JWT_SECRET=change-this-user-secret \
  --env ADMIN_JWT_SECRET=change-this-admin-secret \
  metaverse-backend
```

On Docker Desktop, `host.docker.internal` lets the container reach services running on your host machine.

### Run PostgreSQL in Docker too

Create a shared Docker network:

```bash
docker network create metaverse-net
```

Start PostgreSQL:

```bash
docker run -d --name metaverse-postgres \
  --network metaverse-net \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=metaverse \
  -p 5432:5432 \
  postgres:17-alpine
```

Apply migrations after the database is ready:

```bash
npx prisma migrate deploy --config src/prisma.config.ts
```

Then run the backend container:

```bash
docker run --rm --name metaverse-backend \
  --network metaverse-net \
  -p 3000:3000 \
  -p 8080:8080 \
  -e PORT=3000 \
  -e WS_PORT=8080 \
  -e DATABASE_URL=postgresql://postgres:postgres@metaverse-postgres:5432/metaverse \
  -e USER_JWT_SECRET=change-this-user-secret \
  -e ADMIN_JWT_SECRET=change-this-admin-secret \
  metaverse-backend
```

### Run with an env file

```bash
docker run --rm -p 3000:3000 -p 8080:8080 \
  --env-file .env \
  metaverse-backend
```

Recommended `.env` for Docker:

```env
PORT=3000
WS_PORT=8080
DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/metaverse
USER_JWT_SECRET=change-this-user-secret
ADMIN_JWT_SECRET=change-this-admin-secret
```

## Notes

- Prisma config is not at the repository root; it lives in `src/prisma.config.ts`
- Prisma schema and migration files are under `src/prisma`
- The generated Prisma client is committed under `src/generated/prisma`
- The project contains both HTTP and WebSocket runtime entrypoints
- Docker port exposure and application default port differ unless `PORT` is set explicitly

## Troubleshooting

### Database connection issues

Check that:

- PostgreSQL is running
- `DATABASE_URL` is correct
- The database is reachable from the host or container
- Prisma migrations were applied successfully

### Container starts but service is unreachable

Check that:

- You mapped the correct ports
- `PORT=3000` is set when exposing `3000:3000`
- `WS_PORT=8080` is set when exposing `8080:8080`

### App fails after container startup

Check that:

- Environment variables are present
- The database is available before the app starts
- The image was rebuilt after code changes

## License

ISC
