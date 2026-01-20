import { useCallback } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { FileType } from '@/components/catalog-upload/types';

export const useFileParser = () => {
  const parseFile = useCallback(<T>(
    file: File,
    onSuccess: (data: T[], fileType: FileType) => void,
    onError: (error: string) => void
  ) => {
    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
    const isCSV = fileName.endsWith('.csv');

    if (!isExcel && !isCSV) {
      onError('Unsupported file format. Please upload a CSV or Excel (.xlsx) file.');
      return;
    }

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          
          // Read only the first worksheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON with header row
          const jsonData = XLSX.utils.sheet_to_json<T>(worksheet, { defval: '' });
          
          if (jsonData.length === 0) {
            onError('The Excel file appears to be empty or has no data rows.');
            return;
          }
          
          onSuccess(jsonData, 'xlsx');
        } catch (error: any) {
          onError(`Failed to parse Excel file: ${error.message}`);
        }
      };
      reader.onerror = () => {
        onError('Failed to read the Excel file.');
      };
      reader.readAsBinaryString(file);
    } else {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            onError(`CSV parsing error: ${results.errors[0].message}`);
            return;
          }
          onSuccess(results.data as T[], 'csv');
        },
        error: (error) => {
          onError(`Failed to parse CSV: ${error.message}`);
        }
      });
    }
  }, []);

  const getAcceptedFileTypes = useCallback(() => {
    return '.csv,.xlsx,.xls';
  }, []);

  return {
    parseFile,
    getAcceptedFileTypes
  };
};
