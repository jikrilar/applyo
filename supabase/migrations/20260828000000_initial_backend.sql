begin;

create extension if not exists pgcrypto with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_check
    check (display_name is null or length(btrim(display_name)) between 1 and 120)
);

create table public.user_preferences (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  currency text not null default 'IDR',
  date_format text not null default 'DD MMM YYYY',
  timezone text not null default 'Asia/Jakarta',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_preferences_currency_check check (currency ~ '^[A-Z]{3}$'),
  constraint user_preferences_date_format_check check (length(btrim(date_format)) between 1 and 40),
  constraint user_preferences_timezone_check check (length(btrim(timezone)) between 1 and 100)
);

create table public.pipeline_stages (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null,
  system_key text,
  color_key text not null,
  position integer not null,
  is_closed boolean not null default false,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pipeline_stages_owner_id_unique unique (user_id, id),
  constraint pipeline_stages_name_check check (length(btrim(name)) between 1 and 80),
  constraint pipeline_stages_slug_check check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint pipeline_stages_system_key_check check (
    system_key is null or system_key in (
      'wishlist', 'applied', 'screening', 'interview', 'assessment',
      'offer', 'hired', 'rejected', 'withdrawn', 'ghosted'
    )
  ),
  constraint pipeline_stages_color_key_check check (color_key ~ '^[a-z][a-z0-9_-]{0,39}$'),
  constraint pipeline_stages_position_check check (position >= 0),
  constraint pipeline_stages_user_slug_unique unique (user_id, slug),
  constraint pipeline_stages_user_system_key_unique unique (user_id, system_key),
  constraint pipeline_stages_user_position_unique unique (user_id, position),
  constraint pipeline_stages_closed_semantics_check check (
    (system_key is null and not is_closed)
    or (system_key is not null
      and is_closed = (system_key in ('hired', 'rejected', 'withdrawn', 'ghosted')))
  )
);

create table public.applications (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stage_id uuid not null,
  company text not null,
  position text not null,
  job_url text,
  location text,
  work_arrangement text,
  employment_type text,
  source text,
  applied_at date,
  salary_min numeric(18,2),
  salary_max numeric(18,2),
  currency text,
  job_description text,
  notes text,
  sort_order bigint not null,
  closed_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint applications_owner_id_unique unique (user_id, id),
  constraint applications_owner_stage_fk
    foreign key (user_id, stage_id) references public.pipeline_stages(user_id, id),
  constraint applications_company_check check (length(btrim(company)) between 1 and 200),
  constraint applications_position_check check (length(btrim(position)) between 1 and 200),
  constraint applications_job_url_check check (job_url is null or job_url ~* '^https?://[^[:space:]]+$'),
  constraint applications_work_arrangement_check check (
    work_arrangement is null or work_arrangement in ('onsite', 'hybrid', 'remote')
  ),
  constraint applications_employment_type_check check (
    employment_type is null or employment_type in (
      'full_time', 'part_time', 'contract', 'temporary', 'internship', 'freelance', 'other'
    )
  ),
  constraint applications_salary_min_check check (salary_min is null or salary_min >= 0),
  constraint applications_salary_max_check check (salary_max is null or salary_max >= 0),
  constraint applications_salary_range_check check (
    salary_min is null or salary_max is null or salary_max >= salary_min
  ),
  constraint applications_currency_check check (currency is null or currency ~ '^[A-Z]{3}$')
);

create table public.application_history (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null,
  event_type text not null,
  from_stage_id uuid,
  to_stage_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint application_history_owner_application_fk
    foreign key (user_id, application_id)
    references public.applications(user_id, id) on delete cascade,
  constraint application_history_from_stage_fk
    foreign key (user_id, from_stage_id) references public.pipeline_stages(user_id, id),
  constraint application_history_to_stage_fk
    foreign key (user_id, to_stage_id) references public.pipeline_stages(user_id, id),
  constraint application_history_event_type_check check (event_type in (
    'application_created', 'stage_changed', 'application_closed',
    'application_reopened', 'application_archived', 'application_restored'
  )),
  constraint application_history_metadata_object_check
    check (jsonb_typeof(metadata) = 'object'),
  constraint application_history_stage_shape_check check (
    (event_type = 'application_created' and from_stage_id is null and to_stage_id is not null)
    or (event_type in ('stage_changed', 'application_closed', 'application_reopened')
      and from_stage_id is not null and to_stage_id is not null and from_stage_id <> to_stage_id)
    or (event_type in ('application_archived', 'application_restored')
      and from_stage_id is null and to_stage_id is null)
  )
);

create table public.recruitment_events (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null,
  category text not null,
  subtype text,
  title text not null,
  scheduled_at timestamptz,
  deadline_at timestamptz,
  location text,
  url text,
  notes text,
  status text not null default 'scheduled',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint recruitment_events_owner_id_unique unique (user_id, id),
  constraint recruitment_events_owner_application_fk
    foreign key (user_id, application_id)
    references public.applications(user_id, id) on delete cascade,
  constraint recruitment_events_category_check check (category in (
    'interview', 'assessment', 'recruiter_contact', 'follow_up', 'offer', 'other'
  )),
  constraint recruitment_events_subtype_check check (
    (category = 'interview' and subtype in ('hr', 'user', 'technical', 'final', 'other'))
    or (category = 'assessment' and subtype in (
      'technical_test', 'coding_test', 'psychological_test', 'case_study',
      'take_home', 'medical_checkup', 'other'
    ))
    or (category not in ('interview', 'assessment') and subtype is null)
  ),
  constraint recruitment_events_title_check check (length(btrim(title)) between 1 and 200),
  constraint recruitment_events_url_check check (url is null or url ~* '^https?://[^[:space:]]+$'),
  constraint recruitment_events_status_check check (status in ('scheduled', 'completed', 'cancelled')),
  constraint recruitment_events_completion_check check (
    (status = 'completed' and completed_at is not null)
    or (status <> 'completed' and completed_at is null)
  )
);

create table public.application_offers (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null,
  salary numeric(18,2),
  currency text,
  benefits text,
  start_date date,
  offer_deadline timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint application_offers_owner_id_unique unique (user_id, id),
  constraint application_offers_application_unique unique (application_id),
  constraint application_offers_owner_application_fk
    foreign key (user_id, application_id)
    references public.applications(user_id, id) on delete cascade,
  constraint application_offers_salary_check check (salary is null or salary >= 0),
  constraint application_offers_currency_check check (currency is null or currency ~ '^[A-Z]{3}$')
);

create table public.application_outcomes (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null,
  outcome_key text not null,
  from_stage_id uuid,
  outcome_stage_id uuid not null,
  reason_code text,
  notes text,
  occurred_at timestamptz not null default now(),
  reopened_at timestamptz,
  created_at timestamptz not null default now(),
  constraint application_outcomes_owner_application_fk
    foreign key (user_id, application_id)
    references public.applications(user_id, id) on delete cascade,
  constraint application_outcomes_from_stage_fk
    foreign key (user_id, from_stage_id) references public.pipeline_stages(user_id, id),
  constraint application_outcomes_outcome_stage_fk
    foreign key (user_id, outcome_stage_id) references public.pipeline_stages(user_id, id),
  constraint application_outcomes_key_check
    check (outcome_key in ('hired', 'rejected', 'withdrawn', 'ghosted')),
  constraint application_outcomes_reason_code_check
    check (reason_code is null or reason_code ~ '^[a-z][a-z0-9_]{0,79}$'),
  constraint application_outcomes_reopened_check
    check (reopened_at is null or reopened_at >= occurred_at)
);

create unique index application_outcomes_one_open_cycle_idx
  on public.application_outcomes (application_id) where reopened_at is null;

create index applications_user_idx on public.applications (user_id);
create index applications_user_stage_idx on public.applications (user_id, stage_id);
create index applications_user_archived_idx on public.applications (user_id, archived_at);
create index applications_user_closed_idx on public.applications (user_id, closed_at);
create index applications_board_idx
  on public.applications (user_id, stage_id, sort_order, id) where archived_at is null;
create index applications_user_applied_idx on public.applications (user_id, applied_at);
create index application_history_timeline_idx
  on public.application_history (application_id, occurred_at desc);
create index application_history_user_timeline_idx
  on public.application_history (user_id, occurred_at desc);
create index recruitment_events_application_schedule_idx
  on public.recruitment_events (application_id, scheduled_at);
create index recruitment_events_user_schedule_idx
  on public.recruitment_events (user_id, scheduled_at);
create index recruitment_events_user_deadline_idx
  on public.recruitment_events (user_id, deadline_at);
create index application_outcomes_timeline_idx
  on public.application_outcomes (application_id, occurred_at desc);
create index application_outcomes_user_key_idx
  on public.application_outcomes (user_id, outcome_key);
create index application_offers_user_deadline_idx
  on public.application_offers (user_id, offer_deadline);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger user_preferences_set_updated_at before update on public.user_preferences
for each row execute function public.set_updated_at();
create trigger pipeline_stages_set_updated_at before update on public.pipeline_stages
for each row execute function public.set_updated_at();
create trigger applications_set_updated_at before update on public.applications
for each row execute function public.set_updated_at();
create trigger recruitment_events_set_updated_at before update on public.recruitment_events
for each row execute function public.set_updated_at();
create trigger application_offers_set_updated_at before update on public.application_offers
for each row execute function public.set_updated_at();

create or replace function public.protect_system_pipeline_stage()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.system_key is not null then
    raise exception using errcode = '42501', message = 'System pipeline stages cannot be deleted';
  end if;
  return old;
end;
$$;

create trigger pipeline_stages_protect_system_stage
before delete on public.pipeline_stages
for each row execute function public.protect_system_pipeline_stage();

create or replace function public.record_application_archive_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.archived_at is null and new.archived_at is not null then
    insert into public.application_history
      (user_id, application_id, event_type, occurred_at)
    values (new.user_id, new.id, 'application_archived', new.archived_at);
  elsif old.archived_at is not null and new.archived_at is null then
    insert into public.application_history
      (user_id, application_id, event_type, occurred_at)
    values (new.user_id, new.id, 'application_restored', now());
  end if;
  return new;
end;
$$;

create trigger applications_record_archive_change
after update of archived_at on public.applications
for each row
when (old.archived_at is distinct from new.archived_at)
execute function public.record_application_archive_change();

create or replace function public.validate_preference_timezone()
returns trigger
language plpgsql
stable
set search_path = ''
as $$
begin
  if not exists (
    select 1 from pg_catalog.pg_timezone_names where name = new.timezone
  ) then
    raise exception using errcode = '22023', message = 'Invalid IANA timezone';
  end if;
  return new;
end;
$$;

create trigger user_preferences_validate_timezone
before insert or update of timezone on public.user_preferences
for each row execute function public.validate_preference_timezone();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_display_name text;
begin
  v_display_name := nullif(btrim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), '');

  insert into public.profiles (id, display_name)
  values (new.id, left(v_display_name, 120));

  insert into public.user_preferences (user_id)
  values (new.id);

  insert into public.pipeline_stages
    (user_id, name, slug, system_key, color_key, position, is_closed, is_visible)
  values
    (new.id, 'Incaran',       'incaran',       'wishlist',   'wishlist',   0, false, true),
    (new.id, 'Dilamar',       'dilamar',       'applied',    'applied',    1, false, true),
    (new.id, 'Seleksi Awal',  'seleksi-awal',  'screening',  'screening',  2, false, true),
    (new.id, 'Wawancara',     'wawancara',     'interview',  'interview',  3, false, true),
    (new.id, 'Asesmen',       'asesmen',       'assessment', 'assessment', 4, false, true),
    (new.id, 'Tawaran',       'tawaran',       'offer',      'offer',      5, false, true),
    (new.id, 'Diterima',      'diterima',      'hired',      'hired',      6, true,  true),
    (new.id, 'Ditolak',       'ditolak',       'rejected',   'rejected',   7, true,  true),
    (new.id, 'Ditarik',       'ditarik',       'withdrawn',  'withdrawn',  8, true,  true),
    (new.id, 'Tanpa Kabar',   'tanpa-kabar',   'ghosted',    'ghosted',    9, true,  true);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.pipeline_stages enable row level security;
alter table public.applications enable row level security;
alter table public.application_history enable row level security;
alter table public.recruitment_events enable row level security;
alter table public.application_offers enable row level security;
alter table public.application_outcomes enable row level security;

-- Policies are operation-specific. WITH CHECK prevents ownership reassignment,
-- while composite FKs additionally prevent child rows crossing a user boundary.
create policy profiles_select_own on public.profiles for select to authenticated
using (id = (select auth.uid()));
create policy profiles_update_own on public.profiles for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy user_preferences_select_own on public.user_preferences for select to authenticated
using (user_id = (select auth.uid()));
create policy user_preferences_update_own on public.user_preferences for update to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy pipeline_stages_select_own on public.pipeline_stages for select to authenticated
using (user_id = (select auth.uid()));
create policy pipeline_stages_insert_own on public.pipeline_stages for insert to authenticated
with check (user_id = (select auth.uid()));
create policy pipeline_stages_update_own on public.pipeline_stages for update to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy pipeline_stages_delete_own on public.pipeline_stages for delete to authenticated
using (user_id = (select auth.uid()));

create policy applications_select_own on public.applications for select to authenticated
using (user_id = (select auth.uid()));
create policy applications_update_own on public.applications for update to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy applications_delete_own on public.applications for delete to authenticated
using (user_id = (select auth.uid()));

-- History is append-only to clients: canonical SECURITY DEFINER RPCs are the
-- only application-facing writers, and no UPDATE or DELETE policy is present.
create policy application_history_select_own on public.application_history for select to authenticated
using (user_id = (select auth.uid()));

create policy recruitment_events_select_own on public.recruitment_events for select to authenticated
using (user_id = (select auth.uid()));
create policy recruitment_events_insert_own on public.recruitment_events for insert to authenticated
with check (
  user_id = (select auth.uid()) and exists (
    select 1 from public.applications a
    where a.id = application_id and a.user_id = (select auth.uid())
  )
);
create policy recruitment_events_update_own on public.recruitment_events for update to authenticated
using (user_id = (select auth.uid()))
with check (
  user_id = (select auth.uid()) and exists (
    select 1 from public.applications a
    where a.id = application_id and a.user_id = (select auth.uid())
  )
);
create policy recruitment_events_delete_own on public.recruitment_events for delete to authenticated
using (user_id = (select auth.uid()));

create policy application_offers_select_own on public.application_offers for select to authenticated
using (user_id = (select auth.uid()));
create policy application_offers_insert_own on public.application_offers for insert to authenticated
with check (
  user_id = (select auth.uid()) and exists (
    select 1 from public.applications a
    where a.id = application_id and a.user_id = (select auth.uid())
  )
);
create policy application_offers_update_own on public.application_offers for update to authenticated
using (user_id = (select auth.uid()))
with check (
  user_id = (select auth.uid()) and exists (
    select 1 from public.applications a
    where a.id = application_id and a.user_id = (select auth.uid())
  )
);
create policy application_offers_delete_own on public.application_offers for delete to authenticated
using (user_id = (select auth.uid()));

-- Outcomes are immutable closure-cycle records, managed only by close/reopen.
create policy application_outcomes_select_own on public.application_outcomes for select to authenticated
using (user_id = (select auth.uid()));

create or replace function public.create_application(
  p_company text,
  p_position text,
  p_stage_id uuid,
  p_job_url text default null,
  p_location text default null,
  p_work_arrangement text default null,
  p_employment_type text default null,
  p_source text default null,
  p_applied_at date default null,
  p_salary_min numeric default null,
  p_salary_max numeric default null,
  p_currency text default null,
  p_job_description text default null,
  p_notes text default null
)
returns public.applications
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_application public.applications;
  v_sort_order bigint;
  v_stage_closed boolean;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  select s.is_closed into v_stage_closed
  from public.pipeline_stages s
  where s.id = p_stage_id and s.user_id = v_user_id
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'Stage not found';
  end if;
  if v_stage_closed then
    raise exception using errcode = '22023', message = 'Use close_application for a closed stage';
  end if;

  select coalesce(max(a.sort_order), 0) + 1024 into v_sort_order
  from public.applications a
  where a.user_id = v_user_id and a.stage_id = p_stage_id;

  insert into public.applications (
    user_id, stage_id, company, position, job_url, location, work_arrangement,
    employment_type, source, applied_at, salary_min, salary_max, currency,
    job_description, notes, sort_order
  ) values (
    v_user_id, p_stage_id, p_company, p_position, p_job_url, p_location,
    p_work_arrangement, p_employment_type, p_source, p_applied_at,
    p_salary_min, p_salary_max, p_currency, p_job_description, p_notes, v_sort_order
  ) returning * into v_application;

  insert into public.application_history
    (user_id, application_id, event_type, to_stage_id, occurred_at)
  values
    (v_user_id, v_application.id, 'application_created', p_stage_id, v_application.created_at);

  return v_application;
end;
$$;

create or replace function public.move_application(
  p_application_id uuid,
  p_destination_stage_id uuid,
  p_before_application_id uuid default null,
  p_after_application_id uuid default null
)
returns public.applications
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_application public.applications;
  v_old_stage_id uuid;
  v_before_order bigint;
  v_after_order bigint;
  v_new_order bigint;
  v_count bigint;
  v_between bigint;
  v_destination_closed boolean;
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;
  if p_before_application_id = p_application_id or p_after_application_id = p_application_id
     or (p_before_application_id is not null and p_before_application_id = p_after_application_id) then
    raise exception using errcode = '22023', message = 'Invalid move neighbors';
  end if;

  select a.* into v_application
  from public.applications a
  where a.id = p_application_id and a.user_id = v_user_id
  for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Application not found';
  end if;
  if v_application.closed_at is not null then
    raise exception using errcode = '22023', message = 'Use reopen_application for a closed application';
  end if;
  v_old_stage_id := v_application.stage_id;

  -- The stage row serializes append/rebalance operations for this column.
  select s.is_closed into v_destination_closed
  from public.pipeline_stages s
  where s.id = p_destination_stage_id and s.user_id = v_user_id
  for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Destination stage not found';
  end if;
  if v_destination_closed then
    raise exception using errcode = '22023', message = 'Use close_application for a closed stage';
  end if;

  perform 1 from public.applications a
  where a.user_id = v_user_id and a.stage_id = p_destination_stage_id
    and a.id <> p_application_id
  order by a.sort_order, a.id
  for update;

  select count(*) into v_count from public.applications a
  where a.user_id = v_user_id and a.stage_id = p_destination_stage_id
    and a.id <> p_application_id;

  if p_before_application_id is null and p_after_application_id is null then
    if v_count <> 0 then
      raise exception using errcode = '40001', message = 'Move neighbors are stale';
    end if;
    v_new_order := 1024;
  else
    if p_before_application_id is not null then
      select a.sort_order into v_before_order from public.applications a
      where a.id = p_before_application_id and a.user_id = v_user_id
        and a.stage_id = p_destination_stage_id and a.id <> p_application_id;
      if not found then
        raise exception using errcode = '40001', message = 'Previous neighbor is stale';
      end if;
    end if;
    if p_after_application_id is not null then
      select a.sort_order into v_after_order from public.applications a
      where a.id = p_after_application_id and a.user_id = v_user_id
        and a.stage_id = p_destination_stage_id and a.id <> p_application_id;
      if not found then
        raise exception using errcode = '40001', message = 'Next neighbor is stale';
      end if;
    end if;

    if p_before_application_id is null then
      select count(*) into v_between from public.applications a
      where a.user_id = v_user_id and a.stage_id = p_destination_stage_id
        and a.id <> p_application_id
        and (a.sort_order, a.id) < (v_after_order, p_after_application_id);
    elsif p_after_application_id is null then
      select count(*) into v_between from public.applications a
      where a.user_id = v_user_id and a.stage_id = p_destination_stage_id
        and a.id <> p_application_id
        and (a.sort_order, a.id) > (v_before_order, p_before_application_id);
    else
      if (v_before_order, p_before_application_id) >= (v_after_order, p_after_application_id) then
        raise exception using errcode = '40001', message = 'Move neighbors are stale';
      end if;
      select count(*) into v_between from public.applications a
      where a.user_id = v_user_id and a.stage_id = p_destination_stage_id
        and a.id <> p_application_id
        and (a.sort_order, a.id) > (v_before_order, p_before_application_id)
        and (a.sort_order, a.id) < (v_after_order, p_after_application_id);
    end if;
    if v_between <> 0 then
      raise exception using errcode = '40001', message = 'Move neighbors are stale';
    end if;

    if p_before_application_id is null and v_after_order > -9223372036854774784 then
      v_new_order := v_after_order - 1024;
    elsif p_after_application_id is null and v_before_order < 9223372036854774783 then
      v_new_order := v_before_order + 1024;
    elsif p_before_application_id is not null and p_after_application_id is not null
          and v_after_order - v_before_order > 1 then
      v_new_order := v_before_order + ((v_after_order - v_before_order) / 2);
    else
      with ordered as (
        select a.id, row_number() over (order by a.sort_order, a.id) * 1024 as new_order
        from public.applications a
        where a.user_id = v_user_id and a.stage_id = p_destination_stage_id
          and a.id <> p_application_id
      )
      update public.applications a set sort_order = ordered.new_order
      from ordered where a.id = ordered.id;

      if p_before_application_id is not null then
        select sort_order into v_before_order from public.applications where id = p_before_application_id;
      end if;
      if p_after_application_id is not null then
        select sort_order into v_after_order from public.applications where id = p_after_application_id;
      end if;
      if p_before_application_id is null then
        v_new_order := v_after_order - 1024;
      elsif p_after_application_id is null then
        v_new_order := v_before_order + 1024;
      else
        v_new_order := v_before_order + ((v_after_order - v_before_order) / 2);
      end if;
    end if;
  end if;

  update public.applications
  set stage_id = p_destination_stage_id, sort_order = v_new_order
  where id = p_application_id
  returning * into v_application;

  if v_old_stage_id <> p_destination_stage_id then
    insert into public.application_history
      (user_id, application_id, event_type, from_stage_id, to_stage_id)
    values
      (v_user_id, p_application_id, 'stage_changed', v_old_stage_id, p_destination_stage_id);
  end if;

  return v_application;
end;
$$;

create or replace function public.close_application(
  p_application_id uuid,
  p_outcome_stage_id uuid,
  p_reason_code text default null,
  p_notes text default null
)
returns public.applications
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_application public.applications;
  v_old_stage_id uuid;
  v_outcome_key text;
  v_sort_order bigint;
  v_now timestamptz := now();
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  select a.* into v_application from public.applications a
  where a.id = p_application_id and a.user_id = v_user_id for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Application not found';
  end if;
  if v_application.closed_at is not null then
    raise exception using errcode = '22023', message = 'Application is already closed';
  end if;
  v_old_stage_id := v_application.stage_id;

  select s.system_key into v_outcome_key from public.pipeline_stages s
  where s.id = p_outcome_stage_id and s.user_id = v_user_id
    and s.is_closed and s.system_key in ('hired', 'rejected', 'withdrawn', 'ghosted')
  for update;
  if not found then
    raise exception using errcode = '22023', message = 'Invalid outcome stage';
  end if;
  if v_old_stage_id = p_outcome_stage_id then
    raise exception using errcode = '22023', message = 'Application is already in the outcome stage';
  end if;

  select coalesce(max(a.sort_order), 0) + 1024 into v_sort_order
  from public.applications a
  where a.user_id = v_user_id and a.stage_id = p_outcome_stage_id;

  update public.applications
  set stage_id = p_outcome_stage_id, sort_order = v_sort_order, closed_at = v_now
  where id = p_application_id returning * into v_application;

  insert into public.application_history
    (user_id, application_id, event_type, from_stage_id, to_stage_id, occurred_at)
  values
    (v_user_id, p_application_id, 'application_closed', v_old_stage_id, p_outcome_stage_id, v_now);

  insert into public.application_outcomes
    (user_id, application_id, outcome_key, from_stage_id, outcome_stage_id,
     reason_code, notes, occurred_at)
  values
    (v_user_id, p_application_id, v_outcome_key, v_old_stage_id,
     p_outcome_stage_id, p_reason_code, p_notes, v_now);

  return v_application;
end;
$$;

create or replace function public.reopen_application(
  p_application_id uuid,
  p_destination_stage_id uuid
)
returns public.applications
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_application public.applications;
  v_old_stage_id uuid;
  v_outcome_id uuid;
  v_sort_order bigint;
  v_now timestamptz := now();
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  select a.* into v_application from public.applications a
  where a.id = p_application_id and a.user_id = v_user_id for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Application not found';
  end if;
  if v_application.closed_at is null then
    raise exception using errcode = '22023', message = 'Application is not closed';
  end if;
  v_old_stage_id := v_application.stage_id;

  perform 1 from public.pipeline_stages s
  where s.id = p_destination_stage_id and s.user_id = v_user_id and not s.is_closed
  for update;
  if not found then
    raise exception using errcode = '22023', message = 'Invalid active destination stage';
  end if;

  select o.id into v_outcome_id from public.application_outcomes o
  where o.application_id = p_application_id and o.user_id = v_user_id
    and o.reopened_at is null
  order by o.occurred_at desc, o.id desc limit 1 for update;
  if not found then
    raise exception using errcode = 'P0001', message = 'Open outcome record not found';
  end if;

  select coalesce(max(a.sort_order), 0) + 1024 into v_sort_order
  from public.applications a
  where a.user_id = v_user_id and a.stage_id = p_destination_stage_id;

  update public.application_outcomes set reopened_at = v_now where id = v_outcome_id;
  update public.applications
  set stage_id = p_destination_stage_id, sort_order = v_sort_order, closed_at = null
  where id = p_application_id returning * into v_application;

  insert into public.application_history
    (user_id, application_id, event_type, from_stage_id, to_stage_id, occurred_at)
  values
    (v_user_id, p_application_id, 'application_reopened', v_old_stage_id, p_destination_stage_id, v_now);

  return v_application;
end;
$$;

-- Start from no public privileges, then expose only the intended authenticated
-- data and mutation surface. Service-role access remains available to Supabase.
revoke all on all tables in schema public from anon, authenticated;
grant select on public.profiles, public.user_preferences, public.pipeline_stages,
  public.applications, public.application_history, public.recruitment_events,
  public.application_offers, public.application_outcomes to authenticated;
grant update (display_name) on public.profiles to authenticated;
grant update (currency, date_format, timezone) on public.user_preferences to authenticated;
grant insert (user_id, name, slug, color_key, position, is_closed, is_visible)
  on public.pipeline_stages to authenticated;
grant update (name, slug, color_key, position, is_visible) on public.pipeline_stages to authenticated;
grant delete on public.pipeline_stages to authenticated;
grant update (
  company, position, job_url, location, work_arrangement, employment_type, source,
  applied_at, salary_min, salary_max, currency, job_description, notes, archived_at
) on public.applications to authenticated;
grant delete on public.applications to authenticated;
grant insert, update, delete on public.recruitment_events to authenticated;
grant insert, update, delete on public.application_offers to authenticated;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.protect_system_pipeline_stage() from public, anon, authenticated;
revoke all on function public.record_application_archive_change() from public, anon, authenticated;
revoke all on function public.validate_preference_timezone() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.create_application(text, text, uuid, text, text, text, text, text, date, numeric, numeric, text, text, text) from public, anon;
revoke all on function public.move_application(uuid, uuid, uuid, uuid) from public, anon;
revoke all on function public.close_application(uuid, uuid, text, text) from public, anon;
revoke all on function public.reopen_application(uuid, uuid) from public, anon;
grant execute on function public.create_application(text, text, uuid, text, text, text, text, text, date, numeric, numeric, text, text, text) to authenticated;
grant execute on function public.move_application(uuid, uuid, uuid, uuid) to authenticated;
grant execute on function public.close_application(uuid, uuid, text, text) to authenticated;
grant execute on function public.reopen_application(uuid, uuid) to authenticated;

comment on table public.application_history is
  'Append-only domain audit trail; authenticated clients have SELECT only.';
comment on table public.application_outcomes is
  'Immutable closure cycles; close/reopen RPCs are the only client-facing writers.';
comment on column public.pipeline_stages.system_key is
  'Stable English semantic key. Indonesian display labels live in name.';
comment on column public.applications.archived_at is
  'Archive is orthogonal to active/closed lifecycle state.';
comment on function public.move_application(uuid, uuid, uuid, uuid) is
  'Atomically validates ownership and stale neighbors, applies sparse ordering, rebalances when required, and records cross-stage history.';
comment on function public.close_application(uuid, uuid, text, text) is
  'User-initiated closure only. Ghosted is never assigned automatically.';

commit;
