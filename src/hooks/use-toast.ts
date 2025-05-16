
import { toast } from "@/components/ui/toast-core";

// Re-export our toast as a callable function with methods
export { toast };

// For backward compatibility with the shadcn toast pattern
export const useToast = () => {
  return { 
    toast,
    // Dummy toasts array for compatibility with Toaster component
    toasts: [] 
  };
};
