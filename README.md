# Wallet Service API

A TypeScript-based wallet backend built with Express and MongoDB. The service supports user registration and verification, authentication, wallet transactions, OTP email flows, and transaction history lookups.

## Features

- User signup, login, logout, and account verification
- OTP-based email verification and password reset flow
- Wallet funding and peer-to-peer transfers
- Transaction history retrieval
- JWT-based authorization with token blacklisting
- MongoDB persistence with Mongoose
- Email delivery with Nodemailer

## Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB and Mongoose
- JSON Web Token
- Nodemailer
- bcryptjs
- class-validator
- class-transformer

## Project Structure

```text
src/
  config/          Database connection
  controllers/     Request handlers
  dtos/            Request validation schemas and DTOs
  mail/            Email transport and templates
  middlewares/     Authorization and validation middleware
  model/           MongoDB models
  routes/          API route definitions
  services/        Business logic
  types/           Shared TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- MongoDB instance
- A working SMTP account for outgoing emails

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root and define the following values:

```env
PORT=3000
MONGODB_URL=your_mongodb_connection_string
ACCESS_TOKEN=your_jwt_access_secret
REFRESH_TOKEN=your_jwt_refresh_secret
RESET_PASSWORD=your_password_reset_secret
EMAIL_USER=your_smtp_username
EMAIL_PASS=your_smtp_password
EMAIL_FROM=your_sender_email
```

### Running the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## Available Scripts

- `npm run dev` - Starts the server with Nodemon and tsx for development
- `npm start` - Starts the application using tsx
- `npm test` - Placeholder script

## API Overview

Base URL: `/api`

### Health and Root

- `GET /` - Welcome message
- `GET /health` - Health check

### User Routes

- `POST /api/user/signup` - Register a new user
- `POST /api/user/verifyOtp` - Verify OTP sent to the user
- `POST /api/user/resendOtp` - Resend OTP
- `POST /api/user/login` - Authenticate and receive tokens
- `POST /api/user/logout` - Logout and blacklist the token
- `POST /api/user/forgetPassword` - Request a password reset email
- `POST /api/user/resetPassword` - Reset account password
- `DELETE /api/user/deleteUser/:userId` - Delete a user account
- `GET /api/user/users` - Retrieve all users
- `POST /api/user/verifyUser/:userId` - Manually verify a user

### Transaction Routes

- `POST /api/transaction/transfer` - Transfer funds between users
- `POST /api/transaction/credit` - Credit a wallet
- `GET /api/transaction/my-transactions` - Retrieve the authenticated user's transactions
- `GET /api/transaction/transaction/:reference` - Fetch a transaction by reference

## Authentication

Protected routes require an `Authorization` header in the form:

```http
Authorization: Bearer <token>
```

The token is validated against the configured JWT secret and checked against the blacklist collection before access is granted.

## Notes

- User registration automatically creates a wallet for the new account.
- OTPs are sent by email and expire after a short period.
- Transactions are handled through service-layer logic, keeping controllers thin and focused on request handling.

## License

ISC
