
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
