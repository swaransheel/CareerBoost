# CareerBoost - Job Application Platform

## Overview

CareerBoost is a modern job application platform built with React, Express.js, and PostgreSQL. It provides a clean interface for job seekers to browse job listings and submit applications. The application features a responsive design using Tailwind CSS and shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **API Design**: RESTful API with JSON responses
- **Validation**: Zod schemas for request validation

### Database Schema
The application uses two main tables:
- **jobs**: Stores job listings with fields for title, company, location, description, type, salary, skills, and posting date
- **applications**: Stores job applications with applicant details, resume URL, cover letter, and references to job records

## Key Components

### Client-Side Components
- **Pages**: Home (job listings), Job Detail, Application Form, Not Found
- **Components**: Job Card, Navbar, UI components from shadcn/ui
- **Hooks**: Custom hooks for mobile detection and toast notifications

### Server-Side Components
- **Routes**: Job retrieval endpoints and application submission
- **Storage**: Database abstraction layer with interface-based design
- **Database Connection**: Neon serverless PostgreSQL connection with WebSocket support

### Development Tools
- **Database Migrations**: Drizzle Kit for schema management
- **Development Server**: Vite with HMR and error overlay
- **Code Quality**: TypeScript strict mode with comprehensive path aliases

## Data Flow

1. **Job Browsing**: Users can view job listings fetched from `/api/jobs`
2. **Job Details**: Individual job details are retrieved via `/api/jobs/:id`
3. **Application Submission**: Users submit applications through `/api/applications`
4. **Data Validation**: All inputs are validated using Zod schemas on both client and server
5. **Database Operations**: Drizzle ORM handles all database interactions with type safety

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management

### Data and State
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **date-fns**: Date manipulation utilities

### Database and Backend
- **Neon Database**: Serverless PostgreSQL provider
- **Drizzle ORM**: Type-safe database toolkit
- **Express.js**: Web framework
- **WebSocket**: Real-time connection support

## Deployment Strategy

### Build Process
- **Client Build**: Vite builds the React application to `dist/public`
- **Server Build**: esbuild bundles the Express server to `dist/index.js`
- **Database**: Uses environment variable `DATABASE_URL` for connection

### Environment Configuration
- **Development**: Uses `tsx` for TypeScript execution with auto-reload
- **Production**: Runs compiled JavaScript with Node.js
- **Database Migrations**: Managed through `drizzle-kit push` command

### Hosting Considerations
- **Static Assets**: Client builds to static files for CDN distribution
- **API Server**: Express server can be deployed to any Node.js hosting platform
- **Database**: Uses Neon's serverless PostgreSQL with connection pooling
- **Environment Variables**: Requires `DATABASE_URL` for database connectivity

The application is designed for modern web deployment with separate concerns for frontend and backend, allowing for flexible hosting options and scalability.