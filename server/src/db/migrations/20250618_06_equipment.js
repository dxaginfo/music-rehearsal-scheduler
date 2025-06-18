/**
 * Equipment table migration
 */
exports.up = function(knex) {
  return knex.schema.createTable('equipment', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('type').notNullable();
    table.text('description');
    table.string('brand');
    table.string('model');
    table.string('serial_number');
    table.date('purchase_date');
    table.decimal('purchase_price', 10, 2);
    table.text('notes');
    table.uuid('band_id').references('id').inTable('bands').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.boolean('is_backline').defaultTo(false);
    table.boolean('needs_power').defaultTo(false);
    table.decimal('weight_kg', 6, 2);
    table.string('dimensions');
    table.jsonb('photos').defaultTo('[]');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Equipment must belong to either a band or a user
    table.check(
      '(band_id IS NOT NULL AND user_id IS NULL) OR (band_id IS NULL AND user_id IS NOT NULL)',
      'equipment_owner_check'
    );
    
    table.index('band_id');
    table.index('user_id');
    table.index('type');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('equipment');
};