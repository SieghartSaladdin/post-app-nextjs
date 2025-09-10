'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { ImagePlus, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (file: File | null) => void;
  initialImageUrl?: string | null;
}

export default function ImageUploader({ onImageUpload, initialImageUrl = null }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Buat URL pratinjau sementara
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      onImageUpload(file);
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      // Hapus URL objek untuk mencegah memory leak
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onImageUpload(null);
    // Reset nilai input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-sm">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/gif"
      />

      {previewUrl ? (
        // Tampilan Pratinjau Gambar
        <div className="relative group w-full h-56 rounded-lg overflow-hidden">
          <Image
            src={previewUrl}
            alt="Image preview"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleRemoveImage}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              aria-label="Remove image"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      ) : (
        // Tampilan Placeholder untuk Upload
        <div
          onClick={triggerFileInput}
          className="w-full h-56 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ImagePlus size={48} className="text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Klik untuk memilih gambar
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            PNG, JPG, atau GIF
          </p>
        </div>
      )}
    </div>
  );
}