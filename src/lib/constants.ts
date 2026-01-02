export const BACKEND_URL =
  process.env.NODE_ENV == 'production'
    ? 'https://insta-shop-backend.onrender.com'
    : 'http://localhost:8000';
