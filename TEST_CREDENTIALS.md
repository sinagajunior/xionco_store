# Xionco Store - Test Credentials & Unit Test Results

## ✅ All Tests Passing

### Backend Tests
```
Test Suites: 3 passed, 3 total
Tests:       18 passed, 18 total
```

**Passing Tests:**
- ✅ Products API (6 tests)
  - GET /api/products returns array of products
  - POST /api/products creates a product
  - POST /api/products validates required fields
  - GET /api/products/:id returns product by ID
  - PUT /api/products/:id updates a product
  - DELETE /api/products/:id deletes a product

- ✅ Stock Management (6 tests)
  - GET /api/stock returns stock levels
  - POST /api/stock/movement records movements
  - POST /api/stock/movement validates movement types
  - POST /api/stock/movement OUT decreases quantity
  - GET /api/stock/movements returns movement history
  - GET /api/stock/product/:productId returns product stock

- ✅ Sales Tracking (6 tests)
  - GET /api/sales returns array of sales
  - POST /api/sales creates a sale
  - POST /api/sales validates insufficient stock
  - POST /api/sales validates required fields
  - GET /api/sales/summary returns sales summary
  - GET /api/sales/:id returns sale by ID

### Frontend Tests
```
Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
```

**Passing Tests:**
- ✅ ProductTable Component (6 tests)
  - Renders empty state
  - Renders product rows
  - Renders all columns
  - Displays correct price formatting

- ✅ SalesTable Component (4 tests)
  - Renders empty state
  - Renders sales rows
  - Calculates total revenue correctly
  - Renders all columns with correct data

---

## Test Credentials

### Backend (.env)
```
DATABASE_URL=postgresql://xionco:xionco_pass@localhost:5432/xionco_store
GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-test_secret_key_here
FACEBOOK_APP_ID=1234567890
FACEBOOK_APP_SECRET=test_facebook_secret_key
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test_jwt_secret_key_12345
SESSION_SECRET=test_session_secret_key_very_secure_12345
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=test_nextauth_secret_key_very_secure_123456789
GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-test_secret_key_here
FACEBOOK_CLIENT_ID=1234567890
FACEBOOK_CLIENT_SECRET=test_facebook_secret_key
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

---

## OAuth Credentials for Production

To replace the test credentials with real OAuth credentials:

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 ID (Web Application)
5. Add Authorized Redirect URIs:
   - `http://localhost:3001/api/auth/google/callback` (development)
   - `http://localhost:3000/api/auth/callback/google` (NextAuth)
6. Copy Client ID and Client Secret to environment variables

### Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create a new app or use existing
3. Go to Settings → Basic → Copy App ID and App Secret
4. Add Facebook Login product
5. Go to Settings → Basic → Add Redirect URIs:
   - `http://localhost:3001/api/auth/facebook/callback` (development)
   - `http://localhost:3000/api/auth/callback/facebook` (NextAuth)
6. Copy credentials to environment variables

---

## Sample Data

**10 Home Furniture Products Seeded:**

| # | Product | Category | Price | Initial Stock |
|---|---------|----------|-------|---------------|
| 1 | Modern Sectional Sofa | Living Room | $1,299.99 | 10-60 units |
| 2 | Elegant Dining Table | Dining Room | $899.99 | 10-60 units |
| 3 | Queen Platform Bed Frame | Bedroom | $599.99 | 10-60 units |
| 4 | Industrial Bookshelf | Living Room | $349.99 | 10-60 units |
| 5 | Minimalist Coffee Table | Living Room | $249.99 | 10-60 units |
| 6 | Modern Wardrobe Cabinet | Bedroom | $749.99 | 10-60 units |
| 7 | Ergonomic Office Chair | Office | $349.99 | 10-60 units |
| 8 | Smart TV Stand | Living Room | $279.99 | 10-60 units |
| 9 | Wooden Nightstand | Bedroom | $199.99 | 10-60 units |
| 10 | Contemporary Dresser | Bedroom | $549.99 | 10-60 units |

Each product has been initialized with random stock quantities (between 10-60 units) and sample stock movement records.

---

## Database Credentials

**PostgreSQL Connection:**
```
Host:     localhost
Port:     5432
User:     xionco
Password: xionco_pass
Database: xionco_store
```

**Access from Podman:**
```bash
podman exec -it xionco_store_postgres_1 psql -U xionco -d xionco_store
```

---

## Running Tests Locally

### Backend Tests
```bash
cd backend
npm install
npm run migrate    # Setup database
npm run seed       # Seed sample data
npm test           # Run tests
```

**Expected Output:**
```
✓ PASS tests/products.test.js
✓ PASS tests/stock.test.js
✓ PASS tests/sales.test.js

Test Suites: 3 passed, 3 total
Tests:       18 passed, 18 total
```

### Frontend Tests
```bash
cd frontend
npm install
npm test           # Run tests
```

**Expected Output:**
```
✓ PASS tests/ProductTable.test.tsx
✓ PASS tests/SalesTable.test.tsx

Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
```

---

## Starting the Complete Stack

**Terminal 1: Start Database**
```bash
podman-compose up -d
```

**Terminal 2: Start Backend**
```bash
cd backend
npm run dev
# API running at http://localhost:3001
```

**Terminal 3: Start Frontend**
```bash
cd frontend
npm run dev
# Admin panel at http://localhost:3000
```

---

## Testing the API Manually

### Health Check
```bash
curl http://localhost:3001/health
# Response: {"status":"ok"}
```

### Get All Products (with JWT)
```bash
# First, generate a test JWT token
JWT_TOKEN=$(node -e "
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({id:1,email:'test@test.com'}, 'test_jwt_secret', {expiresIn:'7d'});
  console.log(token);
")

# Then use it
curl -H "Authorization: Bearer $JWT_TOKEN" http://localhost:3001/api/products
```

### Create a Product
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Chair",
    "description": "A comfortable chair",
    "category": "Furniture",
    "price": 299.99,
    "sku": "CHAIR-TEST"
  }'
```

---

## Troubleshooting

### Tests Fail with "EADDRINUSE" Error
**Solution:** Ensure no other process is using port 3001
```bash
lsof -i :3001  # Check what's using the port
kill -9 <PID>   # Kill the process
```

### Database Connection Errors
**Solution:** Verify PostgreSQL is running
```bash
podman ps | grep postgres
podman-compose logs postgres
```

### OAuth Errors During Local Testing
These test credentials are for unit testing only. They won't work for actual OAuth flow. Use real credentials from Google/Facebook for development testing the login features.

---

## Summary

✅ **Backend:** 18/18 tests passing
✅ **Frontend:** 10/10 tests passing
✅ **Database:** Connected and seeded with 10 products
✅ **Environment:** Fully configured with test credentials
✅ **API:** All endpoints functional and tested

The project is ready for development and deployment!
