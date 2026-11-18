# SAD Group 3 – Eli's Yummy Kitchen Inventory & Sales System

Systems Analysis and Design (SAD) group project, BS Information Systems, TUP Manila.

Live frontend demo: https://tupcossad.netlify.app

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