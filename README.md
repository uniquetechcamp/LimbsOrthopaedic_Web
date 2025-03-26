
# LIMBS Orthopaedic Web Application

A modern web application for LIMBS Orthopaedic built with React, TypeScript, and Express.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd limbs-orthopaedic
```

2. Install dependencies:
```bash
npm install
cd client && npm install
```

3. Create a `.env.local` file in the client directory with your Firebase configuration:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
# Start the backend server
npm run dev

# In a new terminal, start the frontend
cd client && npm run dev
```

5. Open your browser and navigate to:
- Frontend: http://0.0.0.0:5173
- Backend API: http://0.0.0.0:5000

## Deployment on Replit

1. Import your project to Replit
2. Set up your environment variables in the Secrets tab
3. Click on "Deploy" in the toolbar to publish your application

## Project Structure
```
limbs-orthopaedic/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/          # Utility functions and configs
│   │   ├── pages/        # Page components
│   │   ├── styles/       # Global styles and CSS
│   │   └── App.tsx       # Main application component
│   └── index.html        # HTML entry point
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Database configurations
├── shared/               # Shared types and utilities
├── scripts/             # Utility scripts
└── package.json         # Project dependencies
```

## Features

- User Authentication
- Product Catalog
- Service Listings
- Blog System
- Appointment Booking
- Admin Dashboard
- Responsive Design
