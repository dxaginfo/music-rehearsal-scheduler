/**
 * Rehearsals and related tables migration
 */
exports.up = function(knex) {
  return knex.schema
    // Create rehearsals table
    .createTable('rehearsals', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('band_id').references('id').inTable('bands').onDelete('CASCADE').notNullable();
      table.uuid('venue_id').references('id').inTable('venues').onDelete('SET NULL');
      table.string('title').notNullable();
      table.timestamp('start_time').notNullable();
      table.timestamp('end_time').notNullable();
      table.text('description');
      table.string('status').defaultTo('scheduled'); // scheduled, cancelled, completed
      table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
      table.decimal('cost', 10, 2);
      table.uuid('setlist_id').references('id').inTable('setlists').onDelete('SET NULL');
      table.jsonb('notes').defaultTo('{}');
      table.boolean('reminder_sent').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.index('band_id');
      table.index('start_time');
      table.index('status');
    })
    
    // Create rehearsal_attendees table
    .createTable('rehearsal_attendees', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('rehearsal_id').references('id').inTable('rehearsals').onDelete('CASCADE').notNullable();
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
      table.string('status').defaultTo('pending'); // pending, confirmed, declined, tentative
      table.text('comment');
      table.timestamp('responded_at');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      // Each user can only be an attendee once per rehearsal
      table.unique(['rehearsal_id', 'user_id']);
      
      table.index('rehearsal_id');
      table.index('user_id');
      table.index('status');
    })
    
    // Create rehearsal_equipment table (junction table)
    .createTable('rehearsal_equipment', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('rehearsal_id').references('id').inTable('rehearsals').onDelete('CASCADE').notNullable();
      table.uuid('equipment_id').references('id').inTable('equipment').onDelete('CASCADE').notNullable();
      table.text('notes');
      table.uuid('assigned_by').references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      
      // Each equipment can only be assigned once per rehearsal
      table.unique(['rehearsal_id', 'equipment_id']);
      
      table.index('rehearsal_id');
      table.index('equipment_id');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('rehearsal_equipment')
    .dropTable('rehearsal_attendees')
    .dropTable('rehearsals');
};