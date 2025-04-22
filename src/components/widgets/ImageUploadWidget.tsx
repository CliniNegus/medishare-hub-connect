
// This widget lets users upload an image or pick a stock photo from Unsplash list.
// You can re-use it across dashboards!
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";

const STOCK_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=cover&w=500&q=80',
    label: 'Hospitals - Laptops'
  },
  {
    url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=cover&w=500&q=80',
    label: 'Manufacturers - Laptops'
  },
  {
    url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=cover&w=500&q=80',
    label: 'Investors - Coding'
  },
];

interface ImageUploadWidgetProps {
  onImageChange: (url: string) => void;
  defaultImage?: string;
}
const ImageUploadWidget: React.FC<ImageUploadWidgetProps> = ({ onImageChange, defaultImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Use URL.createObjectURL for local preview; in production you'd upload to cloud storage and use that URL
    const imgUrl = URL.createObjectURL(file);
    onImageChange(imgUrl);
  };

  return (
    <div className="flex flex-col items-end space-y-1">
      <Button
        size="icon"
        variant="ghost"
        className="border border-gray-200 bg-white hover:bg-red-50 p-1"
        title="Upload Custom Image"
        onClick={() => fileInputRef.current?.click()}
      >
        <span className="material-icons text-black">upload</span>
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
      <div className="flex space-x-1">
        {STOCK_IMAGES.map((img, idx) => (
          <button
            key={idx}
            className="w-7 h-7 rounded overflow-hidden border border-gray-200"
            onClick={() => onImageChange(img.url)}
            style={{ background: '#fff' }}
            title={img.label}
          >
            <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageUploadWidget;

