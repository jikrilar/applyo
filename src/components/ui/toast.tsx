"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "@/components/shared/cn";

type ToastItem = {
  id: number;
  title: string;
  description?: string;
  variant?: "default" | "success" | "danger";
};
type ToastInput = Omit<ToastItem, "id">;
const ToastContext = React.createContext<((toast: ToastInput) => void) | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const nextId = React.useRef(0);
  const toast = React.useCallback(
    (input: ToastInput) => setToasts((current) => [...current, { ...input, id: nextId.current++ }]),
    [],
  );
  return (
    <ToastContext.Provider value={toast}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((item) => (
          <ToastPrimitive.Root
            key={item.id}
            className={cn("ui-toast", `ui-toast-${item.variant ?? "default"}`)}
            onOpenChange={(open) =>
              !open && setToasts((current) => current.filter(({ id }) => id !== item.id))
            }
          >
            <ToastPrimitive.Title className="ui-toast-title">{item.title}</ToastPrimitive.Title>
            {item.description && (
              <ToastPrimitive.Description className="ui-toast-description">
                {item.description}
              </ToastPrimitive.Description>
            )}
            <ToastPrimitive.Close className="ui-toast-close" aria-label="Tutup notifikasi">
              <X />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="ui-toast-viewport" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const toast = React.useContext(ToastContext);
  if (!toast) throw new Error("useToast harus digunakan di dalam ToastProvider");
  return toast;
}
