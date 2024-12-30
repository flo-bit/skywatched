# skywatched

university project. social media for movies and tv shows using the at protocol.

[live demo](https://skywatched.app/)

backend/jetstream consumer can be found at [flo-bit/skywatched-backend](https://github.com/flo-bit/skywatched-backend)

## development

1. copy the .env.example file to .env and set the variables:

```bash
cp .env.example .env
```

required:

- `TMDB_API_KEY` (get one [here](https://www.themoviedb.org/settings/api))
- `NYX_PASSWORD` (can be generated on unix systems with `openssl rand -base64 32`)
- `BACKEND_URL` (the url of the backend server)

2. install the dependencies:

```bash
npm install
```

3. run the development server:

```bash
npm run dev
```

5. open the browser and go to [localhost:5173](http://localhost:5173)

## tech stack

- svelte(kit)
- tailwind
- turso (libSQL) w/ drizzle
- lucia for auth
