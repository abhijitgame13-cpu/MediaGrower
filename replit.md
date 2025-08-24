# Overview

Viralo is an AI-powered social media automation platform that enables users to upload content, automatically enhance it using AI, generate captions and hashtags, and schedule posts across multiple social media platforms. The application streamlines content creation workflows by automating the entire process from upload to publication.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Modern React application using functional components and hooks
- **Vite**: Fast build tool and development server for optimized frontend development
- **Wouter**: Lightweight client-side routing library for navigation
- **TanStack Query**: Server state management for API calls, caching, and data synchronization
- **Shadcn/ui + Radix UI**: Component library built on top of Radix primitives for accessible UI components
- **Tailwind CSS**: Utility-first CSS framework for responsive design and styling

## Backend Architecture
- **Express.js**: Node.js web framework handling API routes and middleware
- **TypeScript**: Type-safe server-side development with ES modules
- **Replit Authentication**: OAuth-based authentication system integrated with Replit's identity provider
- **Session Management**: PostgreSQL-backed session storage using express-session and connect-pg-simple
- **File Upload Handling**: Multer middleware for processing multipart/form-data file uploads with size and type validation

## Database Design
- **PostgreSQL with Drizzle ORM**: Type-safe database operations with schema-first approach
- **Neon Database**: Serverless PostgreSQL database provider for cloud deployment
- **Core Tables**:
  - `users`: User profiles and authentication data
  - `content`: Uploaded files with processing status and AI-generated metadata
  - `social_connections`: Third-party platform authentication tokens
  - `scheduled_posts`: Automated posting queue with timing and platform targeting
  - `analytics`: Performance metrics and engagement data
  - `sessions`: Server-side session storage for authentication

## AI Processing Pipeline
- **Content Analysis**: Automated file type detection and metadata extraction
- **Enhancement Workflows**: AI-powered image/video processing with status tracking
- **Caption Generation**: Automated content description and hashtag creation
- **Publishing Automation**: Scheduled posting to connected social media platforms

## Authentication & Security
- **OpenID Connect**: Standards-based authentication flow with Replit as identity provider
- **Passport.js**: Authentication middleware with OpenID Connect strategy
- **Session Security**: HTTP-only cookies with secure flags and configurable TTL
- **CSRF Protection**: Built-in request validation and origin checking

# External Dependencies

## Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Replit Authentication**: OAuth 2.0/OpenID Connect identity provider
- **Replit Deployment**: Integrated hosting platform with environment variable management

## AI & Processing Services
- Content enhancement and processing capabilities (implementation-ready architecture)
- Image/video manipulation and optimization workflows
- Natural language processing for caption and hashtag generation

## Social Media Integrations
- **Platform APIs**: Instagram, Facebook, Twitter, LinkedIn integration points
- **OAuth Flows**: Social platform authentication and token management
- **Publishing APIs**: Automated content posting with scheduling capabilities

## Development Tools
- **ESBuild**: Fast JavaScript/TypeScript bundling for production builds
- **PostCSS + Autoprefixer**: CSS processing and vendor prefix automation
- **React Dropzone**: File upload interface with drag-and-drop functionality