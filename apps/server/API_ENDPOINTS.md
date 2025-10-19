# API Endpoints Documentation

## 🔐 Authentication Endpoints

### POST /auth/register

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "Registration successful"
}
```

### POST /auth/login

Login with email and password.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt-token-here",
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "message": "Login successful"
}
```

### GET /auth/profile

Get current user profile (requires authentication).

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "Profile retrieved successfully"
}
```

## 👥 User Endpoints

### GET /users/:id

Get user by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🔧 Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Email is required"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### 409 Conflict

```json
{
  "success": false,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "User not found",
  "error": "Not Found"
}
```

## 🚀 Usage Examples

### 1. Register a new user

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Get profile (with JWT token)

```bash
curl -X GET http://localhost:5000/auth/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

## 🔒 Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: All inputs are validated using class-validator
- **Error Handling**: Comprehensive error handling with proper HTTP status codes

## 📝 Notes

- JWT tokens expire after 7 days by default
- Passwords must be at least 6 characters long
- Email addresses must be valid format
- All endpoints return consistent response format
