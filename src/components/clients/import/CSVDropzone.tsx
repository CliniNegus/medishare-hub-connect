
import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface CSVDropzoneProps {
  onFileSelect: (file: File) => void;
}

const CSVDropzone: React.FC<CSVDropzoneProps> = ({ onFileSelect }) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel')) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div 
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      onClick={() => document.getElementById('csv-file-input')?.click()}
    >
      <Upload className="h-12 w-12 text-primary/70 mb-2" />
      <p className="text-sm text-foreground">Drag and drop your CSV file here, or click to browse</p>
      <p className="text-xs text-muted-foreground mt-1">Supported columns: name, email, phone, address</p>
      <input
        id="csv-file-input"
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
      />
    </div>
  );
};

export default CSVDropzone;
