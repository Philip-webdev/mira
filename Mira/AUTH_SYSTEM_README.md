# Mira Authentication System - Complete Implementation Guide

## Overview

This is a modern, production-ready authentication system for the Mira payment platform with support for three user roles:
- **Students** - Pay fees and manage transactions
- **Merchants/Partners** - Manage business operations  
- **Admins** - Institutional administration

## Features

### 🔐 Security
- JWT-based authentication with refresh tokens
- Bcrypt password hashing (10+ rounds)
- Email verification with OTP
- Secure password reset workflow
- Rate limiting and CORS protection
- Role-based access control (RBAC)

### 🎨 UI/UX
- Modern glassmorphism design
- Smooth Framer Motion animations
- Multi-step signup wizard
- Real-time form validation
- Dark mode gradient backgrounds
- Responsive mobile-first design

### ⚡ Performance
- Lazy loading components
- Optimized animations with GPU acceleration
- Efficient state management with Context API
- Token auto-refresh mechanism

### 📱 Responsive
- Desktop, tablet, and mobile support
- Touch-friendly interfaces
- Adaptive layouts

---

## File Structure

```
src/
├── context/
│   └── AuthContext.tsx                 # Auth state management
├── pages/
│   ├── Login.tsx                       # Login page with animations
│   ├── Signup.tsx                      # Multi-step signup form
│   ├── ForgotPassword.tsx              # Password recovery
│   ├── VerifyEmail.tsx                 # Email verification
│   ├── ResetPassword.tsx               # Password reset
│   └── Unauthorized.tsx                # 403 error page
├── components/
│   └── ProtectedRoute.tsx              # Route protection wrapper
└── App.tsx                             # Updated with auth routes

Documentation/
├── API_DOCUMENTATION.md                # Complete API endpoints
└── BACKEND_SETUP_GUIDE.md              # Node.js/Express setup
```

---

## Getting Started

### 1. Frontend Setup

The authentication components are already created. Just ensure you have these dependencies:

```bash
npm install framer-motion input-otp axios react-router-dom
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000
```

For production:
```env
VITE_API_URL=https://api.yourdomain.com
```

### 3. Backend Setup

Follow the `BACKEND_SETUP_GUIDE.md` to set up your Node.js/Express backend:

```bash
# In backend folder
npm install
npm run dev
```

---

## Usage Examples

### Using Authentication Hook

```typescript
import { useAuth } from '@/context/AuthContext';

function Dashboard() {
  const { user, logout, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected Routes

```typescript
import ProtectedRoute from '@/components/ProtectedRoute';

<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute requiredRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/merchant/payments"
  element={
    <ProtectedRoute requiredRoles={['merchant', 'admin']}>
      <MerchantDashboard />
    </ProtectedRoute>
  }
/>
```

### Form Handling with Validation

All authentication pages include:
- Real-time form validation
- Error messages
- Loading states
- Accessibility features
- Mobile optimization

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

See `API_DOCUMENTATION.md` for detailed endpoint specifications.

---

## Authentication Flow

### Sign Up Flow
```
User enters account type
    ↓
Enters email & password
    ↓
Enters phone & institution/business info
    ↓
Account created
    ↓
Verification email sent
    ↓
User verifies email with OTP
    ↓
Access granted to main app
```

### Login Flow
```
User enters email & password
    ↓
Backend validates credentials
    ↓
Check if email verified
    ↓
Generate JWT token
    ↓
Store token in localStorage
    ↓
Redirect to home page
```

### Password Reset Flow
```
User requests password reset
    ↓
Email sent with reset link
    ↓
User clicks link with token
    ↓
User enters new password
    ↓
Password updated
    ↓
Redirect to login
```

---

## Styling & Customization

### Color Scheme

The default theme uses:
- Primary: `#04ADB7` (Cyan)
- Secondary: `#0B5E78` (Teal)
- Dark: `#051B2B` (Navy)

To change colors, update:
1. Tailwind color values in `tailwind.config.ts`
2. CSS classes in component files

### Animations

All animations use Framer Motion with:
- Smooth easing functions
- Staggered children animations
- Hover and tap interactions
- GPU-accelerated transforms

Customize by modifying `variants` objects in component files.

---

## Error Handling

The system handles:
- Invalid credentials
- Email already registered
- Unverified accounts
- Expired tokens
- Weak passwords
- Network errors
- Server errors

All errors display user-friendly messages via toast notifications.

---

## Security Best Practices Implemented

1. **Password Security**
   - Minimum 8 characters
   - Bcrypt hashing with 10+ rounds
   - Password confirmation on signup
   - Secure reset tokens (1-hour expiry)

2. **Token Management**
   - JWT with 7-day expiry
   - Refresh tokens with 30-day expiry
   - Auto-refresh on app load
   - Secure localStorage storage

3. **Email Verification**
   - OTP-based verification
   - 24-hour token expiry
   - Resend capability with cooldown

4. **API Security**
   - CORS configuration
   - Rate limiting (5-100 requests/minute)
   - Input validation with Joi
   - Helmet.js security headers

5. **Access Control**
   - Role-based route protection
   - Admin-only endpoints
   - User permission checks
   - Unauthorized access handling

---

## Testing

### Manual Testing

1. **Sign Up**
   - Test with valid/invalid emails
   - Test password validation
   - Verify email functionality
   - Test role selection

2. **Login**
   - Valid credentials
   - Invalid email/password
   - Unverified email
   - Token refresh

3. **Password Reset**
   - Request reset
   - Invalid email
   - Token expiry
   - Password update

### Automated Testing (Coming Soon)

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

---

## Troubleshooting

### Issue: "API connection failed"
- Check backend is running on correct port
- Verify `VITE_API_URL` environment variable
- Check CORS configuration in backend

### Issue: "Email verification not received"
- Check email credentials in backend `.env`
- Verify Gmail App Password is correct
- Check spam folder
- Resend button with cooldown

### Issue: "Token expired"
- Clear localStorage and reload
- Token auto-refresh should handle this
- Check JWT_EXPIRY in backend

### Issue: "Protected route redirects to login"
- Verify token is stored in localStorage
- Check token is valid (not expired)
- Verify user role matches required role

---

## Production Deployment

### Frontend
1. Set `VITE_API_URL` to production API
2. Build with `npm run build`
3. Deploy to Vercel/Netlify
4. Enable HTTPS
5. Configure domain

### Backend
1. Use strong `JWT_SECRET` (32+ characters)
2. Set `NODE_ENV=production`
3. Enable HTTPS/TLS
4. Configure database backups
5. Set up monitoring and logging
6. Enable rate limiting
7. Use environment variables for secrets
8. Enable CORS only for frontend domain

---

## Performance Optimization

### Frontend
- Code splitting with lazy loading
- Image optimization
- CSS minification
- JavaScript bundle optimization
- Service Worker for offline capability

### Backend
- Database indexing
- Query optimization
- Redis caching (optional)
- Load balancing
- CDN for static assets

---

## Support & Documentation

For detailed information, see:
- `API_DOCUMENTATION.md` - API endpoint details
- `BACKEND_SETUP_GUIDE.md` - Backend implementation
- Component files - Code comments and examples

---

## Future Enhancements

- [ ] OAuth 2.0 (Google, GitHub, Microsoft)
- [ ] Two-factor authentication (2FA)
- [ ] Biometric authentication
- [ ] Session management
- [ ] Login history and device tracking
- [ ] Social login
- [ ] Passwordless authentication
- [ ] WebAuthn/FIDO2 support

---

## License

This authentication system is part of the Mira project and follows the same license terms.

---

## Contact & Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Contact the development team

---

**Last Updated:** July 5, 2026
**Version:** 1.0.0
**Status:** Production Ready
