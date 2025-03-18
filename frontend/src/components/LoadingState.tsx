import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";

interface LoadingStateProps {
  showText?: boolean;
  className?: string;
  spinnerSize?: number;
  spinnerClassName?: string;
}

export default function LoadingState({
  showText = true,
  className,
  spinnerSize = 24,
  spinnerClassName,
}: LoadingStateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={cn("flex flex-col items-center justify-center p-4", className)}
    >
      <Loader2
        className={cn("animate-spin text-primary", spinnerClassName)}
        size={spinnerSize}
      />
      {showText && (
        <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
      )}
    </div>
  );
}
