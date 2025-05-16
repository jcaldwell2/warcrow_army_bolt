
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster 
      position="top-right"
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast: "group border bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50 rounded-md p-4 shadow-lg",
          success: "group border border-green-500 bg-green-500 text-white",
          error: "group border border-red-500 bg-red-500 text-white", 
          warning: "group border border-amber-500 bg-amber-500 text-white",
          info: "border bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50",
          default: "border bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50",
        }
      }}
    />
  );
}
