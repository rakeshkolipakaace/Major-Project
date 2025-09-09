# Tale Galaxy - Interactive Children's Reading App

## Overview

Tale Galaxy is an interactive children's reading application that combines storytelling with gamification elements. The app provides themed story collections (space, magic, animals) with audio playback, speech recognition for pronunciation practice, and a reward system to encourage reading. Built with a modern React frontend and Express backend, it focuses on making reading engaging and educational for children through interactive features and progress tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state and custom React hooks for local state
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Audio Features**: Web Speech API integration for text-to-speech and speech recognition

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints under `/api` prefix
- **Data Storage**: In-memory storage with file-based story templates (JSON)
- **Development Setup**: Vite middleware integration for hot reloading in development

### Data Storage Solutions
- **Story Templates**: Static JSON files stored in `server/data/` directory
- **User Progress**: Browser localStorage for persistence across sessions
- **In-Memory Storage**: Temporary user data storage using Map-based implementation
- **Database Ready**: Drizzle ORM configured for PostgreSQL (Neon Database) for future scalability

### Authentication and Authorization
- **Current State**: No authentication implemented - designed for local/demo use
- **User Management**: Basic user interface with in-memory storage
- **Session Management**: Prepared infrastructure with connect-pg-simple for future implementation

### External Dependencies
- **Database**: Neon Database (PostgreSQL) via `@neondatabase/serverless` driver
- **ORM**: Drizzle ORM with Zod validation schemas
- **UI Library**: Radix UI components for accessibility-first design
- **Fonts**: Google Fonts integration (Inter, Fredoka One for gaming feel)
- **Image Assets**: Unsplash for story theme imagery
- **Audio**: Browser native Web Speech API for text-to-speech and speech recognition
- **Development Tools**: Replit-specific plugins for development environment integration

### Key Design Patterns
- **Component Composition**: Reusable UI components with consistent prop interfaces
- **Custom Hooks**: Encapsulated logic for game data, speech recognition, and audio controls
- **Context API**: Minimal usage for toast notifications and tooltips
- **File-Based Routing**: Simple page structure with wouter for navigation
- **Progressive Enhancement**: Speech features degrade gracefully when not supported
- **Responsive Design**: Mobile-first approach with Tailwind's responsive utilities

### Game Mechanics
- **Progress Tracking**: Star-based reward system with achievements
- **Reading Sessions**: Chapter-by-chapter progress with pronunciation scoring
- **Streak System**: Daily reading encouragement
- **Theme-Based Organization**: Stories categorized by space, magic, and animals themes
- **Interactive Elements**: Audio playback and voice recording for pronunciation practice