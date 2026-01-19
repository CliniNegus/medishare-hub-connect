import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { Download, Upload, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import CSVDropzone from './CSVDropzone';
import CSVPreviewTable from './CSVPreviewTable';
import ValidationSummary from './ValidationSummary';
import UploadResultSummary from './UploadResultSummary';
import { EQUIPMENT_CSV_TEMPLATE } from './csv-templates';
import { EquipmentCSVRow, ValidationError, UploadResult } from './types';
import { useCSVValidation } from '@/hooks/useCSVValidation';
import { useCatalogUpload } from '@/hooks/useCatalogUpload';

const EQUIPMENT_COLUMNS = [
  'name', 'description', 'category', 'manufacturer', 'model',
  'serial_number', 'sku', 'condition', 'status', 'location',
  'price', 'lease_rate', 'quantity', 'specs', 'sales_option',
  'pay_per_use_enabled', 'pay_per_use_price'
];

const EquipmentCSVUpload: React.FC = () => {
  const navigate = useNavigate();
  const { validateEquipment } = useCSVValidation();
  const { uploadEquipment, uploading } = useCatalogUpload();
  
  const [parsedData, setParsedData] = useState<EquipmentCSVRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');

  const handleDownloadTemplate = () => {
    const blob = new Blob([EQUIPMENT_CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'equipment_upload_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = useCallback((file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as EquipmentCSVRow[];
        setParsedData(data);
        const errors = validateEquipment(data);
        setValidationErrors(errors);
        setStep('preview');
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        setValidationErrors([{ row: 0, field: '', message: `Failed to parse CSV: ${error.message}` }]);
      }
    });
  }, [validateEquipment]);

  const handleUpload = async () => {
    const result = await uploadEquipment(parsedData);
    setUploadResult(result);
    setStep('result');
  };

  const handleReset = () => {
    setParsedData([]);
    setValidationErrors([]);
    setUploadResult(null);
    setStep('upload');
  };

  const handleViewEquipment = () => {
    navigate('/equipment');
  };

  if (step === 'result' && uploadResult) {
    return (
      <UploadResultSummary
        result={uploadResult}
        type="equipment"
        onReset={handleReset}
        onViewItems={handleViewEquipment}
      />
    );
  }

  return (
    <div className="space-y-6">
      {step === 'upload' && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Upload Equipment CSV</h3>
              <p className="text-sm text-muted-foreground">
                Upload a CSV file using the provided template. Required field: name
              </p>
            </div>
            <Button variant="outline" onClick={handleDownloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
          
          <CSVDropzone onFileSelect={handleFileSelect} type="equipment" />
        </>
      )}

      {step === 'preview' && parsedData.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Preview & Validate</h3>
              <p className="text-sm text-muted-foreground">
                Review your data before uploading. Fix any errors highlighted below.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={validationErrors.length > 0 || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {parsedData.length} Equipment
                  </>
                )}
              </Button>
            </div>
          </div>

          <CSVPreviewTable 
            data={parsedData} 
            columns={EQUIPMENT_COLUMNS}
            errors={validationErrors}
          />

          <ValidationSummary errors={validationErrors} />
        </div>
      )}
    </div>
  );
};

export default EquipmentCSVUpload;
