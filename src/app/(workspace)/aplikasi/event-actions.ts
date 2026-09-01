"use server";
import { revalidatePath } from "next/cache";
import { completeEvent, createEvent, deleteEvent, updateEvent } from "@/backend/services/events";
import { toActionResult } from "@/backend/errors";
import { getBoard } from "@/backend/services/queries";
import type { BoardDTO } from "@/backend/dto";
export async function createEventAction(input: unknown) { try { await createEvent(input); const data = await getBoard(); revalidatePath("/kalender"); revalidatePath("/dashboard"); revalidatePath("/aplikasi"); revalidatePath("/analitik"); return { success: true as const, data }; } catch (error) { return toActionResult<BoardDTO>(error); } }
export async function updateEventAction(input: unknown) { try { const data = await updateEvent(input); revalidatePath("/kalender"); revalidatePath("/dashboard"); revalidatePath("/aplikasi"); return { success: true as const, data }; } catch (error) { return toActionResult(error); } }
export async function completeEventAction(input: unknown) { try { const data = await completeEvent(input); revalidatePath("/kalender"); revalidatePath("/dashboard"); revalidatePath("/aplikasi"); return { success: true as const, data }; } catch (error) { return toActionResult(error); } }
export async function deleteEventAction(input: unknown) { try { const data = await deleteEvent(input); revalidatePath("/kalender"); revalidatePath("/dashboard"); revalidatePath("/aplikasi"); return { success: true as const, data }; } catch (error) { return toActionResult(error); } }
