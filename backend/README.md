# TechLeadHers Backend API

A Node.js/Express backend for the TechLeadHers fellowship management system.

## Tech Stack

- **Node.js** with Express 5.2.1
- **PostgreSQL** for database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=techleadhers_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

### 3. Setup PostgreSQL Database

Make sure PostgreSQL is installed and running:

```bash
# Create database
createdb techleadhers_db

# Or use psql
psql -U postgres -c "CREATE DATABASE techleadhers_db;"
```

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires token)

### Forms

- `GET /api/forms` - Get all forms
- `GET /api/forms/:formId` - Get form with questions
- `POST /api/forms` - Create form (admin only)
- `POST /api/forms/:formId/questions` - Add question to form (admin only)
- `PUT /api/forms/:formId/publish` - Publish form (admin only)
- `DELETE /api/forms/:formId` - Delete form (admin only)

### Applications

- `POST /api/applications/submit` - Submit application
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/form/:formId` - Get form submissions (admin only)
- `GET /api/applications/form/:formId/stats` - Get submission statistics (admin only)
- `GET /api/applications/:applicationId` - Get application details

## Database Schema

### Users Table
```sql
- id (PRIMARY KEY)
- email (UNIQUE)
- password (hashed)
- full_name
- role (user/admin)
- created_at
- updated_at
```

### Forms Table
```sql
- id (PRIMARY KEY)
- title
- description
- created_by (FOREIGN KEY)
- is_published
- created_at
- updated_at
```

### Questions Table
```sql
- id (PRIMARY KEY)
- form_id (FOREIGN KEY)
- text
- type (text/radio/checkbox/essay)
- required
- options (JSON)
- correct_answer
- is_knockout
- order_num
- created_at
```

### Applications Table
```sql
- id (PRIMARY KEY)
- form_id (FOREIGN KEY)
- user_id (FOREIGN KEY)
- answers (JSON)
- is_rejected
- rejection_reason
- status
- submitted_at
- updated_at
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

**How to use:**
1. Register or login to get a token
2. Include the token in request headers: `Authorization: Bearer <token>`
3. Token expires after 7 days (configurable in .env)

## Error Handling

All error responses follow this format:
```json
{
  "error": "Error message",
  "status": 400
}
```

## Development

### Running Tests
```bash
npm test
```

### Adding New Routes
1. Create controller in `controllers/`
2. Create route file in `routes/`
3. Import and use in `index.js`

## Contributing

1. Follow existing code patterns
2. Add comments for complex logic
3. Use meaningful variable names
4. Test before committing

## License

ISC

## Support

For issues or questions, contact: aaviyanta.foundation21@gmail.com
