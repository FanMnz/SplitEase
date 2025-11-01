# SplitEase - Group Billing Application for HORECA

## Project Overview
SplitEase is a modern web application designed to revolutionize group billing for the HORECA (Hotel, Restaurant, Catering) industry. The application enables seamless bill splitting, expense tracking, and payment management for groups dining or staying together.

## Tech Stack
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS
- **Architecture**: App Router with Server Components
- **Styling**: Tailwind CSS with custom utilities
- **Development**: ESLint, TypeScript strict mode
- **Build**: Next.js optimized production builds

## Core Features Implemented
- **Landing Page**: Marketing page showcasing SplitEase benefits
- **Dashboard**: Real-time restaurant management interface
- **Table Management**: Visual table grid with guest seating
- **Order Tracking**: Kitchen workflow and order status management
- **Payment Processing**: Bill splitting with multiple methods
- **Responsive Design**: Mobile-first approach for tablets and phones

## Development Guidelines
- Use TypeScript for type safety across all components
- Follow component-based architecture with reusable components
- Implement responsive design patterns
- Include comprehensive error handling
- Add proper validation for all inputs
- Use modern ES6+ features and async/await patterns
- Follow REST API conventions for future backend integration

## Project Structure
- `/src/app/` - Next.js App Router pages
- `/src/components/` - Reusable UI components
- `/src/types/` - TypeScript type definitions
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS customization

## Running the Application
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`
4. Access at: http://localhost:3000 (or 3001 if 3000 is in use)

## Future Enhancements
- Real-time updates with WebSockets
- Backend API with Node.js/Express
- Database integration with MongoDB
- Authentication and authorization
- Payment gateway integrations
- SMS/Email notifications
- Advanced analytics and reporting