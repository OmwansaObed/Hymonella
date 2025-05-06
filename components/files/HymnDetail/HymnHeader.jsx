// components/hymnDetail/HymnHeader.jsx
import { Heart } from "lucide-react";
import Link from "next/link";

export default function HymnHeader({
  hymn,
  isFavorite,
  toggleFavorite,
  shareHymn,
}) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 md:p-8 relative">
      <div className="absolute top-0 right-0 opacity-10">
        <Heart size={120} className="text-white" />
      </div>
      <div className="flex items-center mb-2">
        <div className="bg-white text-indigo-600 rounded-full h-10 w-10 flex items-center justify-center mr-4">
          <span className="font-bold">{hymn.hymnNumber}</span>
        </div>
        <div className="flex-1">
          <span className="text-indigo-200">Hymn</span>
        </div>
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-3">
        {hymn.title}
      </h1>
      <p className="text-indigo-100 mb-6 md:mb-8">By {hymn.author}</p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={toggleFavorite}
          className={`px-3 sm:px-4 py-2 cursor-pointer rounded-full flex items-center text-sm ${
            isFavorite ? "bg-pink-500 text-white" : "bg-white text-pink-600"
          } transition-colors`}
        >
          <Heart
            size={16}
            className={`mr-2 ${isFavorite ? "fill-current" : ""}`}
          />
          {isFavorite ? "Favorited" : "Add to Favorites"}
          {hymn.favoritesCount > 0 && (
            <span className="ml-2 bg-white text-pink-600 rounded-full text-xs px-2 py-0.5">
              {hymn.favoritesCount}
            </span>
          )}
        </button>
        <button
          onClick={shareHymn}
          className="px-3 sm:px-4 py-2 cursor-pointer bg-white text-indigo-600 rounded-full flex items-center text-sm"
        >
          <Share2 size={16} className="mr-2" />
          Share
        </button>
      </div>
    </div>
  );
}
