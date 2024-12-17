# skywatched

university project. social media for movies and tv shows using the at protocol.

[live demo](https://skywatched.app/)

## development

1. copy the .env.example file to .env and set the variables:

```bash
cp .env.example .env
```

required:

- `TMDB_API_KEY` (get one [here](https://www.themoviedb.org/settings/api))
- `NYX_PASSWORD` (can be generated on unix systems with `openssl rand -base64 32`)

2. install the dependencies:

```bash
npm install
```

3. run the database migrations:

```bash
npm run db:migrate
```

4. run the development server:

```bash
npm run dev
```

5. open the browser and go to [localhost:5173](http://localhost:5173)

## tech stack

- svelte(kit)
- tailwind
- turso (libSQL) w/ drizzle
- lucia for auth
