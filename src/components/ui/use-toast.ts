
import { useToast as useHooksToast, toast as hooksToast } from "@/hooks/use-toast";

// Re-export with properly configured defaults
export const useToast = () => {
  const hookToast = useHooksToast();
  
  // Wrap the toast function to ensure we always set a reasonable duration
  const toast = (props: Parameters<typeof hookToast.toast>[0]) => {
    return hookToast.toast({
      ...props,
      duration: props.duration || 3000, // Default to 3 seconds if not specified
    });
  };
  
  return { ...hookToast, toast };
};

export const toast = (props: Parameters<typeof hooksToast>[0]) => {
  return hooksToast({
    ...props,
    duration: props.duration || 3000, // Default to 3 seconds if not specified
  });
};
