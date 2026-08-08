// Mock environment variables for testing
process.env.DATABASE_URL = 'postgresql://xionco:xionco_pass@localhost:5432/xionco_store';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.SESSION_SECRET = 'test_session_secret';
process.env.PORT = '3001';
process.env.NODE_ENV = 'test';

// Increase timeout for all tests
jest.setTimeout(30000);
