import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { UploadResult } from './types';

interface UploadResultSummaryProps {
  result: UploadResult;
  type: 'products' | 'equipment';
  onReset: () => void;
  onViewItems: () => void;
}

const UploadResultSummary: React.FC<UploadResultSummaryProps> = ({
  result,
  type,
  onReset,
  onViewItems
}) => {
  const { success, failed, errors } = result;
  const total = success + failed;
  const allSuccess = failed === 0;
  const allFailed = success === 0;

  return (
    <div className="space-y-4">
      <Alert variant={allFailed ? "destructive" : allSuccess ? "default" : "default"} 
        className={allSuccess ? "border-green-500 bg-green-50 dark:bg-green-950/20" : ""}>
        {allSuccess ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : allFailed ? (
          <XCircle className="h-4 w-4" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
        )}
        <AlertTitle className={allSuccess ? "text-green-800 dark:text-green-200" : ""}>
          Upload {allFailed ? 'Failed' : 'Complete'}
        </AlertTitle>
        <AlertDescription className={allSuccess ? "text-green-700 dark:text-green-300" : ""}>
          <div className="mt-2 space-y-1">
            <p>
              <strong>{success}</strong> {type} uploaded successfully.
              {failed > 0 && (
                <> <strong>{failed}</strong> skipped due to errors.</>
              )}
            </p>
            {errors.length > 0 && (
              <div className="mt-3 text-sm">
                <p className="font-medium mb-1">Skipped items:</p>
                <ul className="list-disc pl-5 space-y-1 max-h-32 overflow-y-auto">
                  {errors.slice(0, 5).map((error, i) => (
                    <li key={i}>
                      Row {error.row}: {error.message}
                    </li>
                  ))}
                  {errors.length > 5 && (
                    <li className="text-muted-foreground">
                      ... and {errors.length - 5} more
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onReset}>
          Upload Another File
        </Button>
        {success > 0 && (
          <Button onClick={onViewItems}>
            View {type === 'products' ? 'Products' : 'Equipment'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UploadResultSummary;
