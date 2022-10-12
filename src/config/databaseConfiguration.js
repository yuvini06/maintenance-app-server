import mysql from "mysql2/promise";
import config from "./serverConfiguration";

/**
 * Connection pool: a cache of database connections that can be re-used for future requests.
 * Improves performance by avoiding the overhead with opening/closing connections.
 * Connections are created on demand and not upfront.
 * Default options: waitForConnections=true, connectionLimit=10, queueLimit=0
 *
 */
const pool = mysql.createPool({
  host: config.DATABASE.HOST,
  user: config.DATABASE.USER,
  password: config.DATABASE.PASSWORD,
  database: config.DATABASE.NAME,
});

async function executeQuery(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

// Acquire a connection from the pool
async function getConnection() {
  return await pool.getConnection();
}

export { executeQuery, getConnection };
