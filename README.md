# Music Rehearsal Scheduler

A comprehensive web application designed to help bands, orchestras, and music ensembles streamline their rehearsal planning processes. This tool automates scheduling, attendance tracking, and communication between members to optimize rehearsal efficiency.

## Features

- **Centralized Calendar System**: Create and view rehearsal events on a shared calendar
- **Availability Management**: Track member availability with heat map visualization
- **Automated Scheduling**: Get optimal rehearsal time suggestions based on member availability
- **RSVP & Attendance Tracking**: Confirm attendance and track member participation
- **Notification System**: Receive automated reminders and announcements
- **Setlist Management**: Create rehearsal agendas with song lists and time allocations
- **Resource Coordination**: Coordinate equipment and venue management
- **User Management**: Create band/ensemble profiles with role-based permissions
- **Mobile Responsiveness**: Access all features from any device
- **Integration Capabilities**: Sync with personal calendars and messaging platforms

## Technology Stack

### Frontend
- React.js with TypeScript
- Redux Toolkit for state management
- Material-UI for responsive design
- FullCalendar.js for calendar functionality
- Styled-components and SCSS for styling

### Backend
- Node.js with Express
- JWT with OAuth for authentication
- Socket.io for real-time updates

### Database
- PostgreSQL for relational data
- Redis for caching

### Deployment & Infrastructure
- AWS (EC2 or ECS)
- Docker containerization
- GitHub Actions for CI/CD
- Sentry and New Relic for monitoring

## System Architecture

The application follows a microservices architecture with:

1. **Client Application Layer**: React-based web app with Progressive Web App capabilities
2. **API Gateway**: Handles authentication, routing, and rate limiting
3. **Service Layer**: Separate services for users, scheduling, notifications, and resources
4. **Data Layer**: PostgreSQL database clusters with Redis caching
5. **External Integration Layer**: Connects with calendar APIs and messaging platforms
6. **Infrastructure**: Load balancers, CDN, and backup systems

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm 8.x or higher
- PostgreSQL 14.x
- Redis 6.x

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dxaginfo/music-rehearsal-scheduler.git
cd music-rehearsal-scheduler
```

2. Install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables:
```bash
# In the server directory, create a .env file
cp .env.example .env
```

4. Set up the database:
```bash
# Run PostgreSQL migrations
cd server
npm run migrate
```

5. Start the development servers:
```bash
# Start the backend server
cd server
npm run dev

# In a new terminal, start the frontend
cd client
npm start
```

6. Access the application at `http://localhost:3000`

## Project Structure

```
music-rehearsal-scheduler/
├── client/                  # Frontend React application
│   ├── public/              # Public assets
│   ├── src/                 # Source files
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store configuration
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service integration
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx          # Main App component
│   ├── package.json         # Frontend dependencies
│   └── tsconfig.json        # TypeScript configuration
├── server/                  # Backend Node.js/Express application
│   ├── src/                 # Source files
│   │   ├── api/             # API routes
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── db/              # Database models and migrations
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic
│   │   └── app.js           # Express app setup
│   ├── package.json         # Backend dependencies
│   └── tsconfig.json        # TypeScript configuration
├── .github/                 # GitHub Actions CI/CD configuration
├── docker/                  # Dockerfiles and docker-compose config
├── docs/                    # Documentation files
└── package.json             # Root package.json for scripts
```

## Development

### Backend API Documentation
API documentation is available at `/api/docs` when running the server locally.

### Testing
```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

### Linting
```bash
# Lint backend code
cd server
npm run lint

# Lint frontend code
cd client
npm run lint
```

## Deployment

### Using Docker
```bash
# Build and run with docker-compose
docker-compose up -d
```

### Manual Deployment
Refer to the [deployment guide](docs/deployment.md) for detailed instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- FullCalendar.js for the calendar component
- Material-UI for the design components
- All contributors who participate in this project

## Contact

Project Link: [https://github.com/dxaginfo/music-rehearsal-scheduler](https://github.com/dxaginfo/music-rehearsal-scheduler)