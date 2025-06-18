/**
 * Users table migration
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('role').defaultTo('user');
    table.string('profile_image_url');
    table.string('phone');
    table.jsonb('preferences').defaultTo('{}');
    table.string('timezone').defaultTo('UTC');
    table.boolean('email_verified').defaultTo(false);
    table.string('verification_token');
    table.string('reset_password_token');
    table.timestamp('reset_password_expires');
    table.timestamp('last_login');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index('email');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};