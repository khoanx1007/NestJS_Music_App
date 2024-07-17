export default () => ({
  port: parseInt(process.env.PORT, 10),
  secret: process.env.SECRET_KEY,
  dbHost: process.env.DB_HOST,
  dbPort: parseInt(process.env.DB_PORT),
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  dbName: process.env.DB_NAME,
});
