# Verdict

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-Latest-000000?logo=next.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-Latest-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-4169E1?logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0+-38B2AC?logo=tailwind-css&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-Latest-EF4444?logo=turborepo&logoColor=white)

A mood-based movie discovery application that translates your current state into the perfect watch.

### Mobile

<p align="center">
  <img width="280" src="https://github.com/user-attachments/assets/89432d73-c850-4162-8fc8-9ab3f1b57931" />
  <img width="280" src="https://github.com/user-attachments/assets/006af920-ec42-4822-a657-f2e6e1553bca" />
</p>

### Desktop — Curated & Taste Profile

<p align="center">
  <img width="800" src="https://github.com/user-attachments/assets/0c421326-7ae5-4a8d-bd6a-65b6f4427e4e" />
  <img width="800" src="https://github.com/user-attachments/assets/ea33010f-35ab-4cde-b330-cffe1b61a913" />
</p>

### Movies Search Bar & Search Results Page

<p align="center">
<img width="800" src="https://github.com/user-attachments/assets/4ab11243-3b9b-4427-bcb7-c8662493ab7c" />
<img width="800" src="https://github.com/user-attachments/assets/5a8f6e8e-9867-4620-b76e-0dc982b0903f" />
</p>

### ✨ NEW — IMDb CSV Ratings Import

Seamlessly import your rating history directly from an IMDb CSV export into your Verdict movie shelf — featuring a 5-step guided interactive tutorial, automatic TMDB ID resolution, rate-limited batching, and smart duplicate rating preservation.

<p align="center">
<img width="800" src="https://github.com/user-attachments/assets/19d9d292-2fb0-4e87-b25a-a5c401ef8988" />
<img width="800" src="https://github.com/user-attachments/assets/e881b11d-05b2-43aa-97d4-9c04508fc006" />
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
