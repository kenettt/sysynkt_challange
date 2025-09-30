# Family Planner

A small monorepo project (**Laravel backend** + **Vite/React frontend**) with Docker Compose.

## 🚀 Getting Started

**Requirements**

- Node.js + PNPM
- PHP + Composer
- Docker & Docker Compose

```bash
# 1. Install dependencies
cd backend && composer install && cd ..
cd frontend && pnpm install && cd ..
pnpm install   # in the root

# 2. Copy .env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Start development environment
pnpm dev


The backend runs on http://localhost:8000

The frontend runs on http://localhost:5173
```
