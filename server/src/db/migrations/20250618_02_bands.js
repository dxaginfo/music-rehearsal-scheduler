/**
 * Bands and band_members tables migration
 */
exports.up = function(knex) {
  return knex.schema
    // Create bands table
    .createTable('bands', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable();
      table.string('description');
      table.string('logo_url');
      table.string('genre');
      table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
      table.string('website');
      table.string('social_links').defaultTo('{}');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.index('name');
    })
    
    // Create band_members table (junction table)
    .createTable('band_members', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('band_id').references('id').inTable('bands').onDelete('CASCADE').notNullable();
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
      table.string('role').defaultTo('member'); // admin, member
      table.string('instruments');
      table.string('nickname');
      table.timestamp('joined_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      // Each user can only be in a band once
      table.unique(['band_id', 'user_id']);
      
      table.index('band_id');
      table.index('user_id');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('band_members')
    .dropTable('bands');
};