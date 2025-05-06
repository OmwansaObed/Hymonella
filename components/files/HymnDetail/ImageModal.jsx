// components/hymnDetail/ImageModal.jsx
import { X } from "lucide-react";
import Image from "next/image";

export default function ImageModal({ expandedImage, closeImageModal }) {
  if (!expandedImage) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="relative w-full h-full flex items-center justify-center">
        <button
          onClick={closeImageModal}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <img
          src={expandedImage}
          alt="Enlarged view"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
}
