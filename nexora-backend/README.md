# Nexora Backend

A RESTful API backend for the Nexora CRM platform, built with **Node.js**, **Express**, and **MongoDB**.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Authentication](#authentication)
- [Running Tests](#running-tests)
- [Scripts](#scripts)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express v5 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Validation | Zod |
| Logging | Winston |
| Testing | Jest + Supertest |

---

## Project Structure

```
nexora-backend/
├── server.js                        # Entry point
├── src/
│   ├── app.js                       # Express app setup, middleware, routes
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── middlewares/
│   │   ├── auth.middleware.js       # JWT protect middleware
│   │   ├── error.middleware.js      # Global error handler
│   │   ├── role.middleware.js       # Role-based access control
│   │   └── validate.middleware.js   # Zod schema validation
│   ├── modules/
│   │   ├── auth/                    # Register, Login, Logout, Profile
│   │   ├── call/                    # Call logs per lead
│   │   ├── dashboard/               # Dashboard stats
│   │   ├── deal/                    # Deal pipeline management
│   │   ├── generalSettings/         # Lead status, industry type, type of buyer
│   │   ├── lead/                    # Lead CRUD
│   │   ├── meetings/                # Meeting scheduling
│   │   ├── product/                 # Product catalog
│   │   ├── task/                    # Task management with subtasks
│   │   ├── tickets/                 # Support tickets
│   │   └── user/                    # User management
│   ├── utils/
│   │   ├── ApiError.js              # Custom error class
│   │   ├── ApiResponse.js           # Standardised response wrapper
│   │   ├── generateToken.js         # JWT token generator
│   │   └── logger.js                # Winston request logger
│   └── __tests__/                   # Unit test suites (one per module)
│       ├── auth.test.js
│       ├── call.test.js
│       ├── deal.test.js
│       ├── lead.test.js
│       ├── meeting.test.js
│       ├── product.test.js
│       ├── task.test.js
│       ├── ticket.test.js
│       └── user.test.js
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# Clone the repository
git clone https://github.com/diksharajpurohit-p99/Nexora-Backend1.git
cd Nexora-Backend1

# Install dependencies
npm install
```

### Create `.env` file

```bash
cp .env.example .env
# Fill in your values (see Environment Variables section)
```

### Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server runs on `http://localhost:8000` by default.

---

## Environment Variables

Create a `.env` file in the root of `nexora-backend/`:

```env
MONGO_DB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=Nexora-backend
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

| Variable | Required | Description |
|---|---|---|
| `MONGO_DB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for signing JWT tokens |
| `JWT_EXPIRE` | ❌ | Token expiry duration (default: `7d`) |
| `PORT` | ❌ | Server port (default: `8000`) |
| `NODE_ENV` | ❌ | `development` or `production` |
| `CORS_ORIGIN` | ❌ | Allowed frontend origin (default: `http://localhost:5173`) |

---

## API Routes

All routes are available under two prefixes for compatibility:
- `/api/v1/<resource>`
- `/api/<resource>`

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Register a new user |
| POST | `/auth/login` | ❌ | Login and receive JWT token |
| POST | `/auth/logout` | ✅ | Logout |
| GET | `/auth/profile` | ✅ | Get current user profile |
| GET | `/auth/admin-only` | ✅ Admin | Admin-only route |

### Leads — `/api/leads`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/leads/` | ✅ | List all leads (with filters & pagination) |
| POST | `/leads/` | ✅ | Create a new lead |
| GET | `/leads/:id` | ✅ | Get lead by ID |
| PUT | `/leads/:id` | ✅ | Update lead |
| DELETE | `/leads/:id` | ✅ | Delete lead |

### Meetings — `/api/meetings`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/meetings/` | ✅ | List meetings (filter by lead, status, date range, search) |
| POST | `/meetings/` | ✅ | Create meeting |
| GET | `/meetings/options` | ✅ | Get meeting type/platform options |
| GET | `/meetings/:id` | ✅ | Get meeting by ID |
| PUT | `/meetings/:id` | ✅ Creator/Assigned/Admin | Update meeting |
| DELETE | `/meetings/:id` | ✅ Admin | Delete meeting |

### Tasks — `/api/tasks`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/tasks/` | ✅ | List all tasks |
| POST | `/tasks/` | ✅ | Create task |
| GET | `/tasks/:id` | ✅ | Get task by ID |
| PUT | `/tasks/:id` | ✅ | Update task |
| DELETE | `/tasks/:id` | ✅ | Delete task |
| PATCH | `/tasks/:id/stage` | ✅ | Update task stage |
| PATCH | `/tasks/:taskId/subtasks/:subtaskId` | ✅ | Toggle subtask completion |

### Deals — `/api/deals`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/deals/` | ✅ | List all deals |
| POST | `/deals/` | ✅ | Create deal |
| GET | `/deals/:id` | ✅ | Get deal by ID |
| PUT | `/deals/:id` | ✅ | Update deal |
| DELETE | `/deals/:id` | ✅ | Delete deal |
| PATCH | `/deals/:id/stage` | ✅ | Update deal stage |

### Products — `/api/products`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/products/` | ✅ | List all products |
| POST | `/products/` | ✅ | Create product |
| GET | `/products/:id` | ✅ | Get product by ID |
| PUT | `/products/:id` | ✅ | Update product |
| DELETE | `/products/:id` | ✅ | Delete product |

### Tickets — `/api/tickets`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/tickets/` | ✅ | List tickets (filter by status, priority, category) |
| POST | `/tickets/` | ✅ | Create ticket |
| GET | `/tickets/options` | ✅ | Get ticket status/priority options |
| GET | `/tickets/:id` | ✅ | Get ticket by ID |
| PUT | `/tickets/:id` | ✅ Creator/Assigned/Admin | Update ticket |
| DELETE | `/tickets/:id` | ✅ Admin | Delete ticket |

### Calls — `/api/calls`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/calls/` | ✅ | List all calls (with pagination & search) |
| POST | `/calls/` | ✅ | Create call log |
| GET | `/calls/:id` | ✅ | Get call by ID |
| PUT | `/calls/:id` | ✅ | Update call |
| DELETE | `/calls/:id` | ✅ | Delete call |

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/users/` | ✅ | List all users |
| GET | `/users/:id` | ✅ | Get user by ID |

### General Settings — `/api/general-settings`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/general-settings/lead-status` | ✅ | List lead statuses |
| POST | `/general-settings/lead-status` | ✅ | Create lead status |
| PUT | `/general-settings/lead-status/:id` | ✅ | Update lead status |
| DELETE | `/general-settings/lead-status/:id` | ✅ | Delete lead status |
| GET | `/general-settings/industry-type` | ✅ | List industry types |
| GET | `/general-settings/type-of-buyer` | ✅ | List buyer types |

### Dashboard — `/api/dashboard`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/dashboard/` | ✅ | Get dashboard statistics |

---

## Authentication

All protected routes require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are issued on login and expire after `7d` by default.

**Role-based access:**
- `super_admin` — full access to all operations
- `admin` — can delete meetings, tickets; manage users
- `employee` — standard CRUD on assigned resources

---

## API Response Format

All responses follow a consistent structure:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

Error responses:

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Descriptive error message",
  "data": null
}
```

---

## Running Tests

The test suite covers all 9 modules with **220 unit tests** (positive, negative, and edge cases). No database connection is required — all external dependencies are mocked.

```bash
# Run all tests
npm test

# Run with test names printed
npm run test:verbose

# Run a single module
npm run test:meeting
npm run test:auth
npm run test:lead
npm run test:task
npm run test:deal
npm run test:product
npm run test:ticket
npm run test:call
npm run test:user
```

### Test coverage summary

| Module | Tests |
|---|---|
| auth | 33 |
| meeting | 40 |
| ticket | 28 |
| task | 28 |
| call | 27 |
| deal | 24 |
| lead | 20 |
| product | 20 |
| user | 20 |
| **Total** | **220** |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm start` | Start in production mode |
| `npm test` | Run all unit tests |
| `npm run test:verbose` | Run tests with detailed output |
| `npm run test:<module>` | Run tests for a specific module |

---

## License

ISC
