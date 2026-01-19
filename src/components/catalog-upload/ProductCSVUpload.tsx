import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { Download, Upload, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import CSVDropzone from './CSVDropzone';
import CSVPreviewTable from './CSVPreviewTable';
import ValidationSummary from './ValidationSummary';
import UploadResultSummary from './UploadResultSummary';
import { PRODUCT_CSV_TEMPLATE } from './csv-templates';
import { ProductCSVRow, ValidationError, UploadResult } from './types';
import { useCSVValidation } from '@/hooks/useCSVValidation';
import { useCatalogUpload } from '@/hooks/useCatalogUpload';

const PRODUCT_COLUMNS = [
  'name', 'description', 'category', 'price', 'stock_quantity',
  'manufacturer', 'sku', 'is_disposable', 'weight', 'tags'
];

const ProductCSVUpload: React.FC = () => {
  const navigate = useNavigate();
  const { validateProducts } = useCSVValidation();
  const { uploadProducts, uploading } = useCatalogUpload();
  
  const [parsedData, setParsedData] = useState<ProductCSVRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');

  const handleDownloadTemplate = () => {
    const blob = new Blob([PRODUCT_CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_upload_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = useCallback((file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as ProductCSVRow[];
        setParsedData(data);
        const errors = validateProducts(data);
        setValidationErrors(errors);
        setStep('preview');
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        setValidationErrors([{ row: 0, field: '', message: `Failed to parse CSV: ${error.message}` }]);
      }
    });
  }, [validateProducts]);

  const handleUpload = async () => {
    const result = await uploadProducts(parsedData);
    setUploadResult(result);
    setStep('result');
  };

  const handleReset = () => {
    setParsedData([]);
    setValidationErrors([]);
    setUploadResult(null);
    setStep('upload');
  };

  const handleViewProducts = () => {
    navigate('/manufacturer/products');
  };

  if (step === 'result' && uploadResult) {
    return (
      <UploadResultSummary
        result={uploadResult}
        type="products"
        onReset={handleReset}
        onViewItems={handleViewProducts}
      />
    );
  }

  return (
    <div className="space-y-6">
      {step === 'upload' && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Upload Products CSV</h3>
              <p className="text-sm text-muted-foreground">
                Upload a CSV file using the provided template. Required fields: name, price, stock_quantity
              </p>
            </div>
            <Button variant="outline" onClick={handleDownloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
          
          <CSVDropzone onFileSelect={handleFileSelect} type="products" />
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
                    Upload {parsedData.length} Products
                  </>
                )}
              </Button>
            </div>
          </div>

          <CSVPreviewTable 
            data={parsedData} 
            columns={PRODUCT_COLUMNS}
            errors={validationErrors}
          />

          <ValidationSummary errors={validationErrors} />
        </div>
      )}
    </div>
  );
};

export default ProductCSVUpload;
