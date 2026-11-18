# Phase 4 Task Board

**Deadline: Monday, Nov 23, 2026, 1:00 PM** (submit by 11:00 AM for a 2-hour buffer).

Status key: [ ] not started, [~] in progress, [x] done.
Copy each task into GitHub Issues / Projects with the same ID, owner, and label.

## Labels (use these in GitHub Issues)
`pm`, `dev-foundation`, `dev-sales`, `dev-dispatch`, `product-owner`, `scrum`, `qa`, `docs`, `blocked`

## Project Manager (Jm)
| # | Task | Owner | Status | Target |
| --- | --- | --- | --- | --- |
| PM-1 | Add `.gitignore`, root README, remove `.history/` | Jm | [x] | Nov 18 |
| PM-2 | Create the GitHub Project board and issues from this file | Jm | [ ] | Nov 18 |
| PM-3 | Add all members as collaborators, set `main` branch protection | Jm | [ ] | Nov 18 |
| PM-4 | Confirm Phase 4 requirements with the professor | Jm | [ ] | Nov 18 |
| PM-5 | Post progress report (`management/PROGRESS_REPORT.md`) | Jm | [ ] | Nov 20, Nov 22 |
| PM-6 | Run the final submission checklist | Jm | [ ] | Nov 23, 11 AM |

## Developers (label by module)

### Jm: Foundation, Accounts, Reports, Deployment (`dev-foundation`)
| # | Task | Owner | Status | Target |
| --- | --- | --- | --- | --- |
| DEV-1 | Choose and document the backend stack (Node/Express + MySQL) | Jm | [ ] | Nov 18 |
| DEV-2 | Base database schema from the ERD and `Frontend/dist/data.js` seed data | Jm | [ ] | Nov 19 |
| DEV-3 | Authentication and role-based permissions (Business Owner, Sales Staff, Production Head, Production Staff) | Jm | [ ] | Nov 19 |
| DEV-9 | API: staff accounts and permissions | Jm | [ ] | Nov 21 |
| DEV-10 | API: reports and CSV export | Jm | [ ] | Nov 21 |
| DEV-11 | Create `Frontend/dist/api.js` and connect the frontend (integration) | Jm | [ ] | Nov 21 |
| DEV-12 | Deploy backend and database, update the live site | Jm | [ ] | Nov 22 |

### Princess: Products, Sales, Closing (`dev-sales`)
| # | Task | Owner | Status | Target |
| --- | --- | --- | --- | --- |
| DEV-4 | API: products, batches, production output, stock baseline | Princess | [ ] | Nov 20 |
| DEV-5 | API: sales and daily closing (stock validation, offline sync, duplicate reference check) | Princess | [ ] | Nov 20 |
| DEV-4b | Connect product and sales screens to the API in `app.js` | Princess | [ ] | Nov 21 |

### Jiano: Dispatch, Materials, Discrepancies (`dev-dispatch`)
| # | Task | Owner | Status | Target |
| --- | --- | --- | --- | --- |
| DEV-6 | API: dispatches and branch receipts (no double stock credit) | Jiano | [ ] | Nov 20 |
| DEV-7 | API: materials, shift opening/closing, daily usage | Jiano | [ ] | Nov 21 |
| DEV-8 | API: discrepancies, owner adjustments, weekly audits and sign-off (build last, depends on sales and dispatch) | Jiano | [ ] | Nov 21 |
| DEV-8b | Connect dispatch, materials, and discrepancy screens to the API in `app.js` | Jiano | [ ] | Nov 21 |

## Product Owner (Princess, Clark) (`product-owner`)
| # | Task | Owner | Status | Target |
| --- | --- | --- | --- | --- |
| PO-1 | Finalize product backlog and user stories mapped to the 53 screens | Princess, Clark | [ ] | Nov 18 |
| PO-2 | Write acceptance criteria per module | Princess, Clark | [ ] | Nov 19 |
| PO-3 | Review completed features and give sign-off | Princess, Clark | [ ] | Nov 22 |

## Scrum Master (Hazel, Clark) (`scrum`)
| # | Task | Owner | Status | Target |
| --- | --- | --- | --- | --- |
| SM-1 | Plan Phase 4 sprints and record sprint goals | Hazel, Clark | [ ] | Nov 18 |
| SM-2 | Keep daily scrum notes and a blockers log | Hazel, Clark | [ ] | Daily |
| SM-3 | Hold sprint review and retrospective, record notes | Hazel, Clark | [ ] | Nov 22 |

## Tester / QA (Ericka, Hazel, Jiano) (`qa`)
| # | Task | Owner | Status | Target |
| --- | --- | --- | --- | --- |
| QA-1 | Write the test plan | Ericka, Hazel | [ ] | Nov 18 |
| QA-2 | Write test cases per module | Ericka, Hazel | [ ] | Nov 19 |
| QA-3 | Execute tests and record pass/fail results | Ericka, Hazel | [ ] | Nov 21 to 22 |
| QA-4 | Maintain the bug log and retest fixes | Ericka, Hazel | [ ] | Nov 22 |
| QA-5 | Cross-browser and mobile checks | Ericka, Hazel | [ ] | Nov 22 |

Note: Jiano is a developer on the heaviest module set, so Ericka and Hazel carry most QA work. Jiano only retests fixes for his own modules.

## Documentation Specialist (Ericka) (`docs`)
| # | Task | Owner | Status | Target |
| --- | --- | --- | --- | --- |
| DOC-1 | Update DFD, ERD, use case diagram, and flowcharts to match the final system | Ericka | [ ] | Nov 20 |
| DOC-2 | Write the user manual | Ericka | [ ] | Nov 21 |
| DOC-3 | Write the technical documentation | Ericka | [ ] | Nov 22 |
| DOC-4 | Compile the final document for submission | Ericka | [ ] | Nov 22 |

## Cut order if time runs out
Build in this order and cut from the bottom: (1) login and roles, (2) products, sales, closing, (3) dispatch and receipts, (4) materials, (5) discrepancies and audits, (6) accounts, then reports. Document in the final paper which modules are complete.