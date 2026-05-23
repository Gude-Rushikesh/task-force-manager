# TaskForce Pro

A production-style MERN workforce task management platform for assigning, tracking, and analyzing operational work across employees and departments.

## Highlights

- JWT-style authentication with signed HMAC tokens and PBKDF2 password hashing.
- Role-based access control for Admin, Manager, and Employee workflows.
- MongoDB data models for users, employees, departments, tasks, comments, status history, and activity logs.
- Protected REST API with centralized error handling and production-minded HTTP headers.
- Operations dashboard with task KPIs, workload analytics, charts, filters, employee directory, and activity feed.
- Professional React/Vite frontend with route protection, session persistence, API interceptors, and responsive layouts.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Recharts, Lucide React, Axios, React Router.
- Backend: Node.js, Express, MongoDB, Mongoose.
- Architecture: REST APIs, RBAC middleware, controller/service-style organization, seeded demo data.

## Demo Accounts

Run the seed script, then sign in with:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@taskforce.dev` | `Admin@12345` |
| Manager | `manager@taskforce.dev` | `Manager@12345` |
| Employee | `employee@taskforce.dev` | `Employee@12345` |

## Local Setup

1. Copy environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Update `backend/.env` with your MongoDB URI and JWT secret.

3. Seed the database:

```bash
npm run seed
```

4. Start backend and frontend in separate terminals:

```bash
npm run backend
npm run frontend
```

The API runs on `http://localhost:5000` and the frontend runs on `http://localhost:5173`.

## API Overview

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/analytics/overview`
- `GET/POST /api/tasks`
- `GET/PUT/DELETE /api/tasks/:id`
- `POST /api/tasks/:id/comments`
- `GET/POST /api/employees`
- `GET/PUT/DELETE /api/employees/:id`
- `GET/POST /api/departments`
- `GET /api/activity`

## Resume Bullet

Architected and developed TaskForce Pro, a production-style MERN workforce management platform with role-based authentication, MongoDB-backed task and employee workflows, operational analytics dashboards, activity tracking, and protected REST APIs for enterprise task execution.
