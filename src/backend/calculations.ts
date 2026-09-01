import { DEFAULT_FOLLOW_UP_DAYS } from "./domain/constants";

const DAY_MS = 86_400_000;
export function daysBetween(from: string | Date, to: string | Date = new Date()) {
  return Math.max(0, Math.floor((new Date(to).getTime() - new Date(from).getTime()) / DAY_MS));
}
export function waitingState(input: { createdAt: string; appliedAt?: string | null; activityDates?: (string | null)[]; isClosed?: boolean; isArchived?: boolean }, now: Date = new Date(), threshold = DEFAULT_FOLLOW_UP_DAYS) {
  const timestamps = [input.createdAt, input.appliedAt, ...(input.activityDates ?? [])].filter(Boolean).map((date) => new Date(date as string).getTime());
  const waitingSince = new Date(Math.max(...timestamps)).toISOString();
  const waitingDays = daysBetween(waitingSince, now);
  return { waitingSince, waitingDays, followUpSuggested: !input.isClosed && !input.isArchived && waitingDays >= threshold };
}
export function conversion(numerator: number, denominator: number) { return denominator === 0 ? 0 : Math.round((numerator / denominator) * 10_000) / 100; }
export function calculateConversions(counts: { applied: number; interview: number; offer: number; hired: number }) {
  return { appliedToInterview: conversion(counts.interview, counts.applied), interviewToOffer: conversion(counts.offer, counts.interview), offerToHired: conversion(counts.hired, counts.offer) };
}
