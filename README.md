# Location-Based Agent Management System (MERN)

A complete Location-Based Agent Management System built using MongoDB, Express.js, React.js, and Node.js. It features a complete role-based access control (RBAC) system mapping an agent hierarchy (State -> Division -> District -> Pincode) and supporting business tie-up operations.

## Tech Stack
- **Frontend**: React, React Router, Redux Toolkit, Tailwind CSS, Recharts (for analytics and dashboards), Lucide icons.
- **Backend**: Node.js, Express.js, JWT, Mongoose, Multer (file uploads).
- **Database**: MongoDB (runs on local instance or automatically falls back to an embedded in-memory database).

## Folder Structure
```
├── frontend/             # React Client
│   ├── src/
│   │   ├── components/   # Shared components & layouts
│   │   ├── pages/        # Login and Dashboard pages
│   │   ├── redux/        # Redux Toolkit global store
│   │   ├── services/     # Axios API configuration
│   │   └── index.css     # Tailwind Directives & fonts
├── backend/              # Node server
│   ├── config/           # DB connections and seed helpers
│   ├── controllers/      # Route controllers (auth, shops, agents, etc.)
│   ├── models/           # Mongoose schemas
│   ├── middleware/       # JWT & Role validation filters
│   └── server.js         # Entrypoint
```

## Setup Instructions

1. **Install Dependencies**:
   From the root folder, run:
   ```bash
   npm run install-all
   ```

2. **Start Dev Server**:
   From the root folder, run:
   ```bash
   npm run dev
   ```
   This command starts the backend on port `5000` and frontend on port `3000` concurrently.

## Database Seeding
The backend contains a self-healing configuration. If MongoDB is empty or a local connection fails, it will boot up using an in-memory database and **automatically auto-seed itself** with the following accounts:

- **Admin Account**: `admin@forgeindia.com` (password: `adminpassword`)
- **State Agent**: `stateagent@forgeindia.com` (password: `password123`)
- **Divisional Agent**: `divisionagent@forgeindia.com` (password: `password123`)
- **District Agent**: `districtagent@forgeindia.com` (password: `password123`)
- **Pincode Agent**: `pincodeagent@forgeindia.com` (password: `password123`)
