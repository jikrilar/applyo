import { z } from "zod";

export type BackendErrorCode = "VALIDATION" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "DATABASE" | "UNEXPECTED";
export class BackendError extends Error {
  constructor(public readonly code: BackendErrorCode, message: string, public readonly cause?: unknown, public readonly fieldErrors?: Record<string, string[]>) { super(message); this.name = "BackendError"; }
}
export type ActionResult<T> = { success: true; data: T } | { success: false; error: { code: BackendErrorCode; message: string; fieldErrors?: Record<string, string[]> }; board?: T };

export function validationError(error: z.ZodError) {
  return new BackendError("VALIDATION", "Data yang diberikan tidak valid.", error, z.flattenError(error).fieldErrors);
}
export function databaseError(operation: string, error: { code?: string; message?: string }) {
  if (error.code === "PGRST116" || error.code === "P0002") return new BackendError("NOT_FOUND", "Data tidak ditemukan.", error);
  if (error.code === "42501") return new BackendError("FORBIDDEN", "Kamu tidak memiliki akses untuk melakukan tindakan ini.", error);
  if (error.code === "40001" || error.code === "23503" || error.code === "P0001") return new BackendError("CONFLICT", "Data telah berubah. Muat ulang lalu coba lagi.", error);
  if (error.code === "22023" || error.code === "23514" || error.code === "22P02") return new BackendError("VALIDATION", "Data yang diberikan tidak valid.", error);
  if (error.code === "23505") return new BackendError("CONFLICT", "Data tersebut sudah ada.", error);
  return new BackendError("DATABASE", `Operasi ${operation} tidak dapat diselesaikan.`, error);
}
export function toActionResult<T>(error: unknown): ActionResult<T> {
  const safe = error instanceof BackendError ? error : new BackendError("UNEXPECTED", "Terjadi kesalahan. Silakan coba lagi.", error);
  return { success: false, error: { code: safe.code, message: safe.message, ...(safe.fieldErrors && { fieldErrors: safe.fieldErrors }) } };
}
