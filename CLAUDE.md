# Xionco Store - Admin Panel Documentation

Full-stack store management admin panel with Express.js backend, Next.js frontend, PostgreSQL database, and Google/Facebook OAuth integration.

## Project Structure

```
xionco_store/
├── backend/                   # Express.js REST API
│   ├── src/
│   │   ├── config/           # Database and Passport configuration
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Auth and other middleware
│   │   ├── routes/           # API routes
│   │   ├── db/               # Migrations and seeding
│   │   └── app.js            # Express app entry point
│   ├── tests/                # Jest + Supertest tests
│   ├── package.json
│   ├── jest.config.js
│   └── .env.example
│
├── frontend/                 # Next.js + Tailwind CSS Admin UI
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/       # React components
│   │   ├── lib/              # API client and auth config
│   │   └── app/api/auth/     # NextAuth.js routes
│   ├── tests/                # Jest + React Testing Library tests
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── .env.local.example
│
├── podman-compose.yml        # PostgreSQL container
└── CLAUDE.md                 # This file
```

## Prerequisites

- Node.js 18+ with npm/yarn
- Podman or Docker
- OAuth credentials (Google and Facebook)

## Setup Instructions

### 1. Environment Setup

**Backend (.env)**
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and set:
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET`
- `JWT_SECRET` (generate with: `openssl rand -base64 32`)
- `SESSION_SECRET` (generate with: `openssl rand -base64 32`)

**Frontend (.env.local)**
```bash
cp frontend/.env.local.example frontend/.env.local
```

Edit `frontend/.env.local` with the same OAuth credentials and:
- `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)

### 2. Database Setup

**Start PostgreSQL**
```bash
podman-compose up -d
```

Verify it's running:
```bash
podman ps  # Should show postgres:15
```

**Run Migrations**
```bash
cd backend
npm install
npm run migrate
```

**Seed Sample Data (10 products)**
```bash
npm run seed
```

### 3. Backend Setup

```bash
cd backend
npm install
npm run dev  # Development mode with nodemon
# OR
npm start    # Production mode
```

Server runs on `http://localhost:3001`

**Health Check**
```bash
curl http://localhost:3001/health
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Admin panel runs on `http://localhost:3000`

## Running Tests

### Backend Tests
```bash
cd backend
npm test
```

Tests cover:
- Products API (GET/POST/PUT/DELETE)
- Stock management (movements, levels)
- Sales tracking (create, summary)

### Frontend Tests
```bash
cd frontend
npm test
```

Tests cover:
- ProductTable component
- SalesTable component
- Loading states and empty states

## API Endpoints

### Authentication (Public)
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/facebook` - Facebook OAuth login
- `POST /api/auth/logout` - Logout

### Products (Protected)
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Stock (Protected)
- `GET /api/stock` - Get all stock levels
- `GET /api/stock/product/:productId` - Get stock for product
- `POST /api/stock/movement` - Record stock movement (IN/OUT/ADJUSTMENT)
- `GET /api/stock/movements` - Get movement history

### Sales (Protected)
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create sale (updates stock automatically)
- `GET /api/sales/:id` - Get sale by ID
- `GET /api/sales/summary` - Get sales summary stats

## Frontend Pages

- `/login` - Google/Facebook OAuth login
- `/dashboard` - Dashboard with stats (products, stock, revenue)
- `/products` - Product list and management
- `/stock` - Stock levels and movement history
- `/sales` - Sales records and revenue tracking

## Database Schema

### Products
- id, name, description, category, price, sku, created_at

### Stock
- id, product_id, quantity, updated_at

### Stock Movements
- id, product_id, movement_type (IN/OUT/ADJUSTMENT), quantity, notes, created_at

### Sales
- id, product_id, quantity, unit_price, total_price, sale_date

### Users
- id, provider (google/facebook), provider_id, name, email, avatar_url, created_at

## Sample Data

10 home furniture products are seeded:
1. Modern Sectional Sofa ($1299.99)
2. Elegant Dining Table ($899.99)
3. Queen Platform Bed Frame ($599.99)
4. Industrial Bookshelf ($349.99)
5. Minimalist Coffee Table ($249.99)
6. Modern Wardrobe Cabinet ($749.99)
7. Ergonomic Office Chair ($349.99)
8. Smart TV Stand ($279.99)
9. Wooden Nightstand ($199.99)
10. Contemporary Dresser ($549.99)

Each product is initialized with random stock (10-60 units).

## Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
podman ps

# View logs
podman logs <postgres-container-id>

# Restart database
podman-compose restart postgres
```

### Port Already in Use
- Backend (3001): `lsof -i :3001`
- Frontend (3000): `lsof -i :3000`
- Database (5432): `lsof -i :5432`

### OAuth Credentials
Ensure you have:
1. Google OAuth app at https://console.cloud.google.com
2. Facebook app at https://developers.facebook.com
3. Redirect URIs set correctly:
   - Google: `http://localhost:3001/api/auth/google/callback`
   - Facebook: `http://localhost:3001/api/auth/facebook/callback`

## Development Workflow

1. **Start services in order:**
   ```bash
   # Terminal 1: Database
   podman-compose up -d

   # Terminal 2: Backend
   cd backend && npm run dev

   # Terminal 3: Frontend
   cd frontend && npm run dev
   ```

2. **Make code changes** - both services hot-reload

3. **Run tests** before committing:
   ```bash
   cd backend && npm test
   cd frontend && npm test
   ```

## Production Build

**Backend**
```bash
cd backend
npm start  # Uses NODE_ENV=production
```

**Frontend**
```bash
cd frontend
npm run build
npm start
```

## License

ISC
