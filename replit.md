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

## Recent Changes

- June 19, 2025: Added birth date collection and display functionality
  - Added optional birth date field to user registration form
  - Updated database schema to store birth dates for zodiac calculation
  - Enhanced admin analytics to display birth date column in user data table
  - Updated CSV export to include birth date information
  - Improved search functionality to include birth date filtering

- June 19, 2025: Added Parallax Scroll Layout for quiz questions
  - Created layered design with parallax effects where images move slower than text
  - Implemented smooth spring animations and depth effects for modern feel
  - Added dynamic overlays and edge highlights for visual depth
  - Optimized for mobile scrolling with hidden scrollbars
  - Features staggered entrance animations and selection indicators

- June 19, 2025: Added new Floating Bubble Layout for quiz questions
  - Created animated circular bubbles with gentle floating motion
  - Implemented golden glow effects for selected states
  - Added floating particles animation for dreamy ethereal feeling
  - Integrated layout into quiz system and admin panel
  - Layout features staggered animations and 3D hover effects

- June 19, 2025: Enhanced quiz layout components for better visual presentation
  - Updated checkbox layout with full-sized images (48-56px height) above content
  - Improved card stack layout with full-sized images occupying 2/3 of card height
  - Hidden navigation buttons on mobile devices for card stack layout
  - Maintained consistent gold color scheme (#d2b183) for selected states
  - Enhanced image presentation with proper aspect ratios and object-cover scaling

- June 19, 2025: Implemented comprehensive UI revisions from feedback
  - Updated button colors throughout application (#DA7346 primary, #D1AB66 hover)
  - Changed all CTA button text to "Find Your Scent Here" for consistency
  - Aligned Fordive logo to left in navigation header
  - Updated footer background color to #D1AB66 and changed headings to Inter font
  - Modified Hero section layout to vertical arrangement (text above, perfumes below)
  - Fixed newsletter form text formatting with proper line breaks
  - Removed "Learn More" link from homepage hero section
  - Center-aligned footer elements (logo, tagline, button) for cleaner organization

- June 18, 2025: Redesigned result image generator to match brand template
  - Updated layout from dark theme to cream/gold gradient background
  - Resized to Instagram Story format (375x667px, 9:16 ratio)
  - Extended product image to fill majority of space with golden gradient overlay
  - Positioned text overlay at bottom with proper contrast
  - Integrated search icon and underlined fordive.id link
  - Optimized export settings for social media sharing (750x1334px output)

- June 18, 2025: Fixed admin panel scent creation
  - Resolved database sequence conflicts causing duplicate key errors
  - Added URL-based image field replacing problematic file upload
  - Improved error logging and validation feedback

- June 18, 2025: Initial project setup