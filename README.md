# Family Planner

A small monorepo project (**Laravel backend** + **Vite/React frontend**) with Docker Compose.

## 🚀 Getting Started

**Requirements**

- Node.js + PNPM
- PHP + Composer
- Docker & Docker Compose

# If you don't have pnpm:

corepack enable
corepack prepare pnpm@latest --activate

# (alternative) npm i -g pnpm

```bash
# 1. Install dependencies
cd backend && composer install && cd ..
cd frontend && pnpm install && cd ..
pnpm install   # in the root

# 2. Copy .env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Setup database
pnpm db:up

cd backend
php artisan migrate --seed
cd ..

# 4. Start development environment
pnpm dev


The backend runs on http://localhost:8000

The frontend runs on http://localhost:5173

## ✅ Implemented features
- Weekly family task board (filter by: all / mine / open).
- Create, update (partial **PATCH**), delete tasks.
- Change task status (`todo` → `doing` → `done`) and **claim/unassign** tasks.
- Accessible dialogs (labels, descriptions).
- Clear toasts for success/error; guarded HTTP helper (JSON/content-type checks).
- CORS configured for local FE↔BE development.

## 🔧 Key choices & assumptions
- **CamelCase API:** Backend Resources return camelCase; Requests accept camelCase and map to DB snake_case → keeps frontend simple (no client-side mapping).
- **PATCH over PUT:** Partial updates reduce payload and make UI edits cheaper (e.g., updating just `status` or `assignedToUserId`).
- **“Fake auth”:** No real login; “Mine” filter is driven by the selected/current UI user.
- **Nullable assignee:** `assignedToUserId: null` means “open task”.
- **Defaults in DB:** `status` defaults to `todo` via migration (or set server-side if not using default).
- **Error handling:** HTTP helper throws human-readable errors; UI surfaces toasts.

## 🚀 Future improvements (if given more time)
- Real authentication (Laravel Sanctum/JWT) + role-based permissions.
- Realtime updates (Laravel WebSockets / Pusher) for multi-user sync.
- Pagination & filtering on the API; indexes on `assigned_to_user_id`, `status`, `due_day`.
- Soft deletes & audit trail (who changed what, when).
- E2E tests + API tests.
- i18n, dark mode, and richer accessibility.

```
