/**
 * Songs and Setlists tables migration
 */
exports.up = function(knex) {
  return knex.schema
    // Create songs table
    .createTable('songs', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('band_id').references('id').inTable('bands').onDelete('CASCADE').notNullable();
      table.string('title').notNullable();
      table.string('artist');
      table.string('key');
      table.integer('bpm');
      table.integer('duration_sec');
      table.text('lyrics');
      table.text('chord_chart');
      table.text('notes');
      table.string('status').defaultTo('active'); // active, learning, archived
      table.string('difficulty').defaultTo('medium'); // easy, medium, hard
      table.string('reference_url');
      table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.index('band_id');
      table.index(['band_id', 'status']);
      table.index('title');
    })
    
    // Create song_attachments table
    .createTable('song_attachments', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('song_id').references('id').inTable('songs').onDelete('CASCADE').notNullable();
      table.string('name').notNullable();
      table.string('file_url').notNullable();
      table.string('file_type');
      table.text('description');
      table.uuid('uploaded_by').references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      
      table.index('song_id');
    })
    
    // Create song_notes table for additional notes/comments
    .createTable('song_notes', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('song_id').references('id').inTable('songs').onDelete('CASCADE').notNullable();
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
      table.text('content').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.index('song_id');
      table.index('user_id');
    })
    
    // Create setlists table
    .createTable('setlists', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('band_id').references('id').inTable('bands').onDelete('CASCADE').notNullable();
      table.string('name').notNullable();
      table.text('description');
      table.boolean('is_template').defaultTo(false);
      table.integer('duration_min');
      table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      table.index('band_id');
      table.index('name');
    })
    
    // Create setlist_songs table (junction table with order)
    .createTable('setlist_songs', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('setlist_id').references('id').inTable('setlists').onDelete('CASCADE').notNullable();
      table.uuid('song_id').references('id').inTable('songs').onDelete('CASCADE').notNullable();
      table.integer('order').notNullable();
      table.integer('duration_sec');
      table.text('notes');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      // Each song can only appear once in a setlist
      table.unique(['setlist_id', 'song_id']);
      // Make sure order is unique within a setlist
      table.unique(['setlist_id', 'order']);
      
      table.index('setlist_id');
      table.index('song_id');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('setlist_songs')
    .dropTable('setlists')
    .dropTable('song_notes')
    .dropTable('song_attachments')
    .dropTable('songs');
};