import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ToastContext } from "./toast";
import Icon from "../components/common/Icon";

interface ToastItem {
  id: number;
  type: "success" | "error";
  message: string;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((type: ToastItem["type"], message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const api = useMemo(
    () => ({
      success: (m: string) => push("success", m),
      error: (m: string) => push("error", m),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed right-4 top-20 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex animate-pop-in items-center gap-3 rounded-2xl border border-line bg-white p-3 pr-4 shadow-lift"
          >
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-white ${
                t.type === "success" ? "bg-emerald-500" : "bg-rose-500"
              }`}
            >
              <Icon name={t.type === "success" ? "check" : "alert"} className="h-5 w-5" />
            </span>
            <p className="text-sm font-medium">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}