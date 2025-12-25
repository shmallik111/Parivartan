# Supabase Connection Checklist

## ⚠️ Connection Status: Failed

The backend attempted to connect to your Supabase database but encountered an error.

---

## Troubleshooting Steps

### Step 1: Verify Supabase Credentials

**In your Supabase Dashboard:**
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click **Settings** → **Database**
4. Look for **Connection string** section
5. Find the connection details:
   - **Host**: Should be `hzscxchzifhugpsyoomc.supabase.co`
   - **Port**: Should be `5432`
   - **Database**: Should be `postgres`
   - **User**: Should be `postgres`

### Step 2: Check Your Password

The password in `.env` is set to `teamparivartan`.

**Verify this is correct:**
1. In Supabase Dashboard → **Settings** → **Database**
2. Look for password reset option
3. If unsure, reset your database password
4. Update `.env` with the new password

### Step 3: Enable External Connections

**In Supabase Dashboard:**
1. Go to **Settings** → **Database** → **Connection info**
2. Check if external connections are allowed
3. By default, Supabase allows all connections
4. No IP whitelist needed for public internet

### Step 4: Check Database Name

Supabase uses `postgres` as the default database name.

**Current Configuration:**
```env
DB_NAME=postgres
```

This is correct for Supabase. Do NOT change it.

### Step 5: Verify Network Connection

Test if you can reach Supabase:
```bash
# Ping Supabase host
ping hzscxchzifhugpsyoomc.supabase.co

# Or check DNS resolution
nslookup hzscxchzifhugpsyoomc.supabase.co
```

### Step 6: Manual Connection Test with psql

If psql is installed, test connection:
```bash
psql -h hzscxchzifhugpsyoomc.supabase.co -p 5432 -U postgres -d postgres
```

When prompted for password, enter: `teamparivartan`

---

## Common Issues & Solutions

### Issue 1: "Authentication Failed"
**Cause**: Wrong password
**Solution**: 
1. Reset password in Supabase Dashboard
2. Update `.env` with new password

### Issue 2: "Connection Timeout"
**Cause**: Network issue or Supabase down
**Solution**:
1. Check if Supabase is accessible in browser
2. Check your internet connection
3. Try from a different network

### Issue 3: "Database Does Not Exist"
**Cause**: Wrong database name
**Solution**:
1. Use `postgres` as database name (not `techleadhers_db`)
2. Verify in `.env`: `DB_NAME=postgres`

### Issue 4: "Too Many Connections"
**Cause**: Exceeded connection limit
**Solution**:
1. Close other connections
2. Wait a few minutes for connections to timeout
3. Check your plan limits on Supabase

---

## Configuration Recap

Your current `.env` is configured as:

```env
DB_HOST=hzscxchzifhugpsyoomc.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=teamparivartan
DB_SSL=true
```

✅ All values look correct for Supabase

**Only if the password is wrong:**
- Reset password in Supabase
- Update `DB_PASSWORD=your_new_password` in `.env`

---

## After Fixing Connection

Once connection succeeds:

### 1. Test Connection Again
```bash
node test-connection.js
```

Expected output:
```
✅ Connection Successful!
Server Version: PostgreSQL 14.8...
```

### 2. Start the Server
```bash
npm run dev
```

### 3. Server Creates Tables Automatically
```
Database tables initialized successfully
```

### 4. Test the API
```bash
curl http://localhost:5000/api/health
```

---

## Backend File Structure

All backend files are properly configured:

```
backend/
├── index.js                    ✅ Express server
├── config/database.js          ✅ Supabase connection with SSL
├── .env                        ✅ Your Supabase credentials
├── .env.example                ✅ Example template
├── test-connection.js          ✅ Connection tester
├── controllers/                ✅ Business logic
├── routes/                     ✅ API endpoints
├── middleware/                 ✅ Auth & validation
└── README.md                   ✅ API documentation
```

---

## Next Steps

1. **Verify your password** is correct in Supabase
2. **Update .env** if password is different
3. **Run test-connection.js** again
4. **Start server** with `npm run dev`
5. **Check API** with curl

---

## Getting Help

If still having issues:

1. **Check Supabase Status**: https://status.supabase.com
2. **Supabase Docs**: https://supabase.com/docs
3. **Check .env file** is in the backend root directory
4. **Verify Node.js**: `node --version` (should be v18+)
5. **Check packages**: Run `npm list` to verify all packages installed

---

**Need More Help?**

- Email: aaviyanta.foundation21@gmail.com
- Project: TechLeadHers Backend v1.0.0
- Status: Ready to use (pending connection verification)
