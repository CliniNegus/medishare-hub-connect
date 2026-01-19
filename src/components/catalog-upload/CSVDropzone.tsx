import React, { useCallback } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface CSVDropzoneProps {
  onFileSelect: (file: File) => void;
  type: 'products' | 'equipment';
}

const CSVDropzone: React.FC<CSVDropzoneProps> = ({ onFileSelect, type }) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const inputId = `csv-file-input-${type}`;

  return (
    <div 
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="w-full h-48 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => document.getElementById(inputId)?.click()}
    >
      <div className="flex items-center gap-2 mb-3">
        <FileSpreadsheet className="h-10 w-10 text-primary/70" />
        <Upload className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">
        Drag and drop your CSV file here, or click to browse
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        {type === 'products' 
          ? 'Required columns: name, price, stock_quantity'
          : 'Required columns: name'
        }
      </p>
      <input
        id={inputId}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
      />
    </div>
  );
};

export default CSVDropzone;
