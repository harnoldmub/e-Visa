# e-Visa RDC Platform

## Overview

This is an official e-Visa application platform for the Democratic Republic of Congo (République Démocratique du Congo). The system enables foreign travelers to submit, pay, track, and receive electronic visas online, while providing the DGM (Direction Générale de Migration) administration with tools to control, validate, and issue e-Visas.

The platform supports four visa types: Tourism, Business, Transit, and Short Stay. It features a multi-step application process, M-Pesa payment integration, application tracking, visa verification, and an administrative dashboard for processing applications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/` (home, apply, track, verify, admin)
- Reusable UI components in `client/src/components/ui/`
- Application-specific components in `client/src/components/`
- Custom hooks in `client/src/hooks/`

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Style**: RESTful JSON API under `/api/` prefix
- **Build**: esbuild for production bundling

The server implements:
- Application submission and tracking endpoints
- Visa verification endpoints
- Admin dashboard API routes
- Static file serving for production builds

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` with Zod validation via drizzle-zod
- **Storage**: Currently uses in-memory storage interface (`server/storage.ts`) with PostgreSQL schema ready for migration

Key entities:
- Users (admin accounts)
- Applications (visa applications with full applicant details)
- Visas (issued visa documents)
- Payments (M-Pesa transactions)
- AuditLogs (action tracking)

### Design System
The platform follows official DRC government branding:
- Primary blue: #3774b6
- Dark blue: #1f4f8b
- Success green: #2ecc71
- Error red: #e74c3c
- Light/dark theme support with CSS custom properties

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured via DATABASE_URL environment variable)
- **Drizzle Kit**: Database migrations in `./migrations`

### Payment Integration
- **M-Pesa**: Mobile payment system for visa fee collection (integration pending)

### Third-Party Libraries
- **shadcn/ui**: Component library (configured in `components.json`)
- **Radix UI**: Accessible UI primitives
- **TanStack Query**: Data fetching and caching
- **date-fns**: Date manipulation
- **Zod**: Schema validation

### Development Tools
- **Vite**: Development server with HMR
- **tsx**: TypeScript execution for development
- **Replit plugins**: Runtime error overlay, cartographer, dev banner

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string