# Demand Forecaster - Multi-Sector AI Platform

## Overview

This is a comprehensive multi-sector demand forecasting platform that leverages AI-powered analysis with real-time data integration to predict demand across Healthcare, Automobile, and Agriculture sectors. The system uses React for the frontend, Express.js for the backend, PostgreSQL for data storage, and integrates with Google's Gemini AI for intelligent sector-specific predictions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom PwC branding
- **State Management**: TanStack Query for server state, React Context for auth
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with local strategy and session-based auth
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Password Security**: Built-in scrypt hashing with salt

### Database Architecture
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Multi-sector tables for users, sectors, demand items, predictions, alerts, contextual data, and reports
- **Migrations**: Drizzle Kit for schema management with sector-specific fields

## Key Components

### Public Access Architecture
- No authentication required - all features publicly accessible
- Direct sector access from landing page without user accounts
- Session-free operation for maximum accessibility
- Public API endpoints for all forecasting functionality

### Multi-Sector AI Prediction Engine
- Google Gemini AI integration for sector-specific demand predictions
- Healthcare: Medicine demand by age groups, dosage forms, severity levels
- Automobile: Vehicle demand by region, fuel type, vehicle class
- Agriculture: Seeds, fertilizers, machinery, pesticides demand
- Environmental factor analysis and market trend integration
- Confidence scoring and risk level assessment per sector

### Sector Navigation Dashboard
- Multi-sector landing page with healthcare, automobile, agriculture options
- Sector-specific dashboards with targeted metrics and forecasts
- Interactive region and category filtering
- Real-time data visualization for each sector
- Sector-specific alert management system

### Demand Forecasting System
- AI-driven demand predictions based on real-time market data
- Inventory and supply level tracking
- Market trend analysis and policy impact assessment
- Integration with environmental and social data sources

## Data Flow

1. **Multi-Source Data Collection**: System gathers sector-specific data (market trends, environmental factors, policy changes, social sentiment)
2. **Sector-Specific AI Analysis**: Gemini AI processes data through sector-specific prompts and models for healthcare, automobile, and agriculture
3. **Demand Prediction Generation**: System creates sector-specific demand predictions with confidence scores and quantity estimates
4. **Alert System**: High-demand or critical predictions trigger automated sector-specific alerts
5. **Dashboard Updates**: Real-time updates to sector dashboards with metrics and visualizations
6. **Intelligent Recommendations**: AI analyzes predictions to suggest inventory management and strategic decisions

## External Dependencies

### AI Services
- **Google Gemini 2.0 Flash**: Primary AI engine for multi-sector demand prediction using real-time data
- **Sector-Specific Prompting**: Tailored AI prompts for healthcare, automobile, and agriculture forecasting
- **API Integration**: RESTful integration with error handling and rate limiting
- **Real-time Data Processing**: Integration with authentic market, environmental, and industry-specific data

### Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL database with WebSocket support
- **Connection Pooling**: Efficient database connection management

### Data Sources
- **Real-time Market Data**: Live market trends, pricing, and economic indicators
- **Environmental Monitoring**: Weather patterns, agricultural conditions, and environmental factors
- **Industry-Specific Data**: Healthcare surveillance, automobile market trends, agricultural crop data
- **Location Database**: Comprehensive database focused on Indian regions with sector-specific data

### UI Components
- **Radix UI**: Accessible, unstyled component primitives
- **Recharts**: Data visualization library for charts and graphs
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools
- **Vite**: Build tool with hot module replacement
- **Drizzle Kit**: Database schema management and migrations
- **TypeScript**: Static type checking across the entire stack

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Development**: Local development with hot reload via Vite
- **Production**: Optimized builds with static asset serving
- **Database**: Environment-based connection strings
- **AI Services**: API key management for Gemini integration

### Security Considerations
- **Session Management**: Secure session storage with PostgreSQL
- **Password Security**: Industry-standard scrypt hashing
- **API Protection**: Authentication middleware on sensitive endpoints
- **Environment Variables**: Secure configuration management

## Recent Changes (July 2025)

✓ Transformed from healthcare-only to multi-sector demand forecasting platform
✓ Added sector-specific AI prediction modules for healthcare, automobile, and agriculture
✓ Implemented sector navigation system with dedicated dashboards
✓ Updated database schema to support multi-sector architecture
✓ Created sector-specific data seeding and API endpoints
✓ Removed all authentication mechanisms - platform is now publicly accessible
✓ Rebranded UI components from "Disease Prediction" to "DemandCast AI"
✓ Removed all hardcoded static data from dashboard displays
✓ Fixed AI forecasting source property errors for stable data generation
✓ Added comprehensive CSV download report feature for AI forecasts
✓ Removed "Recent Demand Predictions" section - only AI-generated forecasts displayed
✓ Added comprehensive Indian city dropdown with 90+ major cities and states

The system is designed to be scalable, maintainable, and provides real-time insights for demand forecasting across multiple sectors. The architecture separates concerns effectively while maintaining type safety and sector-specific functionality throughout the stack.