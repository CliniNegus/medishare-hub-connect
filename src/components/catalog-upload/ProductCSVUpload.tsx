import React, { useState, useCallback } from 'react';
import { Download, Upload, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import FileDropzone from './FileDropzone';
import EnhancedPreviewTable from './EnhancedPreviewTable';
import UploadModeSelector from './UploadModeSelector';
import OverwriteConfirmation from './OverwriteConfirmation';
import UploadResultSummary from './UploadResultSummary';
import { PRODUCT_CSV_TEMPLATE } from './csv-templates';
import { ProductCSVRow, ValidationError, UploadResult, UploadMode, FileType, PreviewRecord } from './types';
import { useCSVValidation } from '@/hooks/useCSVValidation';
import { useCatalogUpload } from '@/hooks/useCatalogUpload';
import { useToast } from '@/hooks/use-toast';

const PRODUCT_COLUMNS = [
  'name', 'description', 'category', 'price', 'stock_quantity',
  'manufacturer', 'sku', 'is_disposable', 'weight', 'tags'
];

const ProductCSVUpload: React.FC = () => {
  const navigate = useNavigate();
  const { validateProducts } = useCSVValidation();
  const { uploadProducts, prepareProductsPreview, uploading } = useCatalogUpload();
  const { toast } = useToast();
  
  const [uploadMode, setUploadMode] = useState<UploadMode>('add');
  const [allowNewInUpdateMode, setAllowNewInUpdateMode] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<FileType>('csv');
  const [previewRecords, setPreviewRecords] = useState<PreviewRecord<ProductCSVRow>[]>([]);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const [overwriteConfirmed, setOverwriteConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadTemplate = () => {
    const blob = new Blob([PRODUCT_CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_upload_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = useCallback(async (data: ProductCSVRow[], name: string, type: FileType) => {
    setFileName(name);
    setFileType(type);
    setIsLoading(true);
    
    try {
      const validationErrors = validateProducts(data);
      const preview = await prepareProductsPreview(data, uploadMode, validationErrors);
      setPreviewRecords(preview);
      setStep('preview');
    } catch (error: any) {
      toast({
        title: 'Error processing file',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [validateProducts, prepareProductsPreview, uploadMode, toast]);

  const handleFileError = useCallback((error: string) => {
    toast({
      title: 'File Error',
      description: error,
      variant: 'destructive'
    });
  }, [toast]);

  const handleModeChange = useCallback(async (mode: UploadMode) => {
    setUploadMode(mode);
    setOverwriteConfirmed(false);
    
    // Re-process preview if we have data
    if (previewRecords.length > 0) {
      setIsLoading(true);
      try {
        const data = previewRecords.map(r => r.data);
        const validationErrors = validateProducts(data);
        const preview = await prepareProductsPreview(data, mode, validationErrors);
        setPreviewRecords(preview);
      } finally {
        setIsLoading(false);
      }
    }
  }, [previewRecords, validateProducts, prepareProductsPreview]);

  const handleUpload = async () => {
    const result = await uploadProducts(previewRecords, uploadMode, fileName, fileType, allowNewInUpdateMode);
    setUploadResult(result);
    setStep('result');
  };

  const handleReset = () => {
    setPreviewRecords([]);
    setUploadResult(null);
    setStep('upload');
    setFileName('');
    setOverwriteConfirmed(false);
  };

  const handleViewProducts = () => {
    navigate('/manufacturer/products');
  };

  const updateCount = previewRecords.filter(r => r.status === 'update').length;
  const errorCount = previewRecords.filter(r => r.status === 'error').length;
  const canUpload = errorCount === 0 && (uploadMode !== 'update' || updateCount === 0 || overwriteConfirmed);

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
              <h3 className="text-lg font-medium">Upload Products</h3>
              <p className="text-sm text-muted-foreground">
                Upload a CSV or Excel file using the provided template. Required fields: name, price, stock_quantity
              </p>
            </div>
            <Button variant="outline" onClick={handleDownloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>

          <UploadModeSelector
            mode={uploadMode}
            onModeChange={setUploadMode}
            allowNewInUpdateMode={allowNewInUpdateMode}
            onAllowNewChange={setAllowNewInUpdateMode}
          />
          
          <FileDropzone
            onFileSelect={handleFileSelect}
            onError={handleFileError}
            type="products"
          />

          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Processing file...</span>
            </div>
          )}
        </>
      )}

      {step === 'preview' && previewRecords.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Preview & Validate</h3>
              <p className="text-sm text-muted-foreground">
                Review changes before uploading. File: {fileName}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={!canUpload || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          <UploadModeSelector
            mode={uploadMode}
            onModeChange={handleModeChange}
            allowNewInUpdateMode={allowNewInUpdateMode}
            onAllowNewChange={setAllowNewInUpdateMode}
          />

          <EnhancedPreviewTable 
            records={previewRecords}
            columns={PRODUCT_COLUMNS}
          />

          <OverwriteConfirmation
            confirmed={overwriteConfirmed}
            onConfirmChange={setOverwriteConfirmed}
            updateCount={updateCount}
          />
        </div>
      )}
    </div>
  );
};

export default ProductCSVUpload;
