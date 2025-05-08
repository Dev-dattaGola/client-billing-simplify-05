
import { toast } from 'sonner';

/**
 * Utility function to handle form submissions
 * @param submitFn - The function to execute on submit
 * @param options - Configuration options
 * @returns A function that can be used as a form onSubmit handler
 */
export const handleFormSubmit = (
  submitFn: (data: any) => Promise<any>,
  options: {
    onSuccess?: (result: any) => void;
    onError?: (error: any) => void;
    successMessage?: string;
    errorMessage?: string;
    showToasts?: boolean;
  } = {}
) => {
  const {
    onSuccess,
    onError,
    successMessage = 'Successfully submitted',
    errorMessage = 'An error occurred',
    showToasts = true,
  } = options;

  return async (data: any) => {
    try {
      const result = await submitFn(data);
      
      if (showToasts) {
        toast.success(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      console.error('Form submission error:', error);
      
      if (showToasts) {
        toast.error(errorMessage);
      }
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    }
  };
};

/**
 * Creates a debounced version of a function
 * @param func - The function to debounce
 * @param wait - The debounce wait time in ms
 * @returns A debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};
