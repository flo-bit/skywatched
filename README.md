# skywatched

university project. social media for movies and tv shows using the at protocol.

[live demo](https://skywatched.app/)

backend/jetstream consumer can be found at [flo-bit/skywatched-backend](https://github.com/flo-bit/skywatched-backend)

## development

this repository is a monorepo managed with [turbo](https://turbo.build/) and has the following parts:

- `apps/web` - the frontend of the app
- `apps/backend` - the backend/jetstream consumer of the app
- `packages/shared` - shared types and utils

1. install the dependencies (in the root directory):

```bash
npm install
```

to run the app, you need to set up a `.env` file in both `apps/web` and `apps/backend`.

2. copy the .env.example file to .env and set the variables:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/backend/.env.example apps/backend/.env
```

required (for frontend):

- `TMDB_API_KEY` (get one [here](https://www.themoviedb.org/settings/api))
- `NYX_PASSWORD` (can be generated on unix systems with `openssl rand -base64 32`)
- `BACKEND_URL` (the url of the backend server, or `http://localhost:3001` for local development)

required (for backend):

- `TMDB_API_KEY` (get one [here](https://www.themoviedb.org/settings/api))

4. run the development server:

```bash
npm run dev
```

5. open the browser and go to [localhost:5173](http://localhost:5173)

## used tech

- svelte(kit)
- tailwind for styling
- litefs (libSQL) w/ drizzle
- bun for backend
- fly.io for deployment
- turbo for monorepo management
- prettier for code formatting
