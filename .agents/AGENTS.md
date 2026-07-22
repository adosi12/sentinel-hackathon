# Sentinel AI Hackathon Project Guidelines

## Docker Workflow
- **Frontend Changes**: The Next.js frontend runs in a Docker container that does not use hot-reloading volume mounts. Any changes to React components require a manual rebuild: `docker compose build frontend; docker compose up -d frontend`.
- **Backend Changes**: The FastAPI backend requires `docker compose restart backend` after modifying Python files.
- **Database Access**: You can interact directly with the PostgreSQL database using: `docker exec sentinel-db psql -U sentinel -d sentinel_db -c "..."`

## Database & API Constraints
- The Pydantic schema for `IncidentResponse` strictly expects `est_customers_impacted` (int), `est_financial_exposure` (float), and `mttr_saved` (float) to be numbers.
- **CRITICAL**: If you ever inject raw mock data into the `incidents` table using SQL, you MUST provide `0` or `0.0` for these metric fields. Leaving them as `NULL` will cause the backend API serialization to crash with a `ResponseValidationError`.
- When writing raw SQL strings in PowerShell commands, be careful with newlines. Do not use literal HTML entities (`&#10;`). Use Postgres' native newline string syntax (`E'\n'`) or backslash escaping.

## UI Design System & Aesthetics
- **Theme**: Strictly dark mode.
- **Backgrounds**: Use extremely dark custom hex codes: `bg-[#050505]` for innermost elements, `bg-[#0A0A0A]` for cards, `bg-[#0f1115]` or `bg-[#161920]` for elevated popups.
- **Borders**: Avoid harsh borders. Use `border-white/5` or `border-white/10`.
- **Layouts**: Avoid "boxy" designs or double-borders (e.g. putting a bordered component inside a bordered container). Favor clean, open grids with subtle dividers.
- **Typography**: Use standard sans fonts for text, but ALWAYS use `font-mono` for technical data, routing emails, incident IDs, and code blocks.
- **Icons**: Use `lucide-react` for all iconography.
