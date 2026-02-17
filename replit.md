# Bear Trap Ratio Calculator

## Overview

This is a **Bear Trap Ratio Calculator** for a strategy game. It allows users to input troop counts (infantry, lancer, marksman), hero capacities, march settings, and hero skill levels (Kera & Cyrille) to calculate optimal combat formations and rally compositions. Users can save calculations to a history log and reload them later.

The app uses a "dark gaming" aesthetic with neon green accents, custom fonts (Oxanium for display, Space Grotesk for body), and a cyberpunk-inspired UI.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side router)
- **State Management**: TanStack React Query for server state; local React state for form/calculator state
- **Styling**: Tailwind CSS with CSS variables for theming, using a dark gaming theme with neon green (`#4CAF50`) as the primary color
- **UI Components**: shadcn/ui (new-york style) with Radix UI primitives. Components live in `client/src/components/ui/`. A custom `CyberInput` component exists for the gaming aesthetic.
- **Forms**: react-hook-form with Zod resolver for validation
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite with React plugin
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Framework**: Express 5 running on Node.js with TypeScript (via tsx)
- **Architecture**: Simple REST API with routes defined in `server/routes.ts`
- **API Pattern**: Route definitions and Zod schemas are shared between client and server via `shared/routes.ts`. The `api` object defines method, path, input schema, and response schemas for each endpoint.
- **Development**: Vite dev server is integrated as middleware for HMR during development (`server/vite.ts`)
- **Production**: Client is built with Vite, server is bundled with esbuild into `dist/index.cjs`

### API Endpoints
- `GET /api/calculations` — List all saved calculations (ordered by newest first)
- `POST /api/calculations` — Save a new calculation (name, inputs, results as JSONB)
- `DELETE /api/calculations/:id` — Delete a saved calculation

### Database
- **Database**: PostgreSQL (required, connection via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-Zod type generation
- **Schema**: Single `calculations` table in `shared/schema.ts` with columns: `id` (serial), `name` (text), `inputs` (jsonb), `results` (jsonb), `createdAt` (timestamp)
- **Migrations**: Use `npm run db:push` (drizzle-kit push) to sync schema to database
- **Seeding**: `server/seed.ts` inserts an example calculation if the table is empty

### Shared Code (`shared/`)
- `schema.ts` — Drizzle table definitions, Zod schemas for insert operations, and the `calculatorInputSchema` defining all calculator input fields
- `routes.ts` — API route definitions with paths, methods, input/output Zod schemas, and a `buildUrl` helper for parameterized routes

### Calculator Logic
- Lives in `client/src/lib/calculator.ts`
- Calculations run client-side for instant feedback
- Uses hero skill lookup tables (Kera levels 1-10, Cyrille levels 1-10) to compute troop bonuses
- Results include: bonuses breakdown, open rally composition, remaining troops, base per march, and ratios with/without hero

### Key Design Decisions
1. **Client-side calculation with server-side persistence**: Calculations happen instantly in the browser; results are optionally saved to the database. This gives responsive UX while maintaining history.
2. **Shared route contracts**: Both client and server import from `shared/routes.ts`, ensuring type-safe API calls without code generation tools.
3. **JSONB for flexible storage**: Calculator inputs and results are stored as JSONB columns, allowing the schema to evolve without database migrations for internal structure changes.
4. **Single-page app with sidebar**: Main page has a calculator form, results display, and a history sidebar (collapsible on mobile via Sheet component).

## External Dependencies

- **PostgreSQL**: Required database. Must have `DATABASE_URL` environment variable set.
- **Google Fonts**: Loads Oxanium, Space Grotesk, DM Sans, Fira Code, and Geist Mono fonts via CDN.
- **No authentication**: The app has no auth system — all calculations are publicly accessible.
- **No external APIs**: All calculation logic is self-contained; no third-party service calls.