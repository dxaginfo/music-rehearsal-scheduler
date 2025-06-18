import knex from 'knex';
import { logger } from '../utils/logger';

// Import knexfile configuration
const knexConfig = require('./knexfile');

// Determine environment
const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

if (!config) {
  logger.error(`No configuration found for environment: ${environment}`);
  process.exit(1);
}

// Initialize knex with the appropriate config
const db = knex(config);

// Test the connection
db.raw('SELECT 1')
  .then(() => {
    logger.info(`Database connection established in ${environment} mode`);
  })
  .catch((err) => {
    logger.error('Database connection failed:', err);
    process.exit(1);
  });

export default db;