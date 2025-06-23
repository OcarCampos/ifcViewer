# IFC Annotation Web App - API Documentation

## Base URL
All API endpoints are relative to `/api/`

## Authentication
All API endpoints (except login/register) require an active PHP session. The session cookie will be automatically handled by the browser.

### Headers
```
Content-Type: application/json
```

### Session Security
- Uses secure, HTTP-only cookies
- SameSite=Lax policy
- Secure flag enabled (HTTPS only)
- Session timeout: 2 hours of inactivity

## Endpoints

### Authentication

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "annotator"
}
```

**Response (201 Created):**
```json
{
  "id": 123,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "annotator",
  "created_at": "2023-01-01T00:00:00Z"
}
```

#### POST /api/auth/login
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": 123,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "annotator"
  }
}
```

A session cookie will be set automatically with these attributes:
- HttpOnly: true
- Secure: true
- SameSite: Lax
- Path: /

### Users (Admin Only)

#### GET /api/users
Get all users (admin only).

**Response (200 OK):**
```json
[
  {
    "id": 123,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "annotator",
    "is_active": true,
    "created_at": "2023-01-01T00:00:00Z"
  }
]
```

#### PUT /api/users/:id
Update a user (admin only).

**Request Body:**
```json
{
  "name": "John Updated",
  "role": "admin",
  "is_active": true
}
```

**Response (200 OK):**
```json
{
  "id": 123,
  "email": "user@example.com",
  "name": "John Updated",
  "role": "admin",
  "is_active": true,
  "created_at": "2023-01-01T00:00:00Z"
}
```

### Profile

#### GET /api/profile
Get current user's profile.

**Response (200 OK):**
```json
{
  "id": 123,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "annotator",
  "created_at": "2023-01-01T00:00:00Z"
}
```

#### PUT /api/profile
Update current user's profile.

**Request Body:**
```json
{
  "name": "John Updated",
  "current_password": "oldPassword123",
  "new_password": "newSecurePassword456"
}
```

**Response (200 OK):**
```json
{
  "id": 123,
  "email": "user@example.com",
  "name": "John Updated",
  "role": "annotator",
  "created_at": "2023-01-01T00:00:00Z"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": {
    "email": ["The email field is required."]
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "The requested resource was not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting
- 100 requests per minute per IP address for authentication endpoints
- 1000 requests per minute per IP address for other endpoints

## Security
- All endpoints use HTTPS
- Passwords are hashed using bcrypt (PHP's `password_hash` with PASSWORD_BCRYPT)
- Session configuration:
  - `session.cookie_httponly = 1`
  - `session.cookie_secure = 1`
  - `session.cookie_samesite = "Lax"`
  - `session.use_strict_mode = 1`
  - `session.gc_maxlifetime = 7200` (2 hours)
  - `session.cookie_lifetime = 0` (until browser closes)
