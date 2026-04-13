# YogaApp — Yoga H'om Studio Management

A full-stack MERN application built with TypeScript, Vite, and pnpm.

## Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Frontend    | React 18, Vite 5, TypeScript   |
| Backend     | Express 4, TypeScript, tsx     |
| Database    | MongoDB (Mongoose)             |
| API Docs    | Swagger UI (OpenAPI 3.0)       |
| Pkg Manager | pnpm                           |

## Project Structure

```
yogaApp/
├── client/                         # React + TypeScript + Vite
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── components/
│       │   ├── Class/              # ClassForm, ClassList
│       │   ├── Instructor/         # InstructorForm, InstructorList
│       │   └── Layout/             # Navbar
│       ├── pages/                  # DashboardPage, InstructorsPage, ClassesPage
│       ├── services/api.ts         # Fetch-based API layer
│       ├── styles/App.css
│       ├── types/index.ts
│       ├── App.tsx
│       └── main.tsx
├── server/                         # Express + TypeScript
│   ├── tsconfig.json
│   └── src/
│       ├── config/
│       │   ├── db.ts               # MongoDB connection
│       │   └── swagger.ts          # OpenAPI spec
│       ├── controllers/            # instructorController, classController
│       ├── models/                 # Instructor, Class
│       ├── routes/                 # instructorRoutes, classRoutes
│       ├── types/index.ts
│       └── server.ts
├── .env.example
├── .gitignore
├── .npmrc
├── .prettierrc
├── Procfile
├── pnpm-workspace.yaml
└── package.json
```

## Prerequisites

- Node.js >= 18
- pnpm (`npm install -g pnpm`)
- MongoDB (local install or MongoDB Atlas)

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/yogaApp.git
cd yogaApp
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/yogaApp?retryWrites=true&w=majority
PORT=3001
NODE_ENV=development
```

### 3. Install dependencies

```bash
pnpm install
cd server && pnpm install
cd ../client && pnpm install
cd ..
```

### 4. Run the app

Start the server and client in separate terminals:

**Terminal 1 — Server:**
```bash
cd server
pnpm run dev
```

**Terminal 2 — Client:**
```bash
cd client
pnpm run dev
```

The client runs at `http://localhost:3000` and proxies API requests to the server on port 3001.

### 5. API Docs

With the server running, visit:

```
http://localhost:3001/api/docs
```

## Implemented Use Cases

### UC1: Add an Instructor
- Duplicate name detection with confirmation prompt
- Required field validation
- Welcome confirmation message on creation
- Full CRUD (Create, Read, Update, Delete)

### UC2: Add a Class
- Schedule conflict detection with available time slot suggestions
- Instructor assignment via dropdown
- General / Special class type
- Publish / unpublish workflow
- Full CRUD

## Disclosures
- Claude Opus 4.6 was used the scaffolding, VS-Code Copilot was used in errors and the intellisense helped build out features.