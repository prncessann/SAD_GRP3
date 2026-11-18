# SAD Group 3 - Eli's Yummy Kitchen Inventory & Sales System

Systems Analysis and Design (SAD) group project, BS Information Systems, TUP Manila.

Live frontend demo: https://tupcossad.netlify.app

**Phase 4 deadline: Monday, November 23, 2026, 1:00 PM** (target: submit by 11:00 AM).

## Overview
A web-based system that tracks sales, product stock, dispatches to branches, raw materials, discrepancies, weekly audits, staff accounts, and reports for Eli's Yummy Kitchen.

## Repository structure
| Folder | Contents | Owner |
| --- | --- | --- |
| `Frontend/` | 53-screen HTML/CSS/JS frontend (demo data in `localStorage`) | Developers |
| `Backend/` | API server and database (in progress) | Developers |
| `docs/` | Diagrams, user manual, technical docs, final document | Documentation Specialist |
| `tests/` | Test plan, test cases, test results, bug log | Tester / QA |
| `management/` | Task board, sprint notes, progress reports, checklists | Project Manager, Scrum Master |

## Team and roles
| Role | Members |
| --- | --- |
| Project Manager | John Michael Litana |
| Product Owner | Princess Ann Delos Reyes, Clark Jerzon Herrera |
| Scrum Master | Hazel Baniqued, Clark Jerzon Herrera |
| Developer | Jiano Magtangob, John Michael Litana, Princess Ann Delos Reyes |
| Tester / QA | Ericka Nucos, Hazel Baniqued, Jiano Magtangob |
| Documentation Specialist | Ericka Nucos |

## Development split (3 developers)
Each developer owns their modules and files so we avoid merge conflicts.

| Developer | Owns | Backend files | Frontend screens | Branches |
| --- | --- | --- | --- | --- |
| **Jm (John Michael Litana)** | Foundation (setup, schema, login and roles), Accounts and permissions, Reports and CSV, Deployment and final integration | `Backend/src/server.js`, `Backend/src/routes/auth.js`, `accounts.js`, `reports.js`, `Backend/db/schema.sql` | login, shift, accounts, permissions, reports | `feature/auth`, `feature/accounts`, `feature/reports` |
| **Princess Ann Delos Reyes** | Products, production, stock baseline, Sales and daily closing (with offline sync) | `Backend/src/routes/products.js`, `sales.js`, `Backend/db/sales.sql` | overview, sales, record-sale, offline, count, closing, inventory, product, production, stock-in, next-opening | `feature/products`, `feature/sales` |
| **Jiano Magtangob** | Dispatch and receipts, Materials and usage, Discrepancies and weekly audits | `Backend/src/routes/dispatch.js`, `materials.js`, `discrepancies.js`, `Backend/db/dispatch.sql` | dispatches, receive, supplies, usage, discrepancies, review, adjust, audits | `feature/dispatch`, `feature/materials`, `feature/discrepancies` |

### Rules to avoid conflicts
1. Jm pushes the backend skeleton, base schema, and login first (target: Thursday, Nov 19, noon). Others build on top of it.
2. One route file per module. Only edit your own files.
3. Add your own tables in your own SQL file. Do not edit another person's SQL file.
4. Put API calls in the shared `Frontend/dist/api.js`. In `Frontend/dist/app.js`, only replace the `handlers` for your own screens.
5. Pull the latest `main` before starting work, commit small and often, and merge through pull requests.
6. Discrepancies and audits depend on sales closing and dispatch receipts, so Jiano builds that part last.

## Running the frontend
1. Open `Frontend/dist/index.html` in Chrome or Edge, or run `python Frontend/run.py` and open http://127.0.0.1:5500.
2. Demo login: username `juan.delacruz`, password `demo123` (demo only, not real authentication).

See `Frontend/README.md` for details.

## Git workflow (all members)
1. Never commit directly to `main`.
2. Create a branch per task: `feature/<short-name>`, `docs/<short-name>`, `test/<short-name>`.
3. Commit small and often with clear messages, for example `Add sales API endpoint`.
4. Open a pull request, link the related issue, and get one teammate's review before merging.
5. Pull the latest `main` before starting new work.

## Commit message format
`<type>: <what changed>` where type is one of `feat`, `fix`, `docs`, `test`, `chore`.