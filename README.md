## Productivon's backend

Run the Node.js backend locally with `pnpm start`. Docker Compose manages only
PostgreSQL, so starting or stopping Compose does not start or stop the Node.js
process. The backend still needs PostgreSQL available to start and serve database
requests.

### Setup and startup

From this repository's directory:

1. Install dependencies: `pnpm install --frozen-lockfile`.
2. If `.env` does not exist, copy `.env.example` to `.env`. Keep existing database
   credentials if you already have a database volume.
3. Set `DB_HOST=localhost` in `.env`. `DB_PORT` is the port published on your
   computer; the existing local setup uses `5431`. PostgreSQL inside the container
   listens on `5432`. Set `PORT=4000` for the backend.
4. Start the database and wait for it to become healthy:

   ```bash
   docker compose up -d --wait postgres
   ```

5. Start the backend in your terminal:

   ```bash
   pnpm start
   ```

   Expect `Postgresql connected via Sequelize` followed by
   `Server running on port 4000`. The GraphQL endpoint is
   <http://localhost:4000/graphql>.

6. Verify the endpoint from another terminal:

   ```bash
   curl --fail-with-body http://localhost:4000/graphql \
     -H 'Content-Type: application/json' \
     --data '{"query":"{ __typename }"}'
   ```

   Expected response: `{"data":{"__typename":"Query"}}`.

Press `Ctrl+C` in the backend terminal to stop Node.js. Use
`docker compose stop postgres` to stop the database separately. Stopping the
database leaves the Node.js process running, but database requests will fail
until PostgreSQL is available again.

### Switching from the old Docker backend

The previous Compose file also started a backend container named
`productivon_app`. Editing the Compose file does not stop an existing container.
If it is still running, stop it once before running `pnpm start`:

```bash
docker stop productivon_app
```

If Docker reports that this container does not exist, there is nothing to stop.
The new Compose file will not start it again.

### Understanding startup failures

`pnpm start` runs the `start` script in `package.json`:
`nodemon --exec tsx src/index.ts`. Nodemon watches for edits; tsx executes
TypeScript. The application loads `.env`, connects to PostgreSQL, synchronizes
its models, starts Apollo, then listens on `PORT`.

- `pnpn: command not found`: the command is **pnpm**, not `pnpn`.
- `EADDRINUSE ... :4000`: another process already occupies port 4000. In the
  original setup, this was `productivon_app`. Check `docker ps` and
  `ss -ltnp 'sport = :4000'` before starting another backend.
- `Unable to connect to Database`: check `docker compose ps`,
  `docker compose logs postgres`, and the `DB_*` values in `.env`. A local
  backend uses `localhost` and the published port, not the Docker hostname
  `postgres`.
- `[nodemon] app crashed - waiting for file changes`: the server has stopped;
  only the watcher remains. Read the error above this message to find the cause.

The successful database message followed by `EADDRINUSE` means the database
connection worked and the failure occurred later, when opening the HTTP port.
