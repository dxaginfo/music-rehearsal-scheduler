import knex from 'knex';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

// Get database configuration from environment variables
const dbConfig = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'rehearsal_scheduler',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
  },
  seeds: {
    directory: './seeds',
  },
};

// Create database instance
export const db = knex(dbConfig);

// Test database connection
export const testConnection = async () => {
  try {
    await db.raw('SELECT 1');
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error);
    return false;
  }
};

export default db;