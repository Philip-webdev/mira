# 🚀 Quick Start Guide - Mira Authentication

## 5-Minute Setup

### Step 1: Frontend is Already Ready ✅
All authentication pages are created and integrated. No additional frontend setup needed!

### Step 2: Set Environment Variable
Create/update `.env` in your project root:
```env
VITE_API_URL=http://localhost:3000
```

### Step 3: Start Your Backend

Copy and create a minimal Express backend:

```bash
# Create backend folder
mkdir mira-api && cd mira-api

# Initialize
npm init -y

# Install dependencies
npm install express cors dotenv bcryptjs jsonwebtoken mongoose nodemailer axios
npm install --save-dev typescript ts-node @types/express @types/node

# Create src folder
mkdir src

# Copy server code from BACKEND_SETUP_GUIDE.md
```

Create `src/server.ts`:
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Placeholder auth routes (implement full endpoints from BACKEND_SETUP_GUIDE.md)
app.post('/api/auth/signup', (req, res) => {
  res.json({ success: true, token: 'sample_token' });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ 
    success: true, 
    token: 'sample_token',
    user: { id: '1', email: 'user@example.com', name: 'User' }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

Create `.env`:
```env
PORT=3000
JWT_SECRET=your_secret_key_here
```

### Step 4: Run Both
```bash
# Terminal 1 - Backend
cd mira-api
npx ts-node src/server.ts

# Terminal 2 - Frontend
npm run dev
```

### Step 5: Test
Open `http://localhost:5173/login`

---

## Available Routes

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/forgot-password` - Password recovery
- `/verify-email` - Email verification
- `/reset-password` - Reset password
- `/unauthorized` - Access denied

### Protected Routes (Login Required)
- `/home` - Main dashboard
- `/admin/*` - Admin panel
- `/receipts` - Receipts page
- `/food` - Food page
- `/tickets` - Tickets page

---

## Test the System

### 1. Sign Up
1. Go to `http://localhost:5173/signup`
2. Select user type (Student, Merchant, or Admin)
3. Enter details
4. Account created!

### 2. Login
1. Use credentials from signup
2. Verify email (OTP validation skippable in dev)
3. Access dashboard at `/home`

### 3. Protected Routes
Try accessing `/home` without login - redirects to `/login`

---

## Available Authentication Methods

```typescript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const {
    user,              // Current user object
    isAuthenticated,   // Boolean
    loading,           // Boolean
    login,             // (email, password) => Promise
    signup,            // (data) => Promise
    logout,            // () => void
    updateProfile,     // (data) => Promise
    verifyEmail,       // (token) => Promise
    resetPassword,     // (email, token, password) => Promise
    requestPasswordReset,  // (email) => Promise
    resendVerification     // (email) => Promise
  } = useAuth();

  return <div>Use these methods in your components</div>;
}
```

---

## Complete Backend Implementation

For full implementation with database, email, validation etc., follow:
👉 **[BACKEND_SETUP_GUIDE.md](BACKEND_SETUP_GUIDE.md)**

---

## Styling Customization

All components use Tailwind CSS. To customize:

1. **Colors** - Edit class names in component files
   - Primary: `from-cyan-400 to-teal-400`
   - Dark: `from-[#04ADB7]`

2. **Animations** - Modify Framer Motion `variants`

3. **Typography** - Change text classes

Example:
```tsx
// Change primary color
className="bg-gradient-to-r from-cyan-400 to-teal-400"
// To your color
className="bg-gradient-to-r from-blue-400 to-purple-400"
```

---

## Troubleshooting

### "Cannot find module '@/context/AuthContext'"
- Ensure all files are created in correct paths
- Check `tsconfig.json` has path aliases configured

### "API not responding"
- Verify backend is running on port 3000
- Check `VITE_API_URL` env variable
- Check backend CORS is enabled

### "Token not persisting"
- Tokens stored in `localStorage` as `mira_token`
- Check browser DevTools > Application > LocalStorage
- Verify no private browsing mode

### Form validation errors
- Check email format (must have @)
- Password must be 8+ characters
- Phone must be valid format

---

## Production Checklist

- [ ] Set `VITE_API_URL` to production backend
- [ ] Configure backend JWT_SECRET to strong value
- [ ] Enable HTTPS/SSL
- [ ] Set up database with proper backups
- [ ] Configure email service
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Configure CORS for production domain
- [ ] Test all authentication flows
- [ ] Implement refresh token rotation
- [ ] Set up error logging
- [ ] Test role-based access

---

## Key Files to Modify for Customization

1. **Components**
   - `src/pages/Login.tsx` - Login page
   - `src/pages/Signup.tsx` - Registration
   - `src/context/AuthContext.tsx` - Auth logic

2. **Configuration**
   - `.env` - API URL
   - `tailwind.config.ts` - Colors and theme

3. **Routing**
   - `src/App.tsx` - Routes and layout

---

## Documentation Files

- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - All endpoints
- **[BACKEND_SETUP_GUIDE.md](BACKEND_SETUP_GUIDE.md)** - Full backend code
- **[AUTH_SYSTEM_README.md](AUTH_SYSTEM_README.md)** - Comprehensive guide
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What was built

---

## Support

For detailed information on any topic:
1. Check the documentation files
2. Review code comments in component files
3. Check BACKEND_SETUP_GUIDE.md for backend issues
4. Verify environment variables are set correctly

---

## What's Included

✅ Login page with animations
✅ 3-step signup wizard
✅ Email verification with OTP
✅ Password reset workflow
✅ Protected routes with role-based access
✅ User profile management
✅ Modern UI with Framer Motion
✅ Responsive design
✅ Form validation
✅ Error handling
✅ JWT authentication
✅ Complete backend guide
✅ API documentation

---

## Next: Implement Backend

👉 **Follow [BACKEND_SETUP_GUIDE.md](BACKEND_SETUP_GUIDE.md)** for complete backend implementation with:
- MongoDB setup
- User schema
- All auth endpoints
- Email service
- Password hashing
- Token generation
- Error handling

---

**You're ready to go! 🎉**

Start by running:
```bash
npm run dev
```

Then navigate to `http://localhost:5173/login`
