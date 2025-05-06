"use client";

import { useState, useEffect } from "react";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { X, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function UploadImage({ onChange, existingImages = [] }) {
  const [uploadedImages, setUploadedImages] = useState(existingImages || []);

  // Sync with parent component when existingImages changes
  useEffect(() => {
    if (JSON.stringify(existingImages) !== JSON.stringify(uploadedImages)) {
      setUploadedImages(existingImages);
    }
  }, [existingImages]);

  // Handle successful upload
  const handleUploadComplete = (res) => {
    // Get URL from the response
    const newImageUrls = res.map((file) => file.ufsUrl);

    // Update local state with new images
    const updatedImages = [...uploadedImages, ...newImageUrls];
    setUploadedImages(updatedImages);

    // Notify parent component
    onChange(updatedImages);

    toast.success("Image Upload Completed");
  };

  // Remove an uploaded image
  const removeImage = (indexToRemove) => {
    const updatedImages = uploadedImages.filter(
      (_, index) => index !== indexToRemove
    );
    setUploadedImages(updatedImages);
    onChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      {/* Display uploaded images */}
      {uploadedImages.length > 0 && (
        <div className="mt-4 flex justify-center items-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedImages.map((imageUrl, index) => (
              <div key={`uploaded-${index}`} className="relative group">
                <div className="h-80 w-80 rounded-lg shadow-lg overflow-hidden ">
                  <img
                    src={imageUrl}
                    alt={`Uploaded ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 - w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Upload Button */}
      <div className="flex flex-col items-center">
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={(error) => {
            toast.error(`Upload Error: ${error.message}`);
          }}
          className="ut-label:text-indigo-600 ut-allowed-content:text-indigo-400 ut-button:bg-indigo-600 ut-button:hover:bg-indigo-700 border-indigo-300 hover:border-indigo-400"
        />
      </div>

      {uploadedImages.length === 0 && (
        <div className="flex items-center justify-center p-4 border border-dashed border-indigo-300 rounded-lg bg-indigo-50 text-indigo-500">
          <ImageIcon size={18} className="mr-2 opacity-70" />
          <span className="text-sm">No images selected</span>
        </div>
      )}
    </div>
  );
}
