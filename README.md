# nyx

university project. linktree but for movies. eventually with social media features using the at protocol.

[live demo](https://nyx-kappa.vercel.app/)

## setup

1. copy the .env.example file to .env and set the variables:

```
cp .env.example .env
```

required only `TMDB_API_KEY` for now. get one [here](https://www.themoviedb.org/settings/api).

2. install the dependencies:

```
npm install
```

3. run the development server:

```
npm run dev
```

4. open the browser and go to [localhost:5173](http://localhost:5173)

## tech stack

- svelte(kit)
- tailwind
- turso (libSQL) w/ drizzle
- lucia for auth

## planning

### MVP

- login with username and password
- search for movies (using the moviedb api)
- mark movies as watched
- user page with watched movies
- dark mode

### extra feature ideas

- social media (feed, follow functionality) (using AT Protocol)
- add tv shows, books, music, links
- delete watched items
- select favorite movie
- mark movies as "want to watch"
- rate and review movies
- better UI showing for each movie:
  - rotten tomatoes, etc. ratings
  - trailer
  - cast
  - movie description
- a "wikipedia game but for actors+movies" feature (get from movie to movie by just clicking on actors and movies)
- netflix integration (sync watched movies)
- show reviews of users on movie page
- enhance reviews with AI
- recommendations with AI
- recommendations (based on watched movies, based on friends)
- light mode

### roadmap

- [ ] setup project
- [ ] build mvp
