import React, { useState } from 'react';
import { Button, ButtonProps } from './button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedButtonProps extends ButtonProps {
  loadingText?: string;
  successText?: string;
  errorText?: string;
  actionFn?: () => Promise<any>;
  children: React.ReactNode;
}

const EnhancedButton = ({
  loadingText = 'Processing...',
  successText = 'Success!',
  errorText = 'An error occurred',
  actionFn,
  children,
  ...props
}: EnhancedButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // If there's an original onClick handler, call it
    if (props.onClick) {
      props.onClick(e);
    }
    
    // If there's no actionFn, just return
    if (!actionFn) return;

    // Otherwise process the async action
    try {
      setIsLoading(true);
      await actionFn();
      toast.success(successText);
    } catch (error) {
      console.error('Button action failed:', error);
      toast.error(errorText);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      {...props} 
      onClick={handleClick} 
      disabled={isLoading || props.disabled}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export { EnhancedButton };
