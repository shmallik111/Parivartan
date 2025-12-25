# 🚀 Installation & Setup Quick Start Guide

## Step 1: Install Required npm Packages

### Backend
```bash
cd backend

# Install new security and feature packages
npm install helmet express-rate-limit nodemailer

# Verify installation
npm list helmet express-rate-limit nodemailer
```

### Frontend
```bash
cd Parivartan-Frontend

# Install API and storage packages
npm install axios @react-native-async-storage/async-storage

# Verify installation
npm list axios @react-native-async-storage/async-storage
```

---

## Step 2: Configure Environment Variables

### Backend Configuration
```bash
cd backend

# Copy example to actual .env file
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your editor

# Key settings to update:
# 1. DATABASE_URL or individual DB params
# 2. JWT_SECRET (use a strong random string)
# 3. CORS_ORIGIN (your frontend URLs)
# 4. SMTP settings (for emails to work)
# 5. FRONTEND_URL (for password reset links)
```

### Sample .env Configuration
```
PORT=5000
NODE_ENV=development

DATABASE_URL=postgresql://postgres:password@localhost:5432/techleadhers_db

JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:19000,http://localhost:3000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@techleadhers.com

FRONTEND_URL=http://localhost:19000

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_LOGIN_ATTEMPTS=5
RATE_LIMIT_MAX_SIGNUP_ATTEMPTS=3
```

---

## Step 3: Initialize Database

```bash
# The database initialization happens automatically when you start the server
# It will:
# 1. Create all tables if they don't exist
# 2. Create all indexes
# 3. Add new columns to existing tables

# Just start the server:
cd backend
npm run dev

# You should see:
# ✅ Database tables initialized successfully
```

---

## Step 4: Create First Admin User

```bash
cd backend

# Run the seed script
node seed-admin.js

# Output will show:
# ✅ Super-admin user created successfully!
# 
# 📋 Admin Credentials:
#    ID:    1
#    Email: admin@techleadhers.com
#    Name:  TechLeadHers Admin
#    Role:  super-admin
# 
# 🔑 Password: TechLeaders123
# 
# ⚠️  IMPORTANT: Change this password immediately after first login!
```

---

## Step 5: Test Backend APIs

### Option A: Using cURL
```bash
# Test health check
curl http://localhost:5000/api/health

# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "full_name": "Test User"
  }'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@techleadhers.com",
    "password": "TechLeaders123"
  }'
```

### Option B: Using Postman
1. Create new collection "TechLeadHers API"
2. Add requests for each endpoint:
   - POST /api/auth/signup
   - POST /api/auth/login
   - POST /api/auth/forgot-password
   - POST /api/auth/verify-email
   - And others...

---

## Step 6: Start Development Servers

### Terminal 1: Backend
```bash
cd backend
npm run dev

# Output:
# Server running on port 5000
# Environment: development
# ✅ Database tables initialized successfully
```

### Terminal 2: Frontend
```bash
cd Parivartan-Frontend/FelloChakra
npm start
# or
npx expo start
```

---

## 📁 New Files Created

### Backend Files
```
backend/
├── .env.example (UPDATED)
├── seed-admin.js (NEW)
├── middleware/
│   ├── rateLimit.js (NEW)
│   └── validation.js (UPDATED)
├── utils/
│   ├── emailService.js (NEW)
│   ├── tokenUtils.js (NEW)
│   └── (directory created)
├── migrations/
│   └── 001_add_email_verification.sql (NEW)
├── controllers/
│   ├── authController.js (UPDATED - 6 new functions)
│   └── applicationController.js (UPDATED - transaction wrapper)
├── routes/
│   ├── auth.js (UPDATED - 6 new routes)
│   └── forms.js (UPDATED - validation middleware)
├── config/
│   └── database.js (UPDATED - new tables/columns)
└── index.js (UPDATED - helmet, CORS fix)
```

### Frontend Files
```
Parivartan-Frontend/FelloChakra/
└── services/
    ├── api.js (NEW)
    ├── authService.js (NEW)
    └── formsService.js (NEW)
```

### Documentation Files
```
project-root/
├── PROJECT_ANALYSIS.md (created earlier)
├── IMPLEMENTATION_ROADMAP.md (created earlier)
├── IMPLEMENTATION_COMPLETE.md (NEW - detailed setup)
├── CRITICAL_ISSUES_SUMMARY.md (NEW - this summary)
└── SETUP_GUIDE.md (NEW - this file)
```

---

## 🔧 Troubleshooting

### "Cannot find module 'helmet'"
```bash
cd backend
npm install helmet
```

### "Cannot find module 'express-rate-limit'"
```bash
cd backend
npm install express-rate-limit
```

### "Cannot find module 'nodemailer'"
```bash
cd backend
npm install nodemailer
```

### Database Connection Error
```bash
# Check .env DATABASE_URL is correct
# Verify PostgreSQL is running:
psql -U postgres -c "\l"

# If not running:
# Windows: pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### Email Not Sending
```bash
# Verify SMTP settings in .env
# For Gmail: use App Password (not regular password)
# Generate at: https://myaccount.google.com/apppasswords

# Test with:
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@gmail.com"}'
```

### Rate Limit Errors
```bash
# This is expected if you test too many times
# Wait 15 minutes for login attempts or 1 hour for signup
# Or restart the server (in-memory store)
```

---

## 📋 Verification Checklist

After setup, verify everything works:

### Backend Verification
- [ ] Server starts without errors
- [ ] `npm run dev` shows "Server running on port 5000"
- [ ] Database shows "Database tables initialized successfully"
- [ ] Seed script creates admin user
- [ ] GET /api/health returns success
- [ ] POST /api/auth/login works with admin credentials
- [ ] POST /api/auth/forgot-password sends email
- [ ] CORS allows frontend origin

### Frontend Verification
- [ ] `npm start` launches without errors
- [ ] Services can be imported: `import { authService } from "./services/authService"`
- [ ] API client connects to backend
- [ ] No console errors in React/Expo

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is set to strong random value
- [ ] SMTP_PASSWORD is set (use app password for Gmail)
- [ ] CORS_ORIGIN is restricted (not wildcard)
- [ ] Database credentials are in .env (not in code)
- [ ] Admin password is changed after first login
- [ ] Email verification is enabled
- [ ] Rate limiting is active
- [ ] Helmet security headers are enabled

---

## 📚 Additional Resources

### Email Setup Resources
- **Gmail App Password**: https://myaccount.google.com/apppasswords
- **SendGrid Alternative**: https://sendgrid.com
- **Nodemailer Docs**: https://nodemailer.com

### Testing Tools
- **Postman**: https://www.postman.com
- **Insomnia**: https://insomnia.rest
- **Thunder Client** (VS Code): VS Code Extension

### React Native Setup
- **Expo Docs**: https://docs.expo.dev
- **React Navigation**: https://reactnavigation.org

---

## 🎯 What's Next?

After setup is verified:

1. **Implement Frontend Screens**
   - LoginScreen with authService.login()
   - SignupScreen with authService.signup()
   - ApplicationFormScreen with formsService
   - AdminDashboard for form management

2. **Test API Endpoints**
   - Test all auth flows (signup, login, reset, verify)
   - Test form submission
   - Test admin functions

3. **Integration Testing**
   - Frontend to backend integration
   - Email sending in real environment
   - Database operations

4. **Production Preparation**
   - SSL/HTTPS setup
   - Database backup strategy
   - Monitoring and logging
   - Performance optimization

---

## 🆘 Getting Help

If you encounter issues:

1. Check the error message carefully
2. Review relevant documentation file:
   - `IMPLEMENTATION_COMPLETE.md` - detailed setup & API docs
   - `CRITICAL_ISSUES_SUMMARY.md` - what was changed
   - `PROJECT_ANALYSIS.md` - overall project analysis
3. Check npm package documentation
4. Review code comments in the files
5. Test with cURL or Postman first

---

## 📞 Quick Commands Reference

```bash
# Install all backend dependencies
npm install

# Start backend development server
npm run dev

# Create first admin user
node seed-admin.js

# Start frontend
npm start

# Install new package
npm install package-name

# Check installed packages
npm list

# Update all packages
npm update

# Clear npm cache
npm cache clean --force
```

---

**Setup Completed!** 🎉

Your TechLeadHers backend now has:
- ✅ Secure authentication with email verification
- ✅ Password reset functionality
- ✅ Admin role management
- ✅ Rate limiting for security
- ✅ Security headers (Helmet)
- ✅ Data transaction protection
- ✅ Frontend API service layer

**Ready to integrate frontend and test!** 🚀
