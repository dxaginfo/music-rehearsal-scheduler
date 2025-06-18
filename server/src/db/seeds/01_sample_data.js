const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/**
 * Seed database with sample data for development and testing
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('notifications').del();
  await knex('notification_preferences').del();
  await knex('availability_exceptions').del();
  await knex('recurring_availability').del();
  await knex('user_availability').del();
  await knex('rehearsal_equipment').del();
  await knex('equipment').del();
  await knex('setlist_songs').del();
  await knex('song_notes').del();
  await knex('song_attachments').del();
  await knex('songs').del();
  await knex('setlists').del();
  await knex('rehearsal_attendees').del();
  await knex('rehearsals').del();
  await knex('band_members').del();
  await knex('bands').del();
  await knex('venues').del();
  await knex('users').del();
  
  // Create test users
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const users = [
    {
      id: uuidv4(),
      email: 'john@example.com',
      password_hash: passwordHash,
      first_name: 'John',
      last_name: 'Doe',
      timezone: 'America/New_York',
      email_verified: true
    },
    {
      id: uuidv4(),
      email: 'jane@example.com',
      password_hash: passwordHash,
      first_name: 'Jane',
      last_name: 'Smith',
      timezone: 'America/Los_Angeles',
      email_verified: true
    },
    {
      id: uuidv4(),
      email: 'mike@example.com',
      password_hash: passwordHash,
      first_name: 'Mike',
      last_name: 'Johnson',
      timezone: 'Europe/London',
      email_verified: true
    },
    {
      id: uuidv4(),
      email: 'sarah@example.com',
      password_hash: passwordHash,
      first_name: 'Sarah',
      last_name: 'Williams',
      timezone: 'Australia/Sydney',
      email_verified: true
    }
  ];
  
  await knex('users').insert(users);
  
  // Create bands
  const bands = [
    {
      id: uuidv4(),
      name: 'The Rockers',
      description: 'Classic rock cover band',
      genre: 'Rock',
      created_by: users[0].id
    },
    {
      id: uuidv4(),
      name: 'Jazz Ensemble',
      description: 'Modern jazz group',
      genre: 'Jazz',
      created_by: users[1].id
    }
  ];
  
  await knex('bands').insert(bands);
  
  // Create band members
  const bandMembers = [
    {
      id: uuidv4(),
      band_id: bands[0].id,
      user_id: users[0].id,
      role: 'admin',
      instruments: 'Guitar, Vocals'
    },
    {
      id: uuidv4(),
      band_id: bands[0].id,
      user_id: users[1].id,
      role: 'member',
      instruments: 'Bass'
    },
    {
      id: uuidv4(),
      band_id: bands[0].id,
      user_id: users[2].id,
      role: 'member',
      instruments: 'Drums'
    },
    {
      id: uuidv4(),
      band_id: bands[1].id,
      user_id: users[1].id,
      role: 'admin',
      instruments: 'Piano'
    },
    {
      id: uuidv4(),
      band_id: bands[1].id,
      user_id: users[3].id,
      role: 'member',
      instruments: 'Saxophone'
    }
  ];
  
  await knex('band_members').insert(bandMembers);
  
  // Create venues
  const venues = [
    {
      id: uuidv4(),
      name: 'Downtown Studios',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      has_pa: true,
      has_backline: true,
      hourly_rate: 45.00,
      user_id: users[0].id
    },
    {
      id: uuidv4(),
      name: 'Westside Rehearsal',
      address: '456 Ocean Ave',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      has_pa: true,
      has_backline: false,
      hourly_rate: 35.00,
      user_id: users[1].id
    }
  ];
  
  await knex('venues').insert(venues);
  
  // Create songs
  const songs = [
    {
      id: uuidv4(),
      band_id: bands[0].id,
      title: 'Highway Star',
      artist: 'Deep Purple',
      key: 'G',
      bpm: 120,
      duration_sec: 360,
      status: 'active',
      created_by: users[0].id
    },
    {
      id: uuidv4(),
      band_id: bands[0].id,
      title: 'Smoke on the Water',
      artist: 'Deep Purple',
      key: 'G minor',
      bpm: 112,
      duration_sec: 340,
      status: 'active',
      created_by: users[0].id
    },
    {
      id: uuidv4(),
      band_id: bands[1].id,
      title: 'Take Five',
      artist: 'Dave Brubeck',
      key: 'Eb minor',
      bpm: 172,
      duration_sec: 320,
      status: 'active',
      created_by: users[1].id
    }
  ];
  
  await knex('songs').insert(songs);
  
  // Create setlists
  const setlists = [
    {
      id: uuidv4(),
      band_id: bands[0].id,
      name: 'Rock Classics Set',
      description: 'Our standard 45-minute set',
      duration_min: 45,
      created_by: users[0].id
    },
    {
      id: uuidv4(),
      band_id: bands[1].id,
      name: 'Jazz Standards',
      description: 'Jazz standards for club gigs',
      duration_min: 60,
      created_by: users[1].id
    }
  ];
  
  await knex('setlists').insert(setlists);
  
  // Add songs to setlists
  const setlistSongs = [
    {
      id: uuidv4(),
      setlist_id: setlists[0].id,
      song_id: songs[0].id,
      order: 1,
      duration_sec: 360
    },
    {
      id: uuidv4(),
      setlist_id: setlists[0].id,
      song_id: songs[1].id,
      order: 2,
      duration_sec: 340
    },
    {
      id: uuidv4(),
      setlist_id: setlists[1].id,
      song_id: songs[2].id,
      order: 1,
      duration_sec: 320
    }
  ];
  
  await knex('setlist_songs').insert(setlistSongs);
  
  // Create rehearsals
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const rehearsals = [
    {
      id: uuidv4(),
      band_id: bands[0].id,
      venue_id: venues[0].id,
      title: 'Weekly Practice',
      start_time: tomorrow.toISOString(),
      end_time: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      description: 'Focus on new material',
      status: 'scheduled',
      created_by: users[0].id,
      setlist_id: setlists[0].id,
      cost: 135.00
    },
    {
      id: uuidv4(),
      band_id: bands[1].id,
      venue_id: venues[1].id,
      title: 'Jazz Rehearsal',
      start_time: nextWeek.toISOString(),
      end_time: new Date(nextWeek.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      description: 'Prepare for weekend gig',
      status: 'scheduled',
      created_by: users[1].id,
      setlist_id: setlists[1].id,
      cost: 70.00
    }
  ];
  
  await knex('rehearsals').insert(rehearsals);
  
  // Create rehearsal attendees
  const rehearsalAttendees = [
    {
      id: uuidv4(),
      rehearsal_id: rehearsals[0].id,
      user_id: users[0].id,
      status: 'confirmed'
    },
    {
      id: uuidv4(),
      rehearsal_id: rehearsals[0].id,
      user_id: users[1].id,
      status: 'confirmed'
    },
    {
      id: uuidv4(),
      rehearsal_id: rehearsals[0].id,
      user_id: users[2].id,
      status: 'pending'
    },
    {
      id: uuidv4(),
      rehearsal_id: rehearsals[1].id,
      user_id: users[1].id,
      status: 'confirmed'
    },
    {
      id: uuidv4(),
      rehearsal_id: rehearsals[1].id,
      user_id: users[3].id,
      status: 'confirmed'
    }
  ];
  
  await knex('rehearsal_attendees').insert(rehearsalAttendees);
  
  // Create user availability (recurring)
  const recurringAvailability = [
    {
      id: uuidv4(),
      user_id: users[0].id,
      day_of_week: 1, // Monday
      start_time: '18:00',
      end_time: '22:00',
      is_available: true
    },
    {
      id: uuidv4(),
      user_id: users[0].id,
      day_of_week: 3, // Wednesday
      start_time: '19:00',
      end_time: '23:00',
      is_available: true
    },
    {
      id: uuidv4(),
      user_id: users[1].id,
      day_of_week: 2, // Tuesday
      start_time: '18:00',
      end_time: '21:00',
      is_available: true
    },
    {
      id: uuidv4(),
      user_id: users[1].id,
      day_of_week: 4, // Thursday
      start_time: '17:00',
      end_time: '22:00',
      is_available: true
    }
  ];
  
  await knex('recurring_availability').insert(recurringAvailability);
};