/**
 * Notifications table migration
 */
exports.up = function(knex) {
  return knex.schema
    // Create notifications table
    .createTable('notifications', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
      table.string('type').notNullable(); // rehearsal_created, rehearsal_changed, rehearsal_reminder, etc.
      table.string('title').notNullable();
      table.text('message').notNullable();
      table.jsonb('data').defaultTo('{}');
      table.boolean('is_read').defaultTo(false);
      table.timestamp('read_at');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      
      table.index('user_id');
      table.index(['user_id', 'is_read']);
      table.index('type');
      table.index('created_at');
    })
    
    // Create notification_preferences table
    .createTable('notification_preferences', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
      table.boolean('email_notifications').defaultTo(true);
      table.boolean('push_notifications').defaultTo(true);
      table.boolean('rehearsal_reminders').defaultTo(true);
      table.integer('rehearsal_reminder_hours').defaultTo(24);
      table.boolean('band_updates').defaultTo(true);
      table.boolean('band_message_notifications').defaultTo(true);
      table.boolean('setlist_updates').defaultTo(true);
      table.boolean('mute_all').defaultTo(false);
      table.time('quiet_hours_start');
      table.time('quiet_hours_end');
      table.boolean('use_quiet_hours').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      
      // Each user can only have one preferences record
      table.unique(['user_id']);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('notification_preferences')
    .dropTable('notifications');
};