"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function visibleFocusables(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.getClientRects().length > 0,
  );
}

function datePickerOpen(): boolean {
  return document.querySelector(".themed-date-picker-popover") !== null;
}

/**
 * Keyboard behavior for custom (non-Radix) modal dialogs: move initial focus
 * inside, trap Tab focus while open, close on Escape, and restore focus to
 * the element that opened the dialog. Attach the returned ref to the dialog
 * section element. Safe to call unconditionally; pass the open state.
 */
export function useDialogA11y<T extends HTMLElement>(active: boolean, onClose: () => void) {
  const ref = useRef<T | null>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  const saved = useRef<{ trigger: Element | null; entered: boolean; wasActive: boolean }>({
    trigger: null,
    entered: false,
    wasActive: false,
  });

  useEffect(() => {
    const state = saved.current;
    if (!active) {
      state.wasActive = false;
      return;
    }
    if (!state.wasActive) {
      state.wasActive = true;
      state.trigger = document.activeElement;
      state.entered = false;
    }
    const node = ref.current;
    if (node && !state.entered) {
      state.entered = true;
      visibleFocusables(node)[0]?.focus();
    }
    const onKeyDown = (event: KeyboardEvent) => {
      const current = ref.current;
      if (!current || !current.isConnected) return;
      if (event.key === "Escape") {
        if (datePickerOpen()) return;
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab" || datePickerOpen()) return;
      const items = visibleFocusables(current);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      const trigger = state.trigger;
      if (node && !node.isConnected && trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus();
      }
    };
  }, [active]);

  return ref;
}
