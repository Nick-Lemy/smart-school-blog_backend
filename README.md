# 📘 API Documentation

This is the API documentation for the Smart School Blog backend that supports user registration, login with JWT, and authenticated user management.

---

## 🔐 Authentication

### POST `/auth/register`

Register a new user.

- **Request Body:**

```json
{
  "email": "user@example.com",
  "password": "yourPassword123",
  "name": "John Doe"
}
```

- **Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "password": "$2b$10$hashedPassword"
}
```

### POST `/auth/login`

Login and get an access token.

- **Request Body:**

```json
{
  "email": "user@example.com",
  "password": "yourPassword123"
}
```

- **Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

## 👤 Users

### POST `/users`

Create a user manually (admin use or testing).

- **Request Body:**

```json
{
  "email": "another@example.com",
  "password": "pass123",
  "name": "Jane Doe"
}
```

- **Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "password": "$2b$10$hashedPassword"
}
```

### GET `/users`

Get a list of all users.
_Requires JWT token_

- **Response:**

```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
]
```

### GET `/users/me`

Get the profile of the currently authenticated user.
_Requires JWT token_

- **Response:**

```json
{
  "userId": 1,
  "email": "user@example.com"
}
```

### GET `/users/:id`

Get one user by ID.
_Requires JWT token_

- **Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe"
}
```

### PATCH `/users/me`

Update the currently authenticated user's info.
_Requires JWT token_

- **Request Body:**

```json
{
  "name": "Johnny Updated"
}
```

- **Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Johnny Updated"
}
```

## Authorization Header

For all protected routes, set the header:

```yml
Authorization: Bearer <access_token>
```
