import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, FileText, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useFileParser } from '@/hooks/useFileParser';
import { FileType } from './types';

interface FileDropzoneProps<T> {
  onFileSelect: (data: T[], fileName: string, fileType: FileType) => void;
  onError: (error: string) => void;
  type: 'products' | 'equipment';
}

function FileDropzone<T>({ onFileSelect, onError, type }: FileDropzoneProps<T>) {
  const { parseFile, getAcceptedFileTypes } = useFileParser();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = useCallback((file: File) => {
    setSelectedFile(file);
    parseFile<T>(
      file,
      (data, fileType) => {
        onFileSelect(data, file.name, fileType);
      },
      (error) => {
        setSelectedFile(null);
        onError(error);
      }
    );
  }, [parseFile, onFileSelect, onError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
    }
    return <FileText className="h-8 w-8 text-blue-600" />;
  };

  if (selectedFile) {
    return (
      <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getFileIcon(selectedFile.name)}
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={clearFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
        ${isDragging 
          ? 'border-primary bg-primary/5' 
          : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
        }
      `}
    >
      <input
        type="file"
        accept={getAcceptedFileTypes()}
        onChange={handleFileInput}
        className="hidden"
        id={`file-upload-${type}`}
      />
      <label htmlFor={`file-upload-${type}`} className="cursor-pointer">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-muted rounded-full">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">Drop your file here or click to browse</p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports CSV and Excel (.xlsx) files
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs">
              <FileText className="h-3 w-3" /> .csv
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs">
              <FileSpreadsheet className="h-3 w-3" /> .xlsx
            </div>
          </div>
        </div>
      </label>
    </div>
  );
}

export default FileDropzone;
