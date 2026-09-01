"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { archiveApplication, closeApplication, deleteApplication, reopenApplication, updateApplication } from "@/backend/services/applications";
import { completeEvent, createEvent, deleteEvent, updateEvent } from "@/backend/services/events";
import { deleteOffer, upsertOffer } from "@/backend/services/offers";
import { getApplicationDetail } from "@/backend/services/queries";
import { toActionResult } from "@/backend/errors";

async function refresh(id: string) { revalidatePath(`/aplikasi/${id}`); revalidatePath("/aplikasi"); revalidatePath("/dashboard"); revalidatePath("/kalender"); revalidatePath("/analitik"); return getApplicationDetail(id); }
async function mutate(id: string, operation: () => Promise<unknown>) { try { await operation(); return { success: true as const, data: await refresh(id) }; } catch (error) { return toActionResult(error); } }
export async function updateDetailAction(id: string, input: unknown) { return mutate(id, () => updateApplication(input)); }
export async function archiveDetailAction(id: string, archived: boolean) { return mutate(id, () => archiveApplication({ applicationId: id, archived })); }
export async function closeDetailAction(id: string, input: unknown) { return mutate(id, () => closeApplication(input)); }
export async function reopenDetailAction(id: string, destinationStageId: string) { return mutate(id, () => reopenApplication({ applicationId: id, destinationStageId })); }
export async function updateDetailEventAction(id: string, input: unknown) { return mutate(id, () => updateEvent(input)); }
export async function createDetailEventAction(id: string, input: unknown) { return mutate(id, () => createEvent(input)); }
export async function completeDetailEventAction(id: string, eventId: string, completed: boolean) { return mutate(id, () => completeEvent({ eventId, completed })); }
export async function deleteDetailEventAction(id: string, eventId: string) { return mutate(id, () => deleteEvent({ eventId })); }
export async function upsertDetailOfferAction(id: string, input: unknown) { return mutate(id, () => upsertOffer(input)); }
export async function deleteDetailOfferAction(id: string) { return mutate(id, () => deleteOffer(id)); }
export async function deleteDetailAction(id: string) {
  try {
    await deleteApplication({ applicationId: id });
    revalidatePath("/aplikasi");
  } catch (error) {
    return toActionResult(error);
  }
  redirect("/aplikasi");
}
