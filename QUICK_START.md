# Xionco Store - Quick Start Guide

## ⚡ 5-Minute Setup

### Prerequisites
- Node.js 18+
- Podman or Docker

### Step 1: Start Database (30 seconds)
```bash
# From project root
podman-compose up -d

# Wait a moment for PostgreSQL to start
sleep 3
```

### Step 2: Setup Backend (1 minute)
```bash
cd backend
npm install
npm run migrate    # Create tables
npm run seed       # Add 10 sample products
npm run dev        # Start backend (port 3001)
```

### Step 3: Setup Frontend (1 minute)
```bash
# New terminal
cd frontend
npm install
npm run dev        # Start frontend (port 3000)
```

### Step 4: Run Tests (1 minute)
```bash
# Backend tests - new terminal
cd backend
npm test
# Expected: ✅ 18 tests passing

# Frontend tests - new terminal
cd frontend
npm test
# Expected: ✅ 10 tests passing
```

### Step 5: Access the Application (30 seconds)
```
🌐 Admin Panel: http://localhost:3000
🔧 API Server: http://localhost:3001
📊 Database: localhost:5432
```

---

## 🎯 What's Running

| Service | Port | URL | Status |
|---------|------|-----|--------|
| Frontend (Next.js) | 3000 | http://localhost:3000 | Running |
| Backend (Express) | 3001 | http://localhost:3001 | Running |
| PostgreSQL | 5432 | localhost | Running |

---

## 🧪 Unit Tests Status

### Backend: 18/18 Tests ✅
```
Products API     ✅ 6 tests
Stock Management ✅ 6 tests
Sales Tracking   ✅ 6 tests
```

### Frontend: 10/10 Tests ✅
```
ProductTable     ✅ 6 tests
SalesTable       ✅ 4 tests
```

---

## 🔑 Test Credentials

**Pre-configured .env files included:**
- `backend/.env` - Ready to use
- `frontend/.env.local` - Ready to use

**Database Login:**
```
User: xionco
Password: xionco_pass
Database: xionco_store
```

---

## 📋 Sample Data Included

10 furniture products automatically seeded:
- Modern Sectional Sofa ($1,299.99)
- Elegant Dining Table ($899.99)
- Queen Platform Bed Frame ($599.99)
- Industrial Bookshelf ($349.99)
- Minimalist Coffee Table ($249.99)
- Modern Wardrobe Cabinet ($749.99)
- Ergonomic Office Chair ($349.99)
- Smart TV Stand ($279.99)
- Wooden Nightstand ($199.99)
- Contemporary Dresser ($549.99)

Each product has random initial stock (10-60 units).

---

## 🛑 Stop Services

```bash
# Stop all services
podman-compose down

# Stop just the database
podman-compose stop postgres

# View logs
podman-compose logs -f postgres
```

---

## 🔍 Verify Everything Works

### Test 1: Database Connection
```bash
cd backend
node -e "require('./src/config/database').query('SELECT COUNT(*) FROM products', (err, res) => console.log(res?.rows[0]))"
# Expected: { count: '10' }
```

### Test 2: API Health Check
```bash
curl http://localhost:3001/health
# Expected: {"status":"ok"}
```

### Test 3: Run All Unit Tests
```bash
cd backend && npm test     # Should show: 18 passed
cd ../frontend && npm test # Should show: 10 passed
```

---

## 📚 Project Structure

```
xionco_store/
├── backend/              # Express.js REST API
│   ├── src/
│   │   ├── app.js       # Express server
│   │   ├── config/      # Database & Passport
│   │   ├── controllers/ # API logic
│   │   ├── routes/      # API endpoints
│   │   └── db/          # Migrations & seed
│   ├── tests/           # Jest tests
│   └── package.json
│
├── frontend/            # Next.js Admin Panel
│   ├── src/
│   │   ├── app/         # Pages (login, dashboard, etc)
│   │   ├── components/  # React components
│   │   └── lib/         # Auth & API client
│   ├── tests/           # Component tests
│   └── package.json
│
├── podman-compose.yml   # PostgreSQL container
├── CLAUDE.md            # Full documentation
├── TEST_CREDENTIALS.md  # Test creds & results
└── QUICK_START.md       # This file
```

---

## 🚀 Next Steps

### For Development
1. ✅ All tests passing
2. ✅ Database seeded
3. ✅ Services running
4. → Start building features!

### For Production
1. Replace test OAuth credentials with real ones
2. Update `.env` files with production values
3. Build frontend: `npm run build`
4. Use production database connection
5. Deploy backend and frontend

### To Add Real OAuth
See `TEST_CREDENTIALS.md` for Google and Facebook OAuth setup instructions.

---

## 📞 Common Commands

| Task | Command |
|------|---------|
| Start everything | `podman-compose up -d` |
| Run backend tests | `cd backend && npm test` |
| Run frontend tests | `cd frontend && npm test` |
| Seed database | `cd backend && npm run seed` |
| Backend dev mode | `cd backend && npm run dev` |
| Frontend dev mode | `cd frontend && npm run dev` |
| Stop all services | `podman-compose down` |
| View database logs | `podman-compose logs postgres` |

---

## ✨ Features Included

- ✅ Google & Facebook OAuth authentication
- ✅ JWT-based API protection
- ✅ Products CRUD (Create, Read, Update, Delete)
- ✅ Stock management (track inventory levels)
- ✅ Sales tracking (record transactions)
- ✅ Dashboard with statistics
- ✅ Responsive admin UI
- ✅ Comprehensive unit tests
- ✅ Database migrations
- ✅ Sample data seeding

---

## 🐛 Troubleshooting

**"Port 3001 already in use"**
```bash
lsof -i :3001
kill -9 <PID>
```

**"Database connection refused"**
```bash
# Check if PostgreSQL is running
podman ps | grep postgres

# Restart if needed
podman-compose restart postgres
```

**"npm install fails"**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**"Tests fail to connect to database"**
```bash
# Make sure database is running
podman-compose ps

# Ensure migrations were run
npm run migrate
```

---

## 📖 Full Documentation

For detailed information, see:
- **CLAUDE.md** - Complete documentation with all endpoints
- **TEST_CREDENTIALS.md** - Test credentials and results
- **backend/.env.example** - Backend configuration template
- **frontend/.env.local.example** - Frontend configuration template

---

**Everything is ready to go! Happy coding! 🎉**
