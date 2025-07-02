# KMC Backend

A Node.js backend application with Express, MongoDB, and comprehensive CI/CD pipeline.

## Features

- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- JWT authentication
- File upload with AWS S3
- Email functionality with Nodemailer
- API documentation with Swagger
- Comprehensive CI/CD pipeline
- Docker containerization
- Automated testing and security scanning

## Prerequisites

- Node.js 18.x or higher
- MongoDB
- Docker (optional, for containerized development)
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kmc-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment files:
```bash
cp .env.example .env
cp .env.example .env.test
```

4. Configure your environment variables in `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kmc-backend
JWT_SECRET=your-jwt-secret
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=your-aws-region
AWS_S3_BUCKET=your-s3-bucket
```

## Development

### Running locally
```bash
npm run dev
```

### Running with Docker
```bash
# Start all services (app, MongoDB, Mongo Express)
npm run docker:compose

# Stop all services
npm run docker:compose:down
```

### Running tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Linting
```bash
# Check for linting issues
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

## CI/CD Pipeline

This project includes a comprehensive CI/CD pipeline with GitHub Actions:

### Workflows

1. **CI (`ci.yml`)**
   - Runs on every push to `main` and `develop` branches
   - Runs on pull requests to `main` and `develop` branches
   - Tests with Node.js 18.x and 20.x
   - Runs linting, tests, and security audits
   - Builds the application

2. **CD - Staging (`cd-staging.yml`)**
   - Deploys to staging environment when code is pushed to `develop` branch
   - Builds and pushes Docker image
   - Performs health checks

3. **CD - Production (`cd-production.yml`)**
   - Deploys to production environment when code is pushed to `main` branch
   - Builds and pushes Docker image with version tags
   - Performs health checks and notifications

4. **Security Scan (`security.yml`)**
   - Runs weekly and on code changes
   - Performs npm audit for vulnerabilities
   - Checks for outdated and unused dependencies

### Required Secrets

Set up the following secrets in your GitHub repository:

- `REGISTRY_URL`: Container registry URL (e.g., `ghcr.io/username`)
- `REGISTRY_USERNAME`: Container registry username
- `REGISTRY_PASSWORD`: Container registry password/token

### Environment Setup

Create environments in GitHub:
1. Go to Settings > Environments
2. Create `staging` and `production` environments
3. Add environment-specific secrets and variables

## Docker

### Building the image
```bash
npm run docker:build
```

### Running the container
```bash
npm run docker:run
```

### Docker Compose
The `docker-compose.yml` file includes:
- Application container
- MongoDB database
- Mongo Express (database management UI)

## API Documentation

Access the Swagger API documentation at:
```
http://localhost:5000/api-docs
```

## Health Check

The application includes a health check endpoint:
```
GET /health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

## Project Structure

```
kmc-backend/
├── app/
│   ├── controllers/     # Route controllers
│   ├── helpers/         # Utility functions
│   ├── middlewares/     # Express middlewares
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── services/        # Business logic
├── config/              # Configuration files
├── utils/               # Utility modules
├── __tests__/           # Test files
├── .github/workflows/   # CI/CD workflows
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose setup
└── package.json         # Dependencies and scripts
```

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request to `develop`

## License

ISC License
