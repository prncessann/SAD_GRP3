# Backend (Node/Express + MySQL)

## Setup
1. `cd Backend` then `npm install`
2. Copy `.env.example` to `.env` and fill in your MySQL details.
3. Create the database once: `CREATE DATABASE eyk_inventory;`
4. `npm run db:migrate` then `npm run db:seed`
5. `npm run dev` and open http://localhost:3000/api/health

## Try the login
```
POST /api/auth/login   {"username":"juan.delacruz","password":"demo123"}
GET  /api/auth/me      Authorization: Bearer <token>
```
Demo users (from the frontend seed data), all with password demo123:
juan.delacruz (Business Owner), ana.reyes (Sales Staff), marvin.santos (Production Head), mia.choi (Production Staff).
The token also carries `branch` / `branchId`, so Sales Staff routes can limit data to their branch.

## Adding a module (no one edits server.js)
- Create `src/routes/<module>.js` exporting an Express router. It is auto-mounted at `/api/<module>`.
- Protect routes: `router.post('/', requireAuth, requireRole(ROLES.OWNER, ROLES.SALES), handler)`
  (import from `../middleware/auth`).
- Put your tables in your own SQL file, e.g. `db/sales.sql` (Princess), `db/dispatch.sql` (Jiano).
  Use `CREATE TABLE IF NOT EXISTS`. They run after `schema.sql`, so you can reference `users(id)`.
