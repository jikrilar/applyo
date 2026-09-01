import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { databaseError } from "@/backend/errors";
import type { UpdateApplicationInput } from "@/backend/schemas/applications";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;
const applicationColumns = "id,user_id,stage_id,company,position,job_url,location,work_arrangement,employment_type,source,applied_at,salary_min,salary_max,currency,job_description,notes,sort_order,closed_at,archived_at,created_at,updated_at";

function fields(input: Partial<UpdateApplicationInput>) {
  return { company: input.company, position: input.position, job_url: input.jobUrl, location: input.location, work_arrangement: input.workArrangement, employment_type: input.employmentType, source: input.source, applied_at: input.appliedAt, salary_min: input.salaryMin, salary_max: input.salaryMax, currency: input.currency, job_description: input.jobDescription, notes: input.notes };
}
export async function patchApplication(client: Client, userId: string, input: UpdateApplicationInput) {
  const { applicationId, ...changes } = input;
  const payload = Object.fromEntries(Object.entries(fields(changes)).filter(([, value]) => value !== undefined));
  const { data, error } = await client.from("applications").update(payload as never).eq("id", applicationId).eq("user_id", userId).select(applicationColumns).single();
  if (error) throw databaseError("update_application", error); return data;
}
export async function setArchived(client: Client, userId: string, applicationId: string, archived: boolean) {
  const { data, error } = await client.from("applications").update({ archived_at: archived ? new Date().toISOString() : null }).eq("id", applicationId).eq("user_id", userId).select(applicationColumns).single();
  if (error) throw databaseError("archive_application", error); return data;
}
export async function removeApplication(client: Client, userId: string, applicationId: string) {
  const { error, count } = await client.from("applications").delete({ count: "exact" }).eq("id", applicationId).eq("user_id", userId);
  if (error) throw databaseError("delete_application", error); if (!count) throw databaseError("delete_application", { code: "PGRST116" });
}
