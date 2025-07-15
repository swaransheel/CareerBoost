# CareerBoost Platform

A modern job application platform built with React, Express.js, and PostgreSQL. Features a clean interface for job seekers to browse listings and submit applications, plus an admin dashboard for managing applications.

## Tech Stack

### Frontend
- React with TypeScript
- TanStack Query for data fetching
- Tailwind CSS with shadcn/ui components
- Wouter for routing
- Vite for development and production builds

### Backend
- Node.js with Express.js
- PostgreSQL with Drizzle ORM
- TypeScript with ES modules

## Prerequisites

- Node.js v18 or later
- PostgreSQL 14 or later
- npm or yarn

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/swaransheel/CareerBoost.git
   cd CareerBoostPlatform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL=postgresql://[user]:[password]@localhost:5432/careerboost
   ```

4. Initialize the database:
   ```bash
   # Create the database
   createdb careerboost

   # Run migrations
   npm run db:migrate

   # Seed initial data
   npm run dev
   # Then visit http://localhost:5173/api/seed
   ```

5. Start the development servers:
   ```bash
   # Start both frontend and backend
   npm run dev
   ```

   The application will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## Database Migrations

- Generate migrations:
  ```bash
  npm run db:generate
  ```

- Apply migrations:
  ```bash
  npm run db:migrate
  ```

## Project Structure

```
CareerBoostPlatform/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utilities and configuration
│   │   └── pages/      # Page components
├── server/             # Backend Express application
│   ├── db.ts          # Database configuration
│   ├── routes.ts      # API routes
│   └── storage.ts     # Data access layer
└── shared/            # Shared types and schemas
    └── schema.ts      # Zod schemas and types
```

## Available Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Apply database migrations

## Features

- Job listing browsing
- Job application submission
- Application status tracking
- Admin dashboard for managing applications
- Status updates (shortlist, reject, etc.)
- Search and filter applications
- Responsive design

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
