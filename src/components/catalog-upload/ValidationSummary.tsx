import React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ValidationError } from './types';

interface ValidationSummaryProps {
  errors: ValidationError[];
  maxDisplay?: number;
}

const ValidationSummary: React.FC<ValidationSummaryProps> = ({ 
  errors, 
  maxDisplay = 10 
}) => {
  if (errors.length === 0) return null;

  const displayErrors = errors.slice(0, maxDisplay);
  const hasMore = errors.length > maxDisplay;

  // Group errors by row
  const errorsByRow = errors.reduce((acc, error) => {
    if (!acc[error.row]) {
      acc[error.row] = [];
    }
    acc[error.row].push(error);
    return acc;
  }, {} as Record<number, ValidationError[]>);

  const affectedRows = Object.keys(errorsByRow).length;

  return (
    <Alert variant="destructive" className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        Validation Errors
        <span className="text-xs font-normal">
          ({errors.length} errors in {affectedRows} rows)
        </span>
      </AlertTitle>
      <AlertDescription>
        <ScrollArea className="max-h-48 mt-2">
          <ul className="space-y-1 text-sm">
            {displayErrors.map((error, index) => (
              <li key={index} className="flex items-start gap-2">
                <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                <span>
                  <strong>Row {error.row}</strong>
                  {error.field && <> ({error.field})</>}: {error.message}
                </span>
              </li>
            ))}
            {hasMore && (
              <li className="text-muted-foreground italic pt-1">
                ... and {errors.length - maxDisplay} more errors
              </li>
            )}
          </ul>
        </ScrollArea>
      </AlertDescription>
    </Alert>
  );
};

export default ValidationSummary;
