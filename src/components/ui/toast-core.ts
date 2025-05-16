
import { toast as sonnerToast } from "sonner";
import type { ReactNode } from "react";

// Define toast options type
export type ToastOptions = {
  title?: ReactNode;
  description?: ReactNode;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  // Add any other non-sonner properties here
  [key: string]: any; // This allows adding any property to the toast options
};

// Create a callable toast function that accepts options object
const createToast = (options: ToastOptions | string) => {
  // Handle string case
  if (typeof options === 'string') {
    return sonnerToast(options);
  }
  
  // Handle object case
  const { title, description, variant, ...rest } = options;
  return sonnerToast(title as string, {
    description,
    // Only pass properties that sonner accepts
    ...rest
  });
};

// Define toast object with methods
export const toast = Object.assign(
  // Make base function callable
  createToast,
  {
    // Add custom success method
    success: (message: string) => sonnerToast.success(message),
    
    // Add custom error method
    error: (message: string) => sonnerToast.error(message),
    
    // Warning method
    warning: (message: string) => sonnerToast.warning(message),
    
    // Info method
    info: (message: string) => sonnerToast.info(message),
    
    // Pass through other methods from sonner
    dismiss: sonnerToast.dismiss,
    promise: sonnerToast.promise,
    custom: sonnerToast.custom,
    message: sonnerToast.message,
    loading: sonnerToast.loading,
    getToasts: sonnerToast.getToasts
  }
);

// Default export as the callable toast function with methods
export default toast;
