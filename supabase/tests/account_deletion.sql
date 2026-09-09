begin;

create extension if not exists pgtap with schema extensions;
select plan(14);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  '30000000-0000-0000-0000-000000000003',
  'authenticated', 'authenticated', 'sql-test-c@applyo.local', '', now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"display_name":"Pengguna C"}'::jsonb,
  now(), now(), '', '', '', ''
);

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  '40000000-0000-0000-0000-000000000004',
  'authenticated', 'authenticated', 'sql-test-d@applyo.local', '', now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"display_name":"Pengguna D"}'::jsonb,
  now(), now(), '', '', '', ''
);

insert into public.applications (id, user_id, stage_id, company, position, sort_order)
select '31000000-0000-0000-0000-000000000031',
  '30000000-0000-0000-0000-000000000003', id, 'PT Hapus', 'Tester', 1024
from public.pipeline_stages
where user_id = '30000000-0000-0000-0000-000000000003' and system_key = 'wishlist';

insert into public.application_history (user_id, application_id, event_type, to_stage_id)
select '30000000-0000-0000-0000-000000000003',
  '31000000-0000-0000-0000-000000000031', 'application_created', id
from public.pipeline_stages
where user_id = '30000000-0000-0000-0000-000000000003' and system_key = 'wishlist';

insert into public.recruitment_events
  (user_id, application_id, category, subtype, title, scheduled_at)
values
  ('30000000-0000-0000-0000-000000000003',
   '31000000-0000-0000-0000-000000000031',
   'interview', 'hr', 'Wawancara Hapus', now() + interval '1 day');

insert into public.application_offers (user_id, application_id, salary, currency)
values
  ('30000000-0000-0000-0000-000000000003',
   '31000000-0000-0000-0000-000000000031', 10000000, 'IDR');

insert into public.application_outcomes
  (user_id, application_id, outcome_key, from_stage_id, outcome_stage_id)
select '30000000-0000-0000-0000-000000000003',
  '31000000-0000-0000-0000-000000000031', 'ghosted', w.id, g.id
from public.pipeline_stages w
join public.pipeline_stages g
  on g.user_id = '30000000-0000-0000-0000-000000000003' and g.system_key = 'ghosted'
where w.user_id = '30000000-0000-0000-0000-000000000003' and w.system_key = 'wishlist';

insert into public.pipeline_stages
  (user_id, name, slug, system_key, color_key, position, is_closed, is_visible)
values
  ('30000000-0000-0000-0000-000000000003',
   'Kustom', 'kustom', null, 'blue', 10, false, true);

select throws_ok(
  $$delete from public.pipeline_stages
    where user_id = '30000000-0000-0000-0000-000000000003' and system_key = 'wishlist'$$,
  '42501',
  'System pipeline stages cannot be deleted',
  'direct deletion of a system stage is rejected while the owner exists'
);

delete from public.pipeline_stages
where user_id = '30000000-0000-0000-0000-000000000003' and system_key is null;

select is(
  (select count(*)::integer from public.pipeline_stages
   where user_id = '30000000-0000-0000-0000-000000000003' and system_key is null),
  0,
  'a custom stage can still be deleted directly'
);

select lives_ok(
  $$delete from auth.users where id = '30000000-0000-0000-0000-000000000003'$$,
  'deleting the auth user cascades instead of raising'
);

select is_empty(
  $$select 1 from auth.users where id = '30000000-0000-0000-0000-000000000003'$$,
  'auth user row is removed'
);

select is_empty(
  $$select 1 from public.profiles where id = '30000000-0000-0000-0000-000000000003'$$,
  'profile is removed by cascade'
);

select is_empty(
  $$select 1 from public.user_preferences where user_id = '30000000-0000-0000-0000-000000000003'$$,
  'preferences are removed by cascade'
);

select is_empty(
  $$select 1 from public.pipeline_stages where user_id = '30000000-0000-0000-0000-000000000003'$$,
  'all pipeline stages including system stages are removed by cascade'
);

select is_empty(
  $$select 1 from public.applications where user_id = '30000000-0000-0000-0000-000000000003'$$,
  'applications are removed by cascade'
);

select is_empty(
  $$select 1 from public.application_history where user_id = '30000000-0000-0000-0000-000000000003'$$,
  'history is removed by cascade'
);

select is_empty(
  $$select 1 from public.recruitment_events where user_id = '30000000-0000-0000-0000-000000000003'$$,
  'recruitment events are removed by cascade'
);

select is_empty(
  $$select 1 from public.application_offers where user_id = '30000000-0000-0000-0000-000000000003'$$,
  'offers are removed by cascade'
);

select is_empty(
  $$select 1 from public.application_outcomes where user_id = '30000000-0000-0000-0000-000000000003'$$,
  'outcomes are removed by cascade'
);

select is(
  (select count(*)::integer from public.pipeline_stages
   where user_id = '40000000-0000-0000-0000-000000000004'),
  10,
  'another user keeps all ten stages'
);

select is(
  (select count(*)::integer from public.profiles
   where id = '40000000-0000-0000-0000-000000000004'),
  1,
  'another user profile is untouched'
);

select * from finish();
rollback;
