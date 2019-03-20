const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.DB_PORT = 5432;
    process.env.DB_HOST = 'localhost';
    process.env.DB_USERNAME = 'postgres';
    process.env.DB_PASSWORD= 'anya';
    process.env.DB_NAME = 'blogan';
    process.env.SERVER_PORT = 3000;
}