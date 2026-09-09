-- Allow account deletion to cascade through system pipeline stages.
--
-- Every user owns 10 seeded system stages (system_key NOT NULL) that are
-- protected from direct deletion by pipeline_stages_protect_system_stage.
-- That protection also aborted ON DELETE CASCADE from auth.users, which made
-- deleteCurrentAccount fail for every user (GoTrue 500:
-- "System pipeline stages cannot be deleted").
--
-- The guard now blocks a system-stage delete only while the owning auth user
-- still exists. During cascade from auth.users the parent row is already gone
-- in the same statement, so the cascade is allowed, while direct deletion by
-- an active user (or service role) is still rejected with 42501.
-- Cascade semantics verified on PostgreSQL 15.8: direct child delete with a
-- live parent raises; parent delete cascades cleanly.
--
-- SECURITY DEFINER (owner postgres, empty search_path, schema-qualified
-- tables — same pattern as other functions in this project) guarantees the
-- existence check behaves identically regardless of the invoking role, since
-- low-privilege roles cannot read auth.users directly.

create or replace function public.protect_system_pipeline_stage()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.system_key is not null
     and exists (select 1 from auth.users where id = old.user_id) then
    raise exception using errcode = '42501', message = 'System pipeline stages cannot be deleted';
  end if;
  return old;
end;
$$;

alter function public.protect_system_pipeline_stage() owner to postgres;
