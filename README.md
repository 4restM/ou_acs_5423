# YogaApp — Yoga H'om Studio Management

A full-stack MERN application built with TypeScript, Vite, and pnpm.

## Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Frontend    | React 19, Vite 8, TypeScript   |
| Backend     | Express 5, TypeScript, tsx     |
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
│       │   ├── Customer/           # CustomerForm, CustomerList
│       │   ├── Instructor/         # InstructorForm, InstructorList
│       │   ├── Layout/             # Navbar
│       │   ├── Package/            # PackageForm, PackageList
│       │   └── Sale/               # SaleForm, SaleList
│       ├── pages/                  # DashboardPage, InstructorsPage, ClassesPage,
│       │                           # PackagesPage, CustomersPage, SalesPage
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
│       ├── controllers/            # instructorController, classController,
│       │                           # packageController, customerController, saleController
│       ├── models/                 # Instructor, Class, Package, Customer, Sale
│       ├── routes/                 # instructorRoutes, classRoutes, packageRoutes,
│       │                           # customerRoutes, saleRoutes
│       ├── types/index.ts
│       ├── utils/validation.ts
│       └── server.ts
├── docs/                           # Mermaid ER and use-case sequence diagrams
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
- Required field validation (email format, phone format)
- Welcome confirmation message on creation
- Full CRUD (Create, Read, Update, Delete)

### UC2: Add a Class
- Schedule conflict detection with available time slot suggestions
- Instructor assignment via dropdown
- General / Special class type
- Publish / unpublish workflow
- Full CRUD

### UC3: Add a Package
- Package categories: General and Senior
- Class counts: 1, 4, 10, or Unlimited
- Date range and price configuration
- Full CRUD

### UC4: Add a Customer
- Duplicate name detection with confirmation prompt
- Required field validation
- Class balance initialised to 0 on creation
- Full CRUD

### UC5: Record a Sale
- Select customer and package from existing records
- Package type and rate auto-populated on package selection
- Validates that amount paid matches the package rate
- Validates validity dates fall within the package's availability window
- Updates the customer's class balance on sale creation; reverts on deletion

## Disclosures
- Claude Opus 4.6 was used with the scaffolding, VS-Code Copilot was used in errors and the intellisense helped build out features.

- For Phase 2, I made more liberal usage of claude sonnet 4.6, especially for test and documentation, but I also used it more in the implementation of features. This is driven by a need by my employer to have more experience and double dipping. Per instructions about AI use, I'm ensuring that I am compliant by commenting any confusing areas of code that were written by claude.
