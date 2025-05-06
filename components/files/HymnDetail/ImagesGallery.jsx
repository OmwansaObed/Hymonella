import { BookOpen, Maximize2 } from "lucide-react";
import Image from "next/image";

export default function ImagesGallery({ images, title, onExpand }) {
  return (
    <div className="mb-6 sm:mb-8">
      <h3 className="text-lg font-serif font-semibold mb-3 sm:mb-4 text-indigo-800 flex items-center">
        <BookOpen size={18} className="mr-2" />
        Music Sheet
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg shadow-md group cursor-pointer relative"
            onClick={() => onExpand(img)}
          >
            <Image
              src={img}
              alt={`${title} music sheet ${index + 1}`}
              className="object-cover w-full h-full transform group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Maximize2 size={24} className="text-white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
