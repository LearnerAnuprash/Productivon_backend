## Productivon's backend

##### Commands I used in serial order to initialize Productivon's backend:

- `pnpm init -y`
- `pnpm i express sequelize pg pg-hstore @apollo/server`

**Create folders:**

- In root folder:

  `/resolvers`
  `/models`
  `/schemas`

- Create `index.ts` and `app.ts`
- Command to initialize typescript:
  `npm install -D typescript tsx @types/node`
- Create `tsconfig.json` file with `"module": "NodeNext"`

**Docker Basic Commands**

- `docker run --name productivon_db -e POSTGRES_PASSWORD=secretpassword -p 5431:5432 -d postgres`

- Then create new connection in DBeaver

- `docker exec -it productivon_db psql -U postgres`
