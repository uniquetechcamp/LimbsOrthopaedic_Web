# Project Structure Documentation

```
limbs-orthopaedic/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Shared components
│   │   │   ├── layout/           # Layout components
│   │   │   └── ui/              # UI components
│   │   ├── contexts/            # React contexts
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/               # Utilities
│   │   ├── pages/            # Page components
│   │   │   ├── About.tsx
│   │   │   ├── Blog.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Products.tsx
│   │   │   └── Services.tsx
│   │   └── styles/          # CSS styles
│   ├── public/             # Static assets
│   └── index.html         # HTML entry
├── server/
│   ├── controllers/      # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/         # Data models
│   ├── routes/        # API routes
│   └── index.ts       # Server entry
├── shared/           # Shared code
│   └── schema.ts    # Type definitions
├── scripts/        # Utility scripts
├── .gitignore
├── package.json
└── tsconfig.json
```

## Key Directories

### Frontend (/client)
- `components/`: Reusable UI components
- `contexts/`: React context providers
- `hooks/`: Custom React hooks
- `pages/`: Main page components
- `lib/`: Utility functions and configurations

### Backend (/server)
- `controllers/`: Business logic
- `middleware/`: Request processing
- `models/`: Data schemas
- `routes/`: API endpoint definitions

### Shared (/shared)
- Common types and utilities used by both frontend and backend

### Configuration Files
- `tsconfig.json`: TypeScript configuration
- `package.json`: Project dependencies
- `.env.local`: Environment variables

## Technologies and Tools

### Programming Languages
- **TypeScript/JavaScript**
  - Used throughout the frontend (React components, hooks, contexts)
  - Backend server implementation (Express.js)
  - Shared type definitions and utilities

- **CSS/SCSS**
  - Styling with Tailwind CSS
  - Custom CSS modules
  - Theme customization

### Frontend Technologies
- **React**: Main frontend framework
- **Redux Toolkit**: State management
- **Wouter**: Lightweight routing
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library built on Radix UI
- **Vite**: Build tool and development server
- **React Query**: Data fetching and caching
- **React Hook Form**: Form handling
- **Zod**: Schema validation

### Backend Technologies
- **Express.js**: Web server framework
- **Drizzle ORM**: Database ORM
- **PostgreSQL**: Database (via NeonDB serverless)
- **Passport.js**: Authentication middleware
- **Firebase**: Authentication and storage
- **WebSocket**: Real-time communication

### Development Tools
- **ESBuild**: JavaScript bundler
- **TypeScript**: Static type checking
- **PostCSS**: CSS processing
- **Node.js**: Runtime environment
- **npm**: Package management

### Testing and Quality
- **React Testing Library**: Component testing
- **TypeScript**: Type checking
- **ESLint**: Code linting
- **Prettier**: Code formatting

### Deployment and Infrastructure
- **Replit**: Development and hosting platform
- **Cloud Run**: Deployment target
- **NeonDB**: Serverless Postgres database

### Version Control
- **Git**: Source code management