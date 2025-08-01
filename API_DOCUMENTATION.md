# Smart School Blog Backend API Documentation

Complete API documentation for the Smart School Blog backend - a NestJS application with JWT authentication, posts, comments, events, and user management.

---

## Authentication Endpoints

### POST `/auth/register`

Register a new user.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "yourPassword123",
  "role": "student",
  "languagePreference": "Eng",
  "isVerified": false
}
```

**Validation:**

- All fields required
- `email` must be valid email format
- `languagePreference` must be "Fr" or "Eng"

**Response:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "role": "student",
  "languagePreference": "Eng",
  "isVerified": false,
  "createdAt": "2025-07-31T10:00:00.000Z"
}
```

### POST `/auth/login`

Login and get JWT access token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "yourPassword123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## User Endpoints

### POST `/users`

Create a new user (alternative to register).

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "yourPassword123",
  "role": "student",
  "languagePreference": "Eng"
}
```

**Note:** The `isVerified` field is not required for user creation (only for registration)

### GET `/users`

Get all users.
_Requires JWT token_

**Response:**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "student",
    "languagePreference": "Eng",
    "isVerified": false,
    "createdAt": "2025-07-31T10:00:00.000Z"
  }
]
```

### GET `/users/me`

Get current user profile.
_Requires JWT token_

**Response:**

```json
{
  "userId": 1,
  "email": "user@example.com"
}
```

### GET `/users/:id`

Get user by ID.
_Requires JWT token_

**URL Parameters:**

- `id` (number) - User ID

### PATCH `/users/me`

Update current user profile.
_Requires JWT token_

**Request Body (all optional):**

```json
{
  "name": "Johnny Updated",
  "email": "newemail@example.com",
  "role": "teacher",
  "languagePreference": "Fr",
  "isVerified": true
}
```

### PATCH `/users/:id`

Update any user profile (Admin only).
_Requires JWT token_

**URL Parameters:**

- `id` (number) - User ID

**Request Body (all optional):**

```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "teacher",
  "languagePreference": "Fr",
  "isVerified": true
}
```

**Conditions:**

- User must exist (404 if not found)
- User must have admin privileges (`isVerified: true`) OR be updating their own profile

### DELETE `/users/:id`

Delete a user account.
_Requires JWT token_

**URL Parameters:**

- `id` (number) - User ID

**Conditions:**

- User must exist (404 if not found)
- User must have admin privileges (`isVerified: true`) OR be deleting their own account

---

## Post Endpoints

### POST `/posts`

Create a new post.
_Requires JWT token_

**Request Body:**

```json
{
  "title": "My First Post",
  "content": "This is the content of my post..."
}
```

**Validation:**

- Both fields required and non-empty

### GET `/posts`

Get all posts.

**Response:**

```json
[
  {
    "id": 1,
    "title": "My First Post",
    "content": "This is the content...",
    "likes": [2, 3, 5],
    "authorId": 1,
    "aiSummary": "AI-generated summary of the post...",
    "createdAt": "2025-07-31T10:00:00.000Z",
    "author": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com"
    }
  }
]
```

### GET `/posts/user/:authorId`

Get posts by specific author.

**URL Parameters:**

- `authorId` (number) - Author's user ID

### GET `/posts/:id`

Get single post by ID.

**URL Parameters:**

- `id` (number) - Post ID

### PATCH `/posts/:id`

Update a post.
_Requires JWT token_

**URL Parameters:**

- `id` (number) - Post ID

**Request Body (both optional):**

```json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

**Conditions:**

- Post must exist (404 if not found)
- User must be the post author (403 if not owner)

### DELETE `/posts/:id`

Delete a post.
_Requires JWT token_

**URL Parameters:**

- `id` (number) - Post ID

**Conditions:**

- Post must exist (404 if not found)
- User must be the post author OR have admin privileges (`isVerified: true`)

### POST `/posts/like/:id`

Like/unlike a post.
_Requires JWT token_

**URL Parameters:**

- `id` (number) - Post ID

### GET `/posts/:id/summary`

Get AI-generated summary for a post.

**URL Parameters:**

- `id` (number) - Post ID

**Response:**

```json
{
  "content": "AI-generated summary of the post content..."
}
```

**Conditions:**

- Post must exist (404 if not found)
- If post doesn't have an AI summary, one will be generated automatically

---

## Comment Endpoints

### POST `/comment`

Create a comment on a post.
_Requires JWT token_

**Request Body:**

```json
{
  "content": "Great post!",
  "postId": 1
}
```

**Validation:**

- Both fields required

### GET `/comment/post/:postId`

Get all comments for a specific post.

**URL Parameters:**

- `postId` (number) - Post ID

**Response:**

```json
[
  {
    "id": 1,
    "content": "Great post!",
    "postId": 1,
    "authorId": 2,
    "createdAt": "2025-07-31T10:30:00.000Z",
    "author": {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  }
]
```

### DELETE `/comment/:id`

Delete a comment.
_Requires JWT token_

**URL Parameters:**

- `id` (number) - Comment ID

**Conditions:**

- Comment must exist (404 if not found)
- User must be the comment author (403 if not owner)

---

## Event Endpoints

### POST `/event`

Create a new event.
_Requires JWT token_

**Request Body:**

```json
{
  "title": "School Science Fair",
  "category": "Academic",
  "location": "Main Auditorium",
  "coverImage": "https://example.com/image.jpg",
  "description": "Annual science fair event...",
  "startDate": "2025-08-15T09:00:00.000Z",
  "endDate": "2025-08-15T17:00:00.000Z"
}
```

**Validation:**

- All fields are required and non-empty
- Dates must be in ISO format

### GET `/event`

Get all events.
_Requires JWT token_

**Response:**

```json
[
  {
    "id": 1,
    "title": "School Science Fair",
    "category": "Academic",
    "description": "Annual science fair event...",
    "location": "Main Auditorium",
    "coverImage": "https://example.com/image.jpg",
    "startDate": "2025-08-15T09:00:00.000Z",
    "endDate": "2025-08-15T17:00:00.000Z",
    "attendees": [2, 3, 5],
    "hostId": 1,
    "createdAt": "2025-07-31T10:00:00.000Z",
    "host": {
      "id": 1,
      "name": "John Doe"
    }
  }
]
```

### GET `/event/:id`

Get single event by ID.
_Requires JWT token_

**URL Parameters:**

- `id` (number) - Event ID

### GET `/event/user/:hostId`

Get events by specific host.
_Requires JWT token_

**URL Parameters:**

- `hostId` (number) - Host's user ID

### GET `/event/category?category=:category`

Get events by category.
_Requires JWT token_

**Query Parameters:**

- `category` (string) - Event category

**Example:** `/event/category?category=Academic`

### POST `/event/register/:id`

Register for an event.
_Requires JWT token_

**URL Parameters:**

- `id` (number) - Event ID

### DELETE `/event/:id`

Delete an event.
_Requires JWT token_

**URL Parameters:**

- `id` (number) - Event ID

**Conditions:**

- Event must exist (404 if not found)
- User must be the event host OR have admin privileges (`isVerified: true`)

---

## General Endpoints

### GET `/`

Health check endpoint.

**Response:**

```json
"Hello World!"
```

---

## Authentication

For all protected routes, include the JWT token in the Authorization header:

```yaml
Authorization: Bearer <your_jwt_token>
```

### Admin Privileges

Users with `isVerified: true` have admin privileges and can:

- Delete any post (not just their own)
- Delete any event (not just their own)
- Update any user profile
- Delete any user account
- Access admin-only features

## Data Models

### User

- `id`: number (auto-increment)
- `name`: string
- `email`: string (unique)
- `password`: string (hashed)
- `role`: string
- `languagePreference`: "Fr" | "Eng"
- `isVerified`: boolean
- `createdAt`: DateTime

### Post

- `id`: number (auto-increment)
- `title`: string
- `content`: string
- `likes`: number[] (array of user IDs)
- `authorId`: number (foreign key)
- `aiSummary`: string (AI-generated summary)
- `createdAt`: DateTime

### Comment

- `id`: number (auto-increment)
- `content`: string
- `postId`: number (foreign key)
- `authorId`: number (foreign key)
- `createdAt`: DateTime

### Event

- `id`: number (auto-increment)
- `title`: string
- `category`: string
- `description`: string
- `location`: string
- `coverImage`: string
- `startDate`: DateTime
- `endDate`: DateTime
- `attendees`: number[] (array of user IDs)
- `hostId`: number (foreign key)
- `createdAt`: DateTime

---

## Error Handling

- **400 Bad Request**: Invalid request body or validation errors
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: User doesn't have permission for this action
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error
