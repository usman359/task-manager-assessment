# Task Manager

Full-stack task manager built for a coding assessment.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Mongoose · MongoDB Atlas

## Features

- Responsive task list UI (add, edit, delete, mark complete)
- REST APIs backed by MongoDB Atlas
- Public API integration: GitHub REST API (recent Vercel repos)

## REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `GET` | `/api/github/repos` | Proxy to GitHub public API |

### Create body

```json
{
  "title": "Ship assessment",
  "description": "Optional notes",
  "completed": false
}
```

### Update body

Any subset of `title`, `description`, `completed`.

## Database Schema

MongoDB database: `taskmanager`  
Collection: `tasks` (Mongoose model `Task`)

| Field | Type | Notes |
|-------|------|--------|
| `_id` | `ObjectId` | Exposed as `id` in the API |
| `title` | `String` | Required |
| `description` | `String` | Default `""` |
| `completed` | `Boolean` | Default `false` |
| `createdAt` | `Date` | Set by Mongoose timestamps |
| `updatedAt` | `Date` | Set by Mongoose timestamps |

Schema: [`src/models/Task.ts`](src/models/Task.ts)

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm
- A MongoDB Atlas cluster

### Install

```bash
git clone <your-repo-url>
cd task-manager
cp .env.example .env
# Set MONGODB_URI to your Atlas URI (include a database name):
# mongodb+srv://USER:PASSWORD@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Do **not** commit `.env` or `atlas-credentials.env`.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production server |

## Step 3: API Integration

| Item | Detail |
|------|--------|
| **API used** | [GitHub REST API](https://docs.github.com/en/rest) — `GET /users/vercel/repos` |
| **Implementation** | Server route [`src/app/api/github/repos/route.ts`](src/app/api/github/repos/route.ts) fetches five recently updated public repos. [`src/components/GitHubRepos.tsx`](src/components/GitHubRepos.tsx) renders them on the home page. |
| **Screenshot** | Capture the “Public API: GitHub” section in the browser for your application. |
| **Commit** | Commit the GitHub route + UI files after pushing to your GitHub repository. |

## Step 4: Architecture answers

See [`ARCHITECTURE.md`](ARCHITECTURE.md).

## Live Demo

_Add your deployed URL here after hosting (e.g. Vercel). Set `MONGODB_URI` in the host’s environment variables._

## GitHub Repository

_Add your repository URL here after pushing._
