# ⚙️ Update Your Supabase Connection String

Your backend is now configured to use a **CONNECTION STRING** format. This is more flexible and works for cloud databases.

## Current Configuration Status

✅ **Using DATABASE_URL format** - Correct!
❌ **Authentication or Host Error** - Needs fixing

---

## How to Get the Correct Connection String

### **Method 1: From Supabase Dashboard (RECOMMENDED)**

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Sign in to your account

2. **Select Your Project**
   - Click on your project: `hzscxchzifhugpsyoomc`

3. **Get Connection String**
   - Left sidebar → **Settings**
   - Click **Database**
   - Look for **"Connection String"** section
   - Switch to **"URI"** tab (if there are tabs)

4. **Copy the Connection String**
   - It should look like:
     ```
     postgresql://postgres:YOUR_PASSWORD@db.hzscxchzifhugpsyoomc.supabase.co:5432/postgres
     ```

5. **Update .env**
   - Open `.env` file in your backend
   - Replace this line:
     ```env
     DATABASE_URL=postgresql://postgres:teamparivartan@db.hzscxchzifhugpsyoomc.supabase.co:5432/postgres
     ```
   - With the one from your dashboard

---

## Common Issues

### Issue 1: "password authentication failed"

**Cause:** The password in your connection string is wrong

**Solution:**
1. Go to Supabase Dashboard
2. Settings → Database → Connection String
3. Copy the EXACT connection string
4. Paste it in your `.env` file

### Issue 2: "ENOTFOUND db.hzscxchzifhugpsyoomc.supabase.co"

**Cause:** Either:
- Wrong hostname in connection string
- ISP still blocking (from previous issue)

**Solution:**
1. Verify the hostname in Supabase Dashboard
2. Try using local PostgreSQL instead (see below)

### Issue 3: "Connect timeout"

**Cause:** ISP blocking port 5432 again

**Solution:**
- Use **Local PostgreSQL** (see below)

---

## 🔄 Alternative: Switch Back to Local PostgreSQL

If Supabase continues to have issues, use your local PostgreSQL (you have pgAdmin installed!):

### **Update .env:**
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=*

# Use Local PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=techleadhers_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false

# JWT Configuration
JWT_SECRET=supersecretkey
JWT_EXPIRE=7d

# Application Settings
APP_NAME=TechLeadHers
APP_URL=http://localhost:5000
```

### **Create Database in pgAdmin:**
1. Open pgAdmin (I see you have it open!)
2. Right-click **Databases** → **Create** → **Database**
3. Name: `techleadhers_db`
4. Click **Save**

### **Test:**
```bash
npm run dev
```

---

## Quick Steps to Fix

### Option A: Use Correct Supabase Connection String
1. Get connection string from Supabase Dashboard
2. Update `.env` with correct password and hostname
3. Run `npm run dev`

### Option B: Use Local PostgreSQL
1. Create database in pgAdmin
2. Update `.env` with local parameters (see above)
3. Run `npm run dev`

---

## Verification Commands

**Check if connection string is valid:**
```bash
node quick-diagnose.js
```

**Start server:**
```bash
npm run dev
```

**Test API:**
```bash
curl http://localhost:5000/api/health
```

---

## Connection String Format Reference

```
postgresql://username:password@host:port/database

Example:
postgresql://postgres:mypassword123@db.hzscxchzifhugpsyoomc.supabase.co:5432/postgres
```

Components:
- `postgresql://` - Protocol
- `postgres` - Username
- `mypassword123` - Password
- `db.hzscxchzifhugpsyoomc.supabase.co` - Host
- `5432` - Port (Supabase always uses 5432)
- `postgres` - Database name

---

## ✅ What I've Updated

1. ✅ `.env` - Now uses `DATABASE_URL` format
2. ✅ `database.js` - Now supports both connection string and individual parameters
3. ✅ `.env.example` - Updated with both format examples

---

**What would you like to do?**
1. Fix Supabase connection (get correct credentials)
2. Switch to Local PostgreSQL
3. Something else?

Let me know and I'll help! 🚀
