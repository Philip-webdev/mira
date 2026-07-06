# Mira Authentication & Authorization API Documentation

## Base URL
```
http://localhost:3000/api
```

## Environment Variables Required

Create a `.env` file in your backend with:
```env
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d
DATABASE_URL=your_database_url
MAIL_SERVICE=gmail
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

---

## Authentication Endpoints

### 1. **User Registration**
**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!",
  "name": "John Doe",
  "role": "student",
  "phone": "+234XXXXXXXXXX",
  "institution": "University of Lagos",
  "businessName": null,
  "businessCategory": null
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully. Please verify your email.",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student",
    "phone": "+234XXXXXXXXXX",
    "institution": "University of Lagos",
    "verificationStatus": "pending",
    "createdAt": "2026-07-05T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Invalid input / Email already exists
- `422`: Validation error
- `500`: Server error

---

### 2. **User Login**
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student",
    "phone": "+234XXXXXXXXXX",
    "institution": "University of Lagos",
    "verificationStatus": "verified",
    "avatar": "https://..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401`: Invalid credentials
- `403`: Account not verified
- `404`: User not found
- `500`: Server error

---

### 3. **Verify Email**
**Endpoint:** `POST /auth/verify-email`

**Request Body:**
```json
{
  "token": "123456" // 6-digit OTP or token
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "verificationStatus": "verified"
  }
}
```

---

### 4. **Resend Verification Email**
**Endpoint:** `POST /auth/resend-verification`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Verification email sent successfully"
}
```

---

### 5. **Request Password Reset**
**Endpoint:** `POST /auth/request-password-reset`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

---

### 6. **Reset Password**
**Endpoint:** `POST /auth/reset-password`

**Request Body:**
```json
{
  "email": "user@example.com",
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### 7. **Refresh Token**
**Endpoint:** `POST /auth/refresh`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "token": "new_jwt_token_here",
  "refreshToken": "new_refresh_token_here"
}
```

---

### 8. **Get Current User Profile**
**Endpoint:** `GET /auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student",
    "phone": "+234XXXXXXXXXX",
    "institution": "University of Lagos",
    "verificationStatus": "verified",
    "avatar": "https://...",
    "createdAt": "2026-07-05T10:00:00Z"
  }
}
```

---

### 9. **Update User Profile**
**Endpoint:** `PUT /auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "+234YYYYYYYYYY",
  "avatar": "https://avatar-url.com/image.jpg",
  "institution": "University of Lagos (Updated)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe Updated",
    "phone": "+234YYYYYYYYYY",
    "avatar": "https://avatar-url.com/image.jpg",
    "role": "student"
  }
}
```

---

### 10. **Logout**
**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## User Role Types

### Student Role
- Permissions: Pay fees, view receipts, manage personal account
- Required Fields: `institution`

### Merchant/Partner Role
- Permissions: Manage payments, view analytics, manage business profile
- Required Fields: `businessName`, `businessCategory`

### Admin Role
- Permissions: Full access, manage all users, analytics, system configuration
- Required Fields: Full institutional access

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes:
- `INVALID_CREDENTIALS`: Wrong email/password
- `EMAIL_NOT_VERIFIED`: Email needs verification
- `TOKEN_EXPIRED`: JWT token expired
- `INVALID_TOKEN`: Malformed JWT
- `USER_NOT_FOUND`: User doesn't exist
- `EMAIL_ALREADY_EXISTS`: Email is registered
- `WEAK_PASSWORD`: Password doesn't meet requirements
- `UNAUTHORIZED`: Missing/invalid authorization header
- `FORBIDDEN`: Insufficient permissions
- `VALIDATION_ERROR`: Input validation failed
- `INTERNAL_ERROR`: Server error

---

## Security Features Implemented

1. **JWT Authentication** - Secure token-based auth
2. **Password Hashing** - bcrypt encryption (min 10 rounds)
3. **Email Verification** - OTP-based email confirmation
4. **Password Reset** - Secure token-based reset links
5. **CORS** - Cross-origin resource sharing protection
6. **Rate Limiting** - API endpoint rate limiting
7. **Role-Based Access Control** - Permission management
8. **Refresh Token Rotation** - Secure token refresh mechanism

---

## Frontend Usage Examples

### Using the AuthContext Hook

```typescript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123');
      // User logged in, redirect handled automatically
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Protected Route Usage

```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute requiredRoles={['admin', 'merchant']}>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## Testing Endpoints with cURL

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!",
    "confirmPassword": "Test123456!",
    "name": "Test User",
    "role": "student",
    "phone": "+234XXXXXXXXXX"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!"
  }'

# Get Profile (requires token)
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Additional Notes

1. **Token Storage**: Tokens are stored in localStorage as `mira_token` and user data as `mira_user`
2. **Token Refresh**: Automatic token refresh happens on app initialization
3. **Session Expiry**: Sessions expire based on JWT_EXPIRY (default 7 days)
4. **Password Requirements**:
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one number
   - At least one special character

5. **Email Verification**: Users must verify email before accessing certain features
6. **Rate Limiting**: 5 requests per minute per endpoint
