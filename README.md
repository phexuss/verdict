
# Verdict

A mood-based movie discovery application that translates your current state into the perfect watch.

### Mobile

<p align="center">
  <img  src="https://github.com/user-attachments/assets/ff5699a4-12b4-494c-94b7-da4c0eebb515"  width="280" />
  <img src="https://github.com/user-attachments/assets/a8513a6a-5108-438e-8825-4299510ed9ad" width="280" />
</p>

### Desktop — Curated & Taste Profile

<p align="center">
  <img  src="https://github.com/user-attachments/assets/56c94d68-f502-4b64-8623-92810c1124a9" width="800" />
  <img src="https://github.com/user-attachments/assets/c704fd71-ce5b-4f08-bd55-ba959184cf90" width="800" />
</p>

## The Problem

People often spend more time deciding what to watch than actually watching it. Traditional genre-based filters fail to account for the most important viewing factor: the viewer's current mood and context. Endless scrolling through massive streaming catalogs leads to decision fatigue rather than discovery.

## How it works

Verdict introduces the "Tonight" flow:

1. **Input:** The user selects their current mood, the viewing group size, and available time.
2. **Translation:** The AI engine interprets these qualitative feelings into precise TMDB Discover API parameters.
3. **Curation:** Instead of an endless list, the application presents a curated trio from a real candidate pool:
   - **Safe:** A reliable, highly-rated choice.
   - **Risk:** The primary, more adventurous recommendation based on the current mood.
   - **Wildcard:** An unexpected but fitting alternative.

## Features

* **AI Mood Translation** — Converts abstract feelings into concrete search parameters using Groq-powered AI.
* **Tri-Choice Curation** — Eliminates decision fatigue by limiting options to three distinct categories.
* **Taste Profiling** — Tracks user interactions (saves, watches, ratings) to build a tailored recommendation profile.
* **Localization** — Fully internationalized with English and Russian support (via next-intl).
* **Daily Lists** — Auto-generated daily recommendations based on trending data.

## Tech Stack

### Backend

* **NestJS** — Core backend framework providing robust module architecture and scalability.
* **Prisma & PostgreSQL** — Type-safe database access and schema management.
* **Better Auth** — Secure and flexible authentication management.
* **Groq SDK** — High-speed LLM integration for rapid mood analysis and translation.

### Frontend

* **Next.js (App Router)** — React framework optimized for Server-Side Rendering (SSR) and seamless routing.
* **React Query & Orval** — Type-safe API client generation and robust state management.
* **Tailwind CSS & shadcn/ui** — Utility-first styling with a tailored dark, amber-themed component library.
* **next-intl** — Server-side and client-side internationalization.

### Infrastructure

* **Turborepo** — High-performance build system orchestrating the monorepo structure.
* **TMDB API** — The primary data source for movie metadata.
* **Biome** — Unified and fast formatting/linting toolchain.

## Architecture

The repository utilizes a Turborepo monorepo setup managed via npm workspaces:

* `apps/api`: The NestJS backend service handling business logic, database operations, and external API integrations (TMDB, Groq).
* `apps/web`: The Next.js frontend application consuming the API and rendering the user interface.
* `packages/`: Shared configurations (Biome, TypeScript), utilities, and reusable UI components.

## Getting Started

### Prerequisites

* Node.js (v20+ recommended)
* npm (v11+)
* PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/phexuss/verdict.git
   cd verdict
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Configure environment variables in `apps/api/.env` (and `apps/web/.env.local` as needed):

   ```bash
   # Example backend configuration
   PORT=3001
   WEB_ORIGIN='http://localhost:3000'
   DATABASE_URL='postgresql://...'
   TMDB_BEARER_TOKEN='your_tmdb_token'
   BETTER_AUTH_SECRET='your_auth_secret'
   BETTER_AUTH_URL='http://localhost:3001'
   GROQ_API_KEY='your_groq_api_key'
   ```
4. Setup the database:

   ```bash
   cd apps/api
   npx prisma generate
   npx prisma db push
   cd ../..
   ```
5. Start the development environment:

   ```bash
   # Starts both frontend (port 3000) and backend (port 3001) concurrently
   npm run dev
   ```

## Roadmap

* **Advanced Taste Profiling:** Improving user-specific recommendations based on historical interaction data.
* **Enhanced Group Discovery:** Fine-tuning recommendations for multi-person viewing scenarios.
* **Streaming Provider Integration:** Incorporating platform availability data to filter options by the user's active subscriptions.
