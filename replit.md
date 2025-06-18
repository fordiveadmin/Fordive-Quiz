# Fordive Scent Finder

## Overview

Fordive Scent Finder is a full-stack web application that helps users discover their perfect fragrance through an interactive personality quiz. The application combines user personality traits with zodiac signs to recommend personalized Fordive perfumes.

## System Architecture

This is a monorepo structured as a modern full-stack application with the following key architectural decisions:

### Frontend
- **React 18** with TypeScript for the user interface
- **Wouter** for client-side routing (lightweight alternative to React Router)
- **TanStack Query** for server state management and API calls
- **Zustand** with persistence for local state management
- **Tailwind CSS** with **shadcn/ui** components for styling
- **Framer Motion** for smooth animations and transitions
- **Vite** as the build tool and development server

### Backend
- **Express.js** with TypeScript for the REST API server
- **Drizzle ORM** for database operations and schema management
- **PostgreSQL** as the primary database (configured for Neon serverless)
- **Session-based authentication** for admin panel access
- **Nodemailer** for email functionality (newsletter subscriptions)

### Database Schema
The application uses PostgreSQL with the following main entities:
- **Users**: Store user information and newsletter preferences
- **Questions**: Quiz questions with support for multiple choice and complex branching logic
- **Scents**: Fragrance information including notes, vibes, mood, and purchase details
- **Zodiac Mappings**: Personalized scent descriptions based on zodiac signs
- **Quiz Results**: Track user quiz completions and results for analytics

## Key Components

### Quiz System
- Dynamic question flow with support for branching logic
- Multiple question types (multiple choice, checkbox)
- Flexible layout options (standard, grid, carousel, cardstack)
- Complex scoring system that maps answers to scent preferences
- Integration with zodiac sign calculation for personalized results

### Scent Recommendation Engine
- Scoring algorithm that processes quiz answers to calculate scent matches
- Support for both legacy and new answer formats
- Zodiac-based personalization for result descriptions
- Top scent selection based on weighted scoring

### Admin Panel
- Password-protected admin interface
- CRUD operations for questions, scents, and zodiac mappings
- Analytics dashboard with quiz result tracking
- CSV export functionality for data analysis
- Session management with configurable timeouts

### User Experience
- Progressive quiz interface with smooth transitions
- Mobile-responsive design
- Share functionality for quiz results
- Newsletter subscription integration
- Personalized result pages with zodiac-specific descriptions

## Data Flow

1. **User Registration**: Users provide name, email, and optional birth date
2. **Quiz Taking**: Users answer personality questions with weighted scent mappings
3. **Score Calculation**: Backend processes answers to calculate scent compatibility scores
4. **Result Generation**: System determines top scent match and retrieves zodiac-specific description
5. **Result Display**: Users see personalized fragrance recommendation with detailed description
6. **Analytics Tracking**: Quiz results are stored for admin analytics and insights

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Drizzle Kit**: Database migration and schema management

### UI/UX
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation for forms and API requests

### Development
- **TSX**: TypeScript execution for development
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Tailwind CSS
- **Autoprefixer**: CSS vendor prefix automation

## Deployment Strategy

The application is configured for multiple deployment targets:

### Replit Deployment
- Configured with `.replit` file for Replit hosting
- Includes PostgreSQL module for database provisioning
- Development server runs on port 5000
- Automatic builds with `npm run build` and `npm run start`

### Vercel Deployment
- Configured with `vercel.json` for serverless deployment
- API routes handled by Vercel Node.js runtime
- Static file serving with proper rewrites
- Production builds optimized for edge deployment

### Local Development
- Vite dev server with hot module replacement
- TSX for TypeScript execution without compilation
- Automatic database migrations with Drizzle

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 18, 2025. Initial setup