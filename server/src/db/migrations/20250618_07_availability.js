/**
 * Availability tables migration
 */
exports.up = function(knex) {
  return knex.schema
    // Create user_availability table
    .createTable('user_availability', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
      table.timestamp('start_time').notNullable();
      table.timestamp('end_time').notNullable();
      table.boolean('is_available').notNullable().defaultTo(true);
      table.integer('priority').defaultTo(5); // 1-10 scale, 10 being highest priority
      table.text('notes');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.index('user_id');
      table.index(['user_id', 'start_time', 'end_time']);
      table.index('is_available');
    })
    
    // Create recurring_availability table
    .createTable('recurring_availability', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
      table.integer('day_of_week').notNullable(); // 0-6 (Sunday to Saturday)
      table.time('start_time').notNullable();
      table.time('end_time').notNullable();
      table.boolean('is_available').notNullable().defaultTo(true);
      table.integer('priority').defaultTo(5); // 1-10 scale, 10 being highest priority
      table.text('notes');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.index('user_id');
      table.index(['user_id', 'day_of_week']);
    })
    
    // Create availability_exceptions table
    .createTable('availability_exceptions', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
      table.date('exception_date').notNullable();
      table.boolean('is_available').notNullable();
      table.text('reason');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      
      table.index('user_id');
      table.index('exception_date');
      // Make sure there's only one exception per user per date
      table.unique(['user_id', 'exception_date']);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('availability_exceptions')
    .dropTable('recurring_availability')
    .dropTable('user_availability');
};