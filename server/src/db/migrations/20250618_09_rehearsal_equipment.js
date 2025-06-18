/**
 * Rehearsal equipment and setlist foreign keys migration
 */
exports.up = function(knex) {
  return knex.schema
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
    })
    
    // Add the foreign key constraint to rehearsals.setlist_id
    .table('rehearsals', function(table) {
      table.foreign('setlist_id').references('id').inTable('setlists').onDelete('SET NULL');
    });
};

exports.down = function(knex) {
  return knex.schema
    // Remove the foreign key constraint from rehearsals.setlist_id
    .table('rehearsals', function(table) {
      table.dropForeign('setlist_id');
    })
    
    // Drop the rehearsal_equipment table
    .dropTable('rehearsal_equipment');
};