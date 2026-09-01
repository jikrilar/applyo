"use server";

import { revalidatePath } from "next/cache";
import {
  archiveApplication,
  closeApplication,
  createApplication,
  deleteApplication,
  moveApplication,
  reopenApplication,
  updateApplication,
} from "@/backend/services/applications";
import { getApplicationDetail, getBoard } from "@/backend/services/queries";
import { upsertOffer } from "@/backend/services/offers";
import { BackendError, toActionResult, type ActionResult } from "@/backend/errors";
import type { BoardDTO } from "@/backend/dto";
import type { ApplicationRow } from "@/types/database";

async function mutate(operation: () => Promise<unknown>): Promise<ActionResult<BoardDTO>> {
  try {
    await operation();
    const board = await getBoard();
    revalidatePath("/aplikasi");
    revalidatePath("/aplikasi", "layout");
    revalidatePath("/dashboard");
    revalidatePath("/analitik");
    revalidatePath("/kalender");
    return { success: true, data: board };
  } catch (error) {
    const failed = toActionResult<BoardDTO>(error);
    if (failed.success) return failed;
    try {
      return { success: false, error: failed.error, board: await getBoard() };
    } catch {
      return failed;
    }
  }
}

export async function createApplicationAction(input: unknown) {
  return mutate(() => createApplication(input));
}
export async function updateApplicationAction(input: unknown) {
  return mutate(() => updateApplication(input));
}
export async function deleteApplicationAction(input: unknown) {
  return mutate(() => deleteApplication(input));
}
export async function getApplicationForEditAction(
  applicationId: string,
): Promise<ActionResult<ApplicationRow>> {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(applicationId))
      throw new BackendError("VALIDATION", "ID lamaran tidak valid.");
    const detail = await getApplicationDetail(applicationId);
    if (!detail) throw new BackendError("NOT_FOUND", "Lamaran tidak ditemukan.");
    return { success: true as const, data: detail.application };
  } catch (error) {
    return toActionResult<ApplicationRow>(error);
  }
}
export async function archiveApplicationAction(input: unknown) {
  return mutate(() => archiveApplication(input));
}
export async function moveApplicationAction(input: unknown) {
  return mutate(() => moveApplication(input));
}
export async function closeApplicationAction(input: unknown) {
  return mutate(() => closeApplication(input));
}
export async function reopenApplicationAction(input: unknown) {
  return mutate(() => reopenApplication(input));
}
export async function upsertOfferAction(input: unknown) {
  return mutate(() => upsertOffer(input));
}
