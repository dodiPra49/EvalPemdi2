const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mariadb',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'evalpemdi_user',
  password: process.env.DB_PASSWORD || 'evalpemdi_password',
  database: process.env.DB_NAME || 'evalpemdi_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
