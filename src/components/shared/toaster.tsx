"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// =============================================================================
// Toast System — Lightweight notification toasts
// =============================================================================

export type ToastVariant = "default" | "success" | "destructive" | "warning";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

let toastListeners: Array<(toast: Toast) => void> = [];
let toastIdCounter = 0;

/** Imperatively show a toast from anywhere. */
export function toast({
  title,
  description,
  variant = "default",
}: Omit<Toast, "id">) {
  const id = `toast-${++toastIdCounter}`;
  const t: Toast = { id, title, description, variant };
  toastListeners.forEach((fn) => fn(t));
}

const variantStyles: Record<ToastVariant, string> = {
  default: "bg-card text-card-foreground border-border",
  success: "bg-success text-success-foreground border-success",
  destructive: "bg-destructive text-white border-destructive",
  warning: "bg-warning text-warning-foreground border-warning",
};

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Toast) => {
    setToasts((prev) => [...prev, t]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== t.id));
    }, 4000);
  }, []);

  useEffect(() => {
    toastListeners.push(addToast);
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== addToast);
    };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "rounded-lg border px-4 py-3 shadow-lg animate-slide-in-right",
            variantStyles[t.variant]
          )}
        >
          <p className="text-sm font-semibold">{t.title}</p>
          {t.description && (
            <p className="text-xs mt-0.5 opacity-90">{t.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
