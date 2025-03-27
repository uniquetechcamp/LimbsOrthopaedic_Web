
# LIMBS Orthopaedic Web Application

A modern web application for LIMBS Orthopaedic built with React, TypeScript, and Express, providing orthopaedic services and products in Nairobi, Kenya.

## Features

- User Authentication with Firebase
- Appointment Booking System
- Service Listings
- Product Catalog
- Blog System
- Responsive Design
- Admin Dashboard
- Contact Form
- Real-time Updates

## Tech Stack

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS + Shadcn UI
- State Management: Redux Toolkit
- Backend: Express.js
- Database: NeonDB (PostgreSQL)
- ORM: Drizzle
- Authentication: Firebase
- Form Handling: React Hook Form + Zod
- Routing: React Router

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Environment Variables

Create a `.env.local` file in the client directory with:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Development

1. Install dependencies:
```bash
npm install
cd client && npm install
```

2. Start development servers:
```bash
# Start backend (Port 5000)
npm run dev

# In another terminal, start frontend
cd client && npm run dev
```

3. Access the application:
- Frontend: http://0.0.0.0:5173
- Backend API: http://0.0.0.0:5000

## Project Structure

```
limbs-orthopaedic/
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # React context providers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions
│   │   ├── pages/       # Page components
│   │   └── App.tsx      # Main component
├── server/               # Backend Express application
├── shared/              # Shared types and utilities
└── scripts/            # Utility scripts
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run check`: Run TypeScript checks
- `npm run db:push`: Update database schema

## Deployment on Replit

1. Fork the project on Replit
2. Set up environment variables in Secrets
3. Use the Run button to start the development server
4. Deploy using the Deploy button in the toolbar

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT
