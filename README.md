# Smart School Blog Backend

A NestJS backend application for a smart school blog system with JWT authentication, AI-powered post summaries, user management, events, and comments.

## Features

- **Authentication**: JWT-based user authentication and authorization
- **User Management**: User registration, login, and profile management
- **Posts**: Create, read, update, delete blog posts with AI-generated summaries
- **Comments**: Comment system for posts
- **Events**: Event creation and management system
- **Admin Panel**: Admin users can manage all content
- **AI Integration**: Automatic AI summary generation using Google Gemini API

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Google Gemini API Key** (for AI summaries)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Nick-Lemy/smart-school-blog_backend.git
   cd smart-school-blog_backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/smart_school_blog"

   # JWT Configuration
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

   # AI Integration
   GEMINI_API_KEY="your-gemini-api-key-for-ai-summaries"
   ```

   **Important Environment Variables:**
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Secret key for JWT token signing (use a strong, unique key in production)
   - `GEMINI_API_KEY`: Google Gemini API key for AI summary generation

## Database Setup

1. **Set up PostgreSQL database**

   Create a new PostgreSQL database for the application.

2. **Run Prisma migrations**

   ```bash
   npx prisma migrate dev
   ```

3. **Generate Prisma Client**

   ```bash
   npx prisma generate
   ```

4. **Optional: Seed the database**
   ```bash
   npx prisma db seed
   ```

## Running the Application

### Development Mode

**With npm:**

```bash
npm run start:dev
```

**With yarn:**

```bash
yarn start:dev
```

The application will start on `http://localhost:3000`

### Production Mode

1. **Build the application**

   **With npm:**

```bash
npm run build
```

**With yarn:**

```bash
yarn build
```

2. **Start the production server**

   **With npm:**

```bash
npm run start:prod
```

**With yarn:**

```bash
yarn start:prod
```

### Other Available Scripts

| Script           | npm Command        | yarn Command    | Description             |
| ---------------- | ------------------ | --------------- | ----------------------- |
| Start            | `npm run start`    | `yarn start`    | Start the application   |
| Lint             | `npm run lint`     | `yarn lint`     | Run ESLint              |
| Unit Tests       | `npm run test`     | `yarn test`     | Run unit tests          |
| End-to-End Tests | `npm run test:e2e` | `yarn test:e2e` | Run end-to-end tests    |
| Test Coverage    | `npm run test:cov` | `yarn test:cov` | Run tests with coverage |

## Project Structure

```
src/
├── auth/           # Authentication module (JWT, guards, strategies)
├── user/           # User management module
├── post/           # Blog posts module with AI summaries
├── comment/        # Comments module
├── event/          # Events module
├── prisma/         # Prisma service and configuration
├── main.ts         # Application entry point
└── app.module.ts   # Root application module

prisma/
├── schema.prisma   # Database schema
└── migrations/     # Database migrations

generated/
└── prisma/         # Generated Prisma client
```

## API Documentation

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Key Features Explained

### AI-Powered Summaries

- Posts automatically generate AI summaries using Google Gemini API
- Summaries are stored in the database for quick access
- Fallback to truncated content if AI service is unavailable

### Admin System

- Users with `isVerified: true` have admin privileges
- Admins can delete/update any content (posts, events, users)
- Regular users can only manage their own content

### Authentication & Authorization

- JWT-based authentication
- Role-based access control
- Protected endpoints require valid JWT tokens

## Environment Variables Reference

| Variable         | Description                            | Required | Default |
| ---------------- | -------------------------------------- | -------- | ------- |
| `DATABASE_URL`   | PostgreSQL connection string           | Yes      | -       |
| `JWT_SECRET`     | Secret key for JWT tokens              | Yes      | -       |
| `GEMINI_API_KEY` | Google Gemini API key for AI summaries | Yes      | -       |

## Database Schema

The application uses the following main entities:

- **User**: User accounts with roles and verification status
- **Post**: Blog posts with AI-generated summaries
- **Comment**: Comments on posts
- **Event**: School events with attendee management

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify your `DATABASE_URL` is correct
   - Ensure PostgreSQL is running
   - Check database credentials

2. **AI Summary Generation Fails**
   - Verify your `GEMINI_API_KEY` is valid
   - Check internet connection
   - The app will fallback to truncated summaries

3. **JWT Authentication Issues**
   - Ensure `JWT_SECRET` is set in environment variables
   - Check if JWT token is being sent in Authorization header

### Database Reset

If you need to reset your database:

```bash
npx prisma migrate reset
```

**Warning**: This will delete all data in your database.

## Support

For support and questions, please open an issue in the GitHub repository.
