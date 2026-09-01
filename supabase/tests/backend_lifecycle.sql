begin;

create extension if not exists pgtap with schema extensions;
select plan(21);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  '10000000-0000-0000-0000-000000000001',
  'authenticated', 'authenticated', 'sql-test@applyo.local', '', now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"display_name":"Pengguna Uji"}'::jsonb,
  now(), now(), '', '', '', ''
);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  '20000000-0000-0000-0000-000000000002',
  'authenticated', 'authenticated', 'sql-test-b@applyo.local', '', now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"display_name":"Pengguna B"}'::jsonb,
  now(), now(), '', '', '', ''
);

select is(
  (select count(*)::integer from public.profiles
   where id = '10000000-0000-0000-0000-000000000001'),
  1,
  'onboarding creates a profile'
);
select is(
  (select display_name from public.profiles
   where id = '10000000-0000-0000-0000-000000000001'),
  'Pengguna Uji',
  'onboarding copies the display name'
);
select is(
  (select count(*)::integer from public.user_preferences
   where user_id = '10000000-0000-0000-0000-000000000001'),
  1,
  'onboarding creates preferences'
);
select is(
  (select count(*)::integer from public.pipeline_stages
   where user_id = '10000000-0000-0000-0000-000000000001'),
  10,
  'onboarding creates ten stages'
);
select is(
  (select name from public.pipeline_stages
   where user_id = '10000000-0000-0000-0000-000000000001'
     and system_key = 'interview'),
  'Wawancara',
  'stages use Indonesian display names and English system keys'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

create temporary table test_ids (application_id uuid primary key);
insert into test_ids
select id from public.create_application(
  'PT Contoh',
  'Backend Engineer',
  (select id from public.pipeline_stages where system_key = 'wishlist')
);

select is(
  (select count(*)::integer from public.applications),
  1,
  'create_application inserts an owned application'
);
select is(
  (select count(*)::integer from public.application_history
   where event_type = 'application_created'),
  1,
  'create_application atomically writes initial history'
);

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '20000000-0000-0000-0000-000000000002', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

select is((select count(*)::integer from public.applications), 0, 'user B cannot read user A application');
select is((select count(*)::integer from public.application_history), 0, 'user B cannot read user A history');
select throws_ok(
  format('select public.move_application(%L::uuid, %L::uuid, null, null)',
    (select application_id from test_ids),
    (select id from public.pipeline_stages where system_key = 'interview')),
  'P0002', 'Application not found', 'user B cannot move user A application'
);
update public.applications set company = 'Disusupi' where id = (select application_id from test_ids);
select is((select count(*)::integer from public.applications where company = 'Disusupi'), 0, 'user B cannot update user A application');
delete from public.applications where id = (select application_id from test_ids);
select is((select count(*)::integer from public.applications), 0, 'user B cannot delete or observe user A application');

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
select is((select company from public.applications where id = (select application_id from test_ids)), 'PT Contoh', 'user A application remains unchanged');

select public.move_application(
  (select application_id from test_ids),
  (select id from public.pipeline_stages where system_key = 'interview'),
  null,
  null
);

select is(
  (select s.system_key from public.applications a
   join public.pipeline_stages s on s.id = a.stage_id),
  'interview',
  'move_application changes the current stage'
);
select is(
  (select count(*)::integer from public.application_history
   where event_type = 'stage_changed'),
  1,
  'cross-stage move writes history'
);

select public.move_application(
  (select application_id from test_ids),
  (select id from public.pipeline_stages where system_key = 'interview'),
  null,
  null
);
select is(
  (select count(*)::integer from public.application_history
   where event_type = 'stage_changed'),
  1,
  'same-stage reorder does not write stage history'
);

select public.close_application(
  (select application_id from test_ids),
  (select id from public.pipeline_stages where system_key = 'ghosted'),
  null,
  'Explicitly selected by the user'
);
select ok(
  (select closed_at is not null from public.applications),
  'close_application sets closed_at'
);
select is(
  (select outcome_key from public.application_outcomes where reopened_at is null),
  'ghosted',
  'close_application records the user-selected outcome'
);
select is(
  (select count(*)::integer from public.application_history
   where event_type = 'application_closed'),
  1,
  'close_application writes closure history'
);

select public.reopen_application(
  (select application_id from test_ids),
  (select id from public.pipeline_stages where system_key = 'screening')
);
select ok(
  (select closed_at is null from public.applications),
  'reopen_application clears closed_at'
);
select ok(
  (select reopened_at is not null from public.application_outcomes),
  'reopen_application closes the active outcome cycle'
);

select * from finish();
rollback;
