# Backend Implementation Guide - Node.js/Express

## Setup Instructions

### 1. Install Dependencies

```bash
npm install express axios bcryptjs jsonwebtoken dotenv cors mongoose nodemailer joi helmet express-rate-limit
npm install --save-dev typescript ts-node @types/express @types/node
```

### 2. Create Directory Structure

```
backend/
├── src/
│   ├── models/
│   │   └── User.ts
│   ├── controllers/
│   │   └── authController.ts
│   ├── routes/
│   │   └── auth.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── validation.ts
│   ├── utils/
│   │   ├── emailService.ts
│   │   └── tokenService.ts
│   ├── config/
│   │   └── database.ts
│   └── server.ts
├── .env
├── .env.example
└── package.json
```

---

## 3. Configuration Files

### .env.example
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/mira
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

---

## 4. Code Examples

### models/User.ts
```typescript
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'student' | 'merchant' | 'admin';
  institution?: string;
  businessName?: string;
  businessCategory?: string;
  avatar?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
  generateVerificationToken(): string;
  generatePasswordResetToken(): string;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: 'Invalid email format',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'merchant', 'admin'],
      default: 'student',
    },
    institution: String,
    businessName: String,
    businessCategory: String,
    avatar: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verificationToken: String,
    verificationTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

// Method to generate verification token
UserSchema.methods.generateVerificationToken = function () {
  const token = Math.random().toString().slice(2, 8); // 6-digit OTP
  this.verificationToken = token;
  this.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return token;
};

// Method to generate password reset token
UserSchema.methods.generatePasswordResetToken = function () {
  const token = require('crypto').randomBytes(32).toString('hex');
  this.resetPasswordToken = token;
  this.resetPasswordTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  return token;
};

export default mongoose.model<IUser>('User', UserSchema);
```

### controllers/authController.ts
```typescript
import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/tokenService';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService';
import { validateSignup, validateLogin } from '../middleware/validation';

interface AuthRequest extends Request {
  user?: any;
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword, name, role, phone, institution, businessName, businessCategory } = req.body;

    // Validate input
    const { error } = validateSignup(req.body);
    if (error) {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        details: error.details,
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Create new user
    user = new User({
      email,
      password,
      name,
      role,
      phone,
      institution,
      businessName,
      businessCategory,
    });

    // Generate verification token
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, user.name, verificationToken);

    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please verify your email.',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        institution: user.institution,
        verificationStatus: user.verificationStatus,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        details: error.details,
      });
    }

    // Find user and select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if email is verified
    if (user.verificationStatus !== 'verified') {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email first',
        code: 'EMAIL_NOT_VERIFIED',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        institution: user.institution,
        verificationStatus: user.verificationStatus,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token required',
      });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    user.verificationStatus = 'verified';
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user._id,
        email: user.email,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification',
    });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists
      return res.json({
        success: true,
        message: 'Password reset link sent to your email',
      });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(user.email, user.name, resetToken);

    res.json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset request',
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, token, and new password are required',
      });
    }

    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset',
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        institution: user.institution,
        businessName: user.businessName,
        verificationStatus: user.verificationStatus,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, avatar, institution, businessName } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
        ...(institution && { institution }),
        ...(businessName && { businessName }),
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        institution: user.institution,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
    });
  }
};
```

### utils/tokenService.ts
```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

export const generateToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; role: string };
  } catch (error) {
    return null;
  }
};
```

### utils/emailService.ts
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (email: string, name: string, token: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification - Mira',
    html: `
      <h2>Welcome to Mira, ${name}!</h2>
      <p>Please verify your email address by entering this code:</p>
      <h3 style="color: #04ADB7; letter-spacing: 2px;">${token}</h3>
      <p>This code will expire in 24 hours.</p>
      <p>If you didn't create this account, please ignore this email.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email: string, name: string, token: string) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?email=${email}&token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset - Mira',
    html: `
      <h2>Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>You requested to reset your password. Click the link below:</p>
      <a href="${resetLink}" style="background-color: #04ADB7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};
```

### middleware/auth.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/tokenService';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required',
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        code: 'TOKEN_EXPIRED',
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        code: 'FORBIDDEN',
      });
    }
    next();
  };
};
```

### server.ts
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### routes/auth.ts
```typescript
import express from 'express';
import {
  signup,
  login,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  getProfile,
  updateProfile,
} from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

export default router;
```

---

## Testing with Postman/Thunder Client

Import this collection:

```json
{
  "info": {
    "name": "Mira Auth API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Sign Up",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/api/auth/signup",
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"test@example.com\", \"password\": \"Test123456!\", \"confirmPassword\": \"Test123456!\", \"name\": \"Test User\", \"role\": \"student\", \"phone\": \"+234XXXXXXXXXX\"}"
        }
      }
    }
  ]
}
```

---

## Notes

1. Update `CORS_ORIGIN` and `FRONTEND_URL` in `.env` for production
2. Use strong `JWT_SECRET` in production
3. Configure MongoDB connection properly
4. Set up Gmail App Passwords for email service
5. Implement rate limiting properly for production
6. Add request logging for debugging
