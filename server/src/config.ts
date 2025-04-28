export default {
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  jwtExpiration: '24h',
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/naturopura',
  port: process.env.PORT || 5000
};