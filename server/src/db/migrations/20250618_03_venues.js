/**
 * Venues table migration
 */
exports.up = function(knex) {
  return knex.schema.createTable('venues', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('address');
    table.string('city');
    table.string('state');
    table.string('country');
    table.string('postal_code');
    table.string('contact_email');
    table.string('contact_phone');
    table.string('website');
    table.boolean('has_pa').defaultTo(false);
    table.boolean('has_backline').defaultTo(false);
    table.text('notes');
    table.decimal('hourly_rate', 10, 2);
    table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL'); // User who added the venue
    table.jsonb('photos').defaultTo('[]');
    table.jsonb('hours_of_operation');
    table.decimal('latitude', 10, 6);
    table.decimal('longitude', 10, 6);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    table.index('name');
    table.index('city');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('venues');
};