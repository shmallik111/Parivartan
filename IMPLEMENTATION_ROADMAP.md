# TechLeadHers - Implementation Roadmap & Task Breakdown

## 🚀 Immediate Actions (This Week)

### Task List - Quick Wins

#### 1. Create Environment Configuration Files
**Time**: 10 minutes
**Files to Create**:
- `backend/.env.example`
- `backend/.env` (local development)
- `Parivartan-Frontend/.env.example`

```
BACKEND/.ENV.EXAMPLE:
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/techleadhers_db
# OR individual params:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=techleadhers_db
DB_USER=postgres
DB_PASSWORD=password
DB_SSL=false

JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:19000,http://localhost:3000
FRONTEND_URL=http://localhost:19000

# Email Service (for password reset, verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@techleadhers.com

NODE_ENV=development
LOG_LEVEL=debug
```

---

#### 2. Add Missing Admin Role Assignment
**Time**: 30 minutes
**Files to Modify**: `backend/controllers/authController.js`
**Task**:
- Add `/api/auth/promote-admin/:userId` endpoint (super-admin only)
- Add permission check for super-admin role
- Create first admin via database seed script

```javascript
// Add to authController.js
const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Only super-admin can promote
    if (req.user.role !== 'super-admin') {
      return res.status(403).json({ error: 'Super admin access required' });
    }

    const result = await db.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, role',
      ['admin', userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User promoted to admin', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to promote user' });
  }
};
```

---

#### 3. Add Security Headers with Helmet
**Time**: 10 minutes
**File**: `backend/index.js`
**Task**: Add helmet middleware
```javascript
const helmet = require('helmet');
app.use(helmet());
```
Install: `npm install helmet`

---

#### 4. Create Constants File
**Time**: 15 minutes
**File**: `backend/config/constants.js`
```javascript
module.exports = {
  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super-admin',
  },
  JWT: {
    EXPIRE: process.env.JWT_EXPIRE || '7d',
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_NUMBER: true,
  },
  API: {
    MAX_PAGE_SIZE: 100,
    DEFAULT_PAGE_SIZE: 20,
  },
};
```

---

#### 5. Add Rate Limiting
**Time**: 15 minutes
**Files**: `backend/index.js`, `backend/middleware/rateLimit.js`
**Task**: Protect auth endpoints from brute force

```javascript
// Install: npm install express-rate-limit
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 attempts
  message: 'Too many login attempts, please try again later'
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: 'Too many signup attempts from this IP'
});

// Apply to routes
router.post('/login', loginLimiter, authController.login);
router.post('/signup', signupLimiter, validateSignup, authController.signup);
```

---

#### 6. Standardize API Response Format
**Time**: 20 minutes
**File**: `backend/utils/response.js` (NEW)
**Task**: Create consistent response wrapper

```javascript
// utils/response.js
const sendSuccess = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

const sendError = (res, statusCode, message, error = null) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  res.status(statusCode).json({
    success: false,
    message,
    ...(isDevelopment && error && { error: error.message }),
    timestamp: new Date().toISOString(),
  });
};

module.exports = { sendSuccess, sendError };
```

Update all controllers to use this format.

---

### Task List - Core Bug Fixes

#### 7. Add Form Ownership Validation
**Time**: 15 minutes
**File**: `backend/controllers/formController.js`
**Issue**: Admins can edit any form, should only edit their own (unless super-admin)
```javascript
// Add to getFormById, updateQuestion, deleteForm:
const formResult = await db.query('SELECT created_by FROM forms WHERE id = $1', [formId]);
if (formResult.rows[0].created_by !== req.user.id && req.user.role !== 'super-admin') {
  return res.status(403).json({ error: 'Unauthorized' });
}
```

---

#### 8. Add Database Transactions for Application Submission
**Time**: 20 minutes
**File**: `backend/controllers/applicationController.js`
**Issue**: No transaction protection

```javascript
const submitApplication = async (req, res) => {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    
    // All queries using client instead of db
    const result = await client.query(
      'INSERT INTO applications ...'
    );
    
    await client.query('COMMIT');
    res.status(201).json({ ...result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Failed to submit' });
  } finally {
    client.release();
  }
};
```

---

#### 9. Add Input Validation on All Endpoints
**Time**: 25 minutes
**File**: `backend/middleware/validation.js`
**Task**: Add validators for form submission, question creation, etc.

```javascript
const validateQuestion = (req, res, next) => {
  const { text, type, options } = req.body;
  
  if (!text || typeof text !== 'string' || text.trim().length < 5) {
    return res.status(400).json({ error: 'Question text required (min 5 chars)' });
  }
  
  const validTypes = ['text', 'multiple-choice', 'checkbox', 'knockout'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid question type' });
  }
  
  if (type === 'multiple-choice' && (!options || !Array.isArray(options))) {
    return res.status(400).json({ error: 'Options required for multiple choice' });
  }
  
  next();
};
```

---

## 📱 Frontend Implementation (Week 2-3)

### Task List - API Service Layer

#### 10. Create Centralized API Client
**Time**: 30 minutes
**File**: `Parivartan-Frontend/FelloChakra/services/api.js`

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem('authToken');
      // Redirect to login
    }
    throw error.response?.data || error;
  }
);

export default api;
```

---

#### 11. Create Auth Service
**Time**: 20 minutes
**File**: `Parivartan-Frontend/FelloChakra/services/authService.js`

```javascript
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  signup: async (email, password, fullName) => {
    const response = await api.post('/auth/signup', {
      email,
      password,
      full_name: fullName,
    });
    await AsyncStorage.setItem('authToken', response.token);
    return response.user;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('authToken', response.token);
    return response.user;
  },

  getProfile: async () => {
    return api.get('/auth/profile');
  },

  logout: async () => {
    await AsyncStorage.removeItem('authToken');
  },
};
```

---

#### 12. Create Forms Service
**Time**: 25 minutes
**File**: `Parivartan-Frontend/FelloChakra/services/formsService.js`

```javascript
import api from './api';

export const formsService = {
  getForms: async () => api.get('/forms'),
  getForm: async (formId) => api.get(`/forms/${formId}`),
  submitApplication: async (formId, answers) =>
    api.post('/applications/submit', { form_id: formId, answers }),
  getUserApplications: async () => api.get('/applications/my-applications'),
};
```

---

### Task List - Screen Implementation

#### 13. Implement Login Screen
**Time**: 45 minutes
**File**: `Parivartan-Frontend/FelloChakra/screens/LoginScreen.js`

Should include:
- Email/password input fields
- Form validation
- Error handling
- Loading state
- Link to signup
- API integration with authService

#### 14. Implement Signup Screen
**Time**: 45 minutes
**File**: `Parivartan-Frontend/FelloChakra/screens/SignupScreen.js`

Should include:
- Email, password, full name inputs
- Password strength indicator
- Form validation
- Error handling
- Loading state
- Link to login

#### 15. Implement Application Form Screen
**Time**: 60 minutes
**File**: `Parivartan-Frontend/FelloChakra/screens/ApplicationFormScreen.js`

Should include:
- Fetch form and questions
- Render different question types
- Collect user answers
- Validate before submission
- Handle knockout questions
- Show success/error messages

#### 16. Implement Admin Dashboard
**Time**: 90 minutes
**File**: `Parivartan-Frontend/FelloChakra/screens/AdminDashboard.js`

Should include:
- List of forms
- View applications for each form
- Review and reject applications with feedback
- View statistics (total, approved, rejected)
- Create/edit forms

---

## 🔐 Authentication & Security (Week 2)

### Task List

#### 17. Implement Password Reset Flow
**Time**: 60 minutes
**Files**: 
- `backend/controllers/authController.js` (new functions)
- `backend/utils/emailService.js` (new)
- `Parivartan-Frontend/FelloChakra/screens/ForgotPasswordScreen.js` (new)

**Backend**:
```javascript
const requestPasswordReset = async (req, res) => {
  // Generate reset token
  // Save to database with expiry (15 min)
  // Send email with reset link
};

const resetPassword = async (req, res) => {
  // Verify token
  // Update password
  // Clear reset token
};
```

---

#### 18. Implement Email Verification
**Time**: 60 minutes
**Backend**:
```javascript
const sendVerificationEmail = async (userId, email) => {
  // Generate verification token
  // Save to database
  // Send email with verification link
};

const verifyEmail = async (req, res) => {
  // Verify token
  // Mark user as verified
  // Update in database
};
```

---

#### 19. Add Email Notifications
**Time**: 90 minutes
**Features**:
- Application submitted confirmation
- Application approved/rejected notification
- Password reset request confirmation
- Form assignment notification

**File**: `backend/services/emailService.js`

---

## 📊 Testing & Documentation

### Task List

#### 20. Create Unit Tests for Controllers
**Time**: 120 minutes
**File**: `backend/tests/controllers/`
- Auth controller tests
- Form controller tests
- Application controller tests

Use Jest framework: `npm install --save-dev jest @testing-library/react`

#### 21. Create API Documentation
**Time**: 60 minutes
**File**: `backend/API_DOCUMENTATION.md`
- All endpoints with request/response examples
- Authentication requirements
- Error codes
- Rate limits

#### 22. Create Frontend Documentation
**Time**: 45 minutes
**File**: `Parivartan-Frontend/FRONTEND_SETUP.md`
- Screen structure
- Service layer explanation
- Context usage
- Testing setup

---

## 🎯 Summary of Deliverables

### Week 1 Deliverables
- ✅ Environment files
- ✅ Admin role system
- ✅ Security headers (helmet)
- ✅ Rate limiting
- ✅ API response standardization
- ✅ Input validation
- ✅ Database transaction protection

### Week 2 Deliverables
- ✅ API service layer (frontend)
- ✅ Auth service (frontend)
- ✅ Forms service (frontend)
- ✅ Login & Signup screens
- ✅ Password reset backend
- ✅ Email verification backend

### Week 3 Deliverables
- ✅ Application form screen
- ✅ Admin dashboard
- ✅ Email notifications
- ✅ Unit tests (70% coverage)
- ✅ API documentation
- ✅ Frontend documentation

---

## 🔄 Development Order (Recommended Sequence)

1. Quick wins (security headers, env files)
2. Core bug fixes (transactions, ownership validation)
3. Admin role system
4. Backend testing
5. API documentation
6. Frontend service layer
7. Frontend authentication screens
8. Frontend form screens
9. Admin functionality
10. Email features
11. Full integration testing
12. Production deployment setup

---

## 📈 Metrics to Track

- Code coverage: Target 70%+
- API response time: < 500ms
- Frontend load time: < 3s
- Bug resolution time: < 1 day

---

**Total Estimated Time**: 120-150 hours  
**Recommended Team Size**: 2-3 developers  
**Project Duration**: 3-4 weeks
