# Supabase Setup Guide for TechLeadHers Backend

## What is Supabase?

Supabase is a cloud PostgreSQL database service. It provides:
- ✅ Managed PostgreSQL database
- ✅ Built-in authentication (optional)
- ✅ Automatic backups
- ✅ Scalability
- ✅ No need for local database setup

---

## Configuration for Supabase

### 1. Update .env File

Your `.env` file is already configured with Supabase credentials:

```env
DB_HOST=hzscxchzifhugpsyoomc.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=teamparivartan
DB_SSL=true
```

**Important Notes:**
- `DB_SSL=true` is **required** for Supabase
- `DB_NAME=postgres` is the default database name in Supabase
- Keep `DB_PASSWORD` safe - never commit .env to git

### 2. Database Connection Details

The backend now automatically:
- ✅ Connects with SSL encryption
- ✅ Creates tables on first startup
- ✅ Sets up all necessary indexes
- ✅ Handles connection pooling

---

## Testing Connection

### 1. Test Connection Before Running Server

```bash
node test-connection.js
```

Expected output:
```
Testing Supabase Connection...
Host: hzscxchzifhugpsyoomc.supabase.co
Port: 5432
Database: postgres
User: postgres
SSL: true

✅ Connection Successful!
Server Version: PostgreSQL 14.8 on x86_64-pc-linux-gnu...
```

### 2. Start the Server

```bash
npm run dev
```

Expected output:
```
Server running on port 5000
Environment: development
Database tables initialized successfully
```

### 3. Test API Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{ "status": "Backend is running" }
```

---

## What Tables Will Be Created?

When the backend starts, it automatically creates:

1. **users** - Store user accounts
2. **forms** - Store application forms
3. **questions** - Store questions for forms
4. **applications** - Store submitted applications

All tables are created with:
- ✅ Primary keys
- ✅ Foreign key relationships
- ✅ Proper indexes for performance
- ✅ Timestamps (created_at, updated_at)

---

## Troubleshooting

### Connection Fails

**Problem:** "Connection refused" or "Network timeout"

**Solutions:**
1. Verify credentials are correct in .env
2. Check if Supabase database is running
3. Verify Supabase project status in dashboard
4. Ensure your IP is allowed (Supabase allows all by default)

### SSL Errors

**Problem:** "certificate verify failed" or "self-signed certificate"

**Status:** ✅ Already fixed in database.js with `rejectUnauthorized: false`

### Tables Not Created

**Problem:** Tables exist but data not persisting

**Solutions:**
1. Check database.js is using correct pool config
2. Verify you can query the database manually
3. Check if DB user has CREATE TABLE permissions

### Connection Pool Issues

**Problem:** "too many connections" error

**Solutions:**
1. Check how many connections your plan allows (default 100)
2. Ensure connections are properly closed
3. Reduce connection pool size if needed

---

## Next Steps

1. ✅ Verify connection with `node test-connection.js`
2. ✅ Start backend with `npm run dev`
3. ✅ Test health endpoint
4. ✅ Connect frontend to API
5. ✅ Test signup/login endpoints
6. ✅ Test form submission

---

## API Documentation

See [README.md](./README.md) for complete API endpoint documentation.

---

## Important Security Notes

1. **Never commit .env to git** - It contains sensitive credentials
2. **Change JWT_SECRET** in .env for production
3. **Use strong passwords** for Supabase
4. **Enable IP whitelist** if available in your Supabase plan
5. **Use HTTPS** in production (not HTTP)

---

## Useful Supabase Features

- **Supabase Dashboard**: View/edit data directly
- **SQL Editor**: Run custom SQL queries
- **Database Backups**: Automatic daily backups
- **Logs**: Monitor database activity

---

## Support

For issues:
1. Check Supabase status page
2. Review connection logs
3. Test with psql command line if available
4. Contact Supabase support

---

**Last Updated:** December 25, 2025
**Backend Version:** 1.0.0
**PostgreSQL Support:** 12+ (Supabase)
