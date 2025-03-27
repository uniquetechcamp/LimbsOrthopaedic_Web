
# Project Structure Documentation

```
limbs-orthopaedic/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Shared components
│   │   │   ├── layout/           # Layout components
│   │   │   └── ui/              # Shadcn UI components
│   │   ├── contexts/            # React contexts
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/               # Utilities
│   │   ├── pages/            # Page components
│   │   │   ├── admin/       # Admin pages
│   │   │   ├── auth/       # Authentication pages
│   │   │   └── public/    # Public pages
│   │   ├── store/        # Redux store and slices
│   │   └── styles/      # CSS and Tailwind styles
│   ├── public/         # Static assets
│   └── index.html     # HTML entry
├── server/
│   ├── controllers/  # Route controllers
│   ├── middleware/  # Express middleware
│   ├── models/     # Data models
│   ├── routes/    # API routes
│   └── index.ts  # Server entry
├── shared/      # Shared code
│   └── schema.ts # Type definitions
├── scripts/    # Utility scripts
└── config/    # Configuration files
```

## Key Technologies

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Redux Toolkit** for state management
- **React Router v6** for routing
- **Tailwind CSS** with custom theme
- **Shadcn UI** components
- **React Hook Form** + Zod for forms
- **React Query** for data fetching

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for database operations
- **NeonDB** (PostgreSQL) for data storage
- **Firebase Auth** for authentication
- **WebSocket** for real-time features

### Development Tools
- **TypeScript** for type safety
- **ESLint** + Prettier for code quality
- **Replit** for development and deployment
- **Git** for version control

### Testing
- **Vitest** for unit testing
- **React Testing Library** for component tests
- **MSW** for API mocking

### Key Features Implementation

#### Authentication System
- Firebase Authentication integration
- Role-based access control
- Protected routes
- Admin dashboard access

#### Appointment System
- Real-time booking
- Calendar integration
- Email notifications
- Status tracking

#### Patient Management
- Patient profiles
- Treatment history
- Progress tracking
- Document storage

#### Admin Features
- User management
- Appointment oversight
- Content management
- Analytics dashboard

## Development Workflows

### Local Development
```bash
npm run dev          # Start development server
npm run build       # Build for production
npm run test       # Run tests
npm run lint      # Run linter
```

### Database Operations
```bash
npm run db:push    # Update database schema
npm run db:studio # Open database UI
```

### Deployment (Replit)
- Automatic deployment via Replit
- Production optimization
- Environment variable management
- SSL/TLS security

## Environment Configuration
Required environment variables:
- Firebase credentials
- Database connection
- API keys
- Service configurations

## Performance Optimizations
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- API response compression

## Security Measures
- CORS configuration
- Rate limiting
- Input validation
- XSS prevention
- CSRF protection
