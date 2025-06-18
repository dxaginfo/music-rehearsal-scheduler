import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Users table
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('role').defaultTo('user');
    table.string('phone').nullable();
    table.string('profile_image').nullable();
    table.text('bio').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Bands table
  await knex.schema.createTable('bands', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.text('description').nullable();
    table.string('genre').nullable();
    table.string('logo_image').nullable();
    table.string('website').nullable();
    table.uuid('created_by').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Band members table (many-to-many relationship between users and bands)
  await knex.schema.createTable('band_members', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('band_id').notNullable().references('id').inTable('bands').onDelete('CASCADE');
    table.string('role').notNullable().defaultTo('member'); // admin, member
    table.string('instrument').nullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamp('joined_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.unique(['user_id', 'band_id']);
  });

  // Venues table
  await knex.schema.createTable('venues', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.text('address').nullable();
    table.string('city').nullable();
    table.string('state').nullable();
    table.string('zip_code').nullable();
    table.string('country').nullable();
    table.string('phone').nullable();
    table.string('email').nullable();
    table.string('website').nullable();
    table.decimal('latitude', 10, 6).nullable();
    table.decimal('longitude', 10, 6).nullable();
    table.text('notes').nullable();
    table.uuid('created_by').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Rehearsals table
  await knex.schema.createTable('rehearsals', (table) => {
    table.uuid('id').primary();
    table.uuid('band_id').notNullable().references('id').inTable('bands').onDelete('CASCADE');
    table.uuid('venue_id').nullable().references('id').inTable('venues').onDelete('SET NULL');
    table.string('title').notNullable();
    table.text('description').nullable();
    table.timestamp('start_time').notNullable();
    table.timestamp('end_time').notNullable();
    table.boolean('is_recurring').defaultTo(false);
    table.string('recurrence_pattern').nullable();
    table.text('location_details').nullable();
    table.string('status').defaultTo('scheduled'); // scheduled, completed, cancelled
    table.uuid('created_by').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Rehearsal attendees table
  await knex.schema.createTable('rehearsal_attendees', (table) => {
    table.uuid('id').primary();
    table.uuid('rehearsal_id').notNullable().references('id').inTable('rehearsals').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('attendance_status').defaultTo('pending'); // pending, confirmed, declined
    table.text('notes').nullable();
    table.timestamp('response_time').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.unique(['rehearsal_id', 'user_id']);
  });

  // Setlists table
  await knex.schema.createTable('setlists', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.text('description').nullable();
    table.uuid('band_id').notNullable().references('id').inTable('bands').onDelete('CASCADE');
    table.uuid('created_by').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Songs table
  await knex.schema.createTable('songs', (table) => {
    table.uuid('id').primary();
    table.string('title').notNullable();
    table.string('artist').nullable();
    table.string('key').nullable();
    table.integer('duration_seconds').nullable();
    table.string('tempo').nullable();
    table.text('lyrics').nullable();
    table.text('notes').nullable();
    table.uuid('band_id').notNullable().references('id').inTable('bands').onDelete('CASCADE');
    table.uuid('created_by').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Setlist songs (many-to-many relationship between setlists and songs)
  await knex.schema.createTable('setlist_songs', (table) => {
    table.uuid('id').primary();
    table.uuid('setlist_id').notNullable().references('id').inTable('setlists').onDelete('CASCADE');
    table.uuid('song_id').notNullable().references('id').inTable('songs').onDelete('CASCADE');
    table.integer('order_index').notNullable();
    table.text('performance_notes').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.unique(['setlist_id', 'order_index']);
  });

  // Rehearsal setlists (connecting rehearsals to setlists)
  await knex.schema.createTable('rehearsal_setlists', (table) => {
    table.uuid('id').primary();
    table.uuid('rehearsal_id').notNullable().references('id').inTable('rehearsals').onDelete('CASCADE');
    table.uuid('setlist_id').notNullable().references('id').inTable('setlists').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.unique(['rehearsal_id', 'setlist_id']);
  });

  // Equipment table
  await knex.schema.createTable('equipment', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.text('description').nullable();
    table.string('category').nullable();
    table.string('status').defaultTo('available'); // available, in-use, repair, lost
    table.uuid('owned_by').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('band_id').nullable().references('id').inTable('bands').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Rehearsal equipment (connecting rehearsals to equipment)
  await knex.schema.createTable('rehearsal_equipment', (table) => {
    table.uuid('id').primary();
    table.uuid('rehearsal_id').notNullable().references('id').inTable('rehearsals').onDelete('CASCADE');
    table.uuid('equipment_id').notNullable().references('id').inTable('equipment').onDelete('CASCADE');
    table.uuid('assigned_to').nullable().references('id').inTable('users').onDelete('SET NULL');
    table.text('notes').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Password reset table
  await knex.schema.createTable('password_resets', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('token').notNullable().unique();
    table.timestamp('expires_at').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Notifications table
  await knex.schema.createTable('notifications', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('type').notNullable();
    table.text('content').notNullable();
    table.jsonb('data').nullable();
    table.boolean('is_read').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop tables in reverse order
  await knex.schema.dropTableIfExists('notifications');
  await knex.schema.dropTableIfExists('password_resets');
  await knex.schema.dropTableIfExists('rehearsal_equipment');
  await knex.schema.dropTableIfExists('equipment');
  await knex.schema.dropTableIfExists('rehearsal_setlists');
  await knex.schema.dropTableIfExists('setlist_songs');
  await knex.schema.dropTableIfExists('songs');
  await knex.schema.dropTableIfExists('setlists');
  await knex.schema.dropTableIfExists('rehearsal_attendees');
  await knex.schema.dropTableIfExists('rehearsals');
  await knex.schema.dropTableIfExists('venues');
  await knex.schema.dropTableIfExists('band_members');
  await knex.schema.dropTableIfExists('bands');
  await knex.schema.dropTableIfExists('users');
}