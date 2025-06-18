import { Knex } from 'knex';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('password_resets').del();
  await knex('notifications').del();
  await knex('rehearsal_equipment').del();
  await knex('equipment').del();
  await knex('rehearsal_setlists').del();
  await knex('setlist_songs').del();
  await knex('songs').del();
  await knex('setlists').del();
  await knex('rehearsal_attendees').del();
  await knex('rehearsals').del();
  await knex('venues').del();
  await knex('band_members').del();
  await knex('bands').del();
  await knex('users').del();

  // Create test users
  const password = await bcrypt.hash('Test@123', 10);
  
  const users = [
    {
      id: uuidv4(),
      email: 'admin@example.com',
      password,
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      email: 'john@example.com',
      password,
      first_name: 'John',
      last_name: 'Doe',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      email: 'jane@example.com',
      password,
      first_name: 'Jane',
      last_name: 'Smith',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      email: 'dave@example.com',
      password,
      first_name: 'Dave',
      last_name: 'Wilson',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      email: 'sarah@example.com',
      password,
      first_name: 'Sarah',
      last_name: 'Johnson',
      role: 'user',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  // Insert users
  await knex('users').insert(users);
  
  // Create bands
  const bands = [
    {
      id: uuidv4(),
      name: 'The Resonators',
      description: 'An indie rock band focusing on original compositions with jazz influences.',
      genre: 'Indie Rock',
      created_by: users[1].id, // John
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Acoustic Ensemble',
      description: 'A folk music group specializing in acoustic performances of traditional songs.',
      genre: 'Folk',
      created_by: users[2].id, // Jane
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  // Insert bands
  await knex('bands').insert(bands);

  // Create band members
  const bandMembers = [
    {
      id: uuidv4(),
      user_id: users[1].id, // John
      band_id: bands[0].id, // The Resonators
      role: 'admin',
      instrument: 'Guitar',
      joined_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      user_id: users[2].id, // Jane
      band_id: bands[0].id, // The Resonators
      role: 'member',
      instrument: 'Bass',
      joined_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      user_id: users[3].id, // Dave
      band_id: bands[0].id, // The Resonators
      role: 'member',
      instrument: 'Drums',
      joined_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      user_id: users[2].id, // Jane
      band_id: bands[1].id, // Acoustic Ensemble
      role: 'admin',
      instrument: 'Vocals',
      joined_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      user_id: users[4].id, // Sarah
      band_id: bands[1].id, // Acoustic Ensemble
      role: 'member',
      instrument: 'Violin',
      joined_at: new Date(),
      updated_at: new Date(),
    },
  ];

  // Insert band members
  await knex('band_members').insert(bandMembers);

  // Create venues
  const venues = [
    {
      id: uuidv4(),
      name: 'Downtown Studio',
      address: '123 Main St',
      city: 'Austin',
      state: 'TX',
      zip_code: '78701',
      country: 'USA',
      created_by: users[1].id, // John
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Community Music Center',
      address: '456 Oak Ave',
      city: 'Austin',
      state: 'TX',
      zip_code: '78704',
      country: 'USA',
      created_by: users[2].id, // Jane
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  // Insert venues
  await knex('venues').insert(venues);

  // Create rehearsals
  const now = new Date();
  const rehearsals = [
    {
      id: uuidv4(),
      band_id: bands[0].id, // The Resonators
      venue_id: venues[0].id, // Downtown Studio
      title: 'Weekly Practice Session',
      description: 'Focus on new material and tightening up the bridge sections.',
      start_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 18, 0), // 2 days from now, 6 PM
      end_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 21, 0), // 2 days from now, 9 PM
      is_recurring: true,
      recurrence_pattern: 'weekly',
      status: 'scheduled',
      created_by: users[1].id, // John
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      band_id: bands[1].id, // Acoustic Ensemble
      venue_id: venues[1].id, // Community Music Center
      title: 'Pre-show Rehearsal',
      description: 'Final rehearsal before weekend show. Run through the full setlist twice.',
      start_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 15, 0), // 1 day from now, 3 PM
      end_time: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 18, 0), // 1 day from now, 6 PM
      is_recurring: false,
      status: 'scheduled',
      created_by: users[2].id, // Jane
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  // Insert rehearsals
  await knex('rehearsals').insert(rehearsals);

  // Create rehearsal attendees
  const rehearsalAttendees = [
    {
      id: uuidv4(),
      rehearsal_id: rehearsals[0].id,
      user_id: users[1].id, // John
      attendance_status: 'confirmed',
      response_time: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      rehearsal_id: rehearsals[0].id,
      user_id: users[2].id, // Jane
      attendance_status: 'confirmed',
      response_time: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      rehearsal_id: rehearsals[0].id,
      user_id: users[3].id, // Dave
      attendance_status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      rehearsal_id: rehearsals[1].id,
      user_id: users[2].id, // Jane
      attendance_status: 'confirmed',
      response_time: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      rehearsal_id: rehearsals[1].id,
      user_id: users[4].id, // Sarah
      attendance_status: 'confirmed',
      response_time: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  // Insert rehearsal attendees
  await knex('rehearsal_attendees').insert(rehearsalAttendees);

  // Create setlists
  const setlists = [
    {
      id: uuidv4(),
      name: 'Spring Tour 2025',
      description: 'Songs for the upcoming spring tour',
      band_id: bands[0].id, // The Resonators
      created_by: users[1].id, // John
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Coffee House Set',
      description: 'Acoustic arrangements for intimate venues',
      band_id: bands[1].id, // Acoustic Ensemble
      created_by: users[2].id, // Jane
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  // Insert setlists
  await knex('setlists').insert(setlists);

  // Create songs
  const songs = [
    {
      id: uuidv4(),
      title: 'Midnight Train',
      artist: 'The Resonators',
      key: 'G',
      duration_seconds: 240, // 4 minutes
      tempo: '120 BPM',
      band_id: bands[0].id, // The Resonators
      created_by: users[1].id, // John
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      title: 'City Lights',
      artist: 'The Resonators',
      key: 'A minor',
      duration_seconds: 210, // 3.5 minutes
      tempo: '110 BPM',
      band_id: bands[0].id, // The Resonators
      created_by: users[1].id, // John
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      title: 'Mountain High',
      artist: 'Acoustic Ensemble',
      key: 'D',
      duration_seconds: 180, // 3 minutes
      tempo: '90 BPM',
      band_id: bands[1].id, // Acoustic Ensemble
      created_by: users[2].id, // Jane
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      title: 'River Flow',
      artist: 'Acoustic Ensemble',
      key: 'C',
      duration_seconds: 195, // 3.25 minutes
      tempo: '95 BPM',
      band_id: bands[1].id, // Acoustic Ensemble
      created_by: users[2].id, // Jane
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  // Insert songs
  await knex('songs').insert(songs);

  // Create setlist songs
  const setlistSongs = [
    {
      id: uuidv4(),
      setlist_id: setlists[0].id,
      song_id: songs[0].id,
      order_index: 0,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      setlist_id: setlists[0].id,
      song_id: songs[1].id,
      order_index: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      setlist_id: setlists[1].id,
      song_id: songs[2].id,
      order_index: 0,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      setlist_id: setlists[1].id,
      song_id: songs[3].id,
      order_index: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  // Insert setlist songs
  await knex('setlist_songs').insert(setlistSongs);

  // Connect rehearsals to setlists
  const rehearsalSetlists = [
    {
      id: uuidv4(),
      rehearsal_id: rehearsals[0].id,
      setlist_id: setlists[0].id,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      rehearsal_id: rehearsals[1].id,
      setlist_id: setlists[1].id,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  // Insert rehearsal setlists
  await knex('rehearsal_setlists').insert(rehearsalSetlists);

  // Create equipment
  const equipment = [
    {
      id: uuidv4(),
      name: 'Gibson Les Paul',
      description: 'Electric guitar, sunburst finish',
      category: 'Instrument',
      status: 'available',
      owned_by: users[1].id, // John
      band_id: bands[0].id, // The Resonators
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Roland Jazz Chorus Amp',
      description: 'JC-120 amplifier',
      category: 'Amplifier',
      status: 'available',
      owned_by: users[1].id, // John
      band_id: bands[0].id, // The Resonators
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Taylor Acoustic',
      description: 'Acoustic guitar, model 214ce',
      category: 'Instrument',
      status: 'available',
      owned_by: users[2].id, // Jane
      band_id: bands[1].id, // Acoustic Ensemble
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  // Insert equipment
  await knex('equipment').insert(equipment);

  // Create rehearsal equipment
  const rehearsalEquipment = [
    {
      id: uuidv4(),
      rehearsal_id: rehearsals[0].id,
      equipment_id: equipment[0].id,
      assigned_to: users[1].id, // John
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      rehearsal_id: rehearsals[0].id,
      equipment_id: equipment[1].id,
      assigned_to: users[1].id, // John
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      rehearsal_id: rehearsals[1].id,
      equipment_id: equipment[2].id,
      assigned_to: users[2].id, // Jane
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  // Insert rehearsal equipment
  await knex('rehearsal_equipment').insert(rehearsalEquipment);
}