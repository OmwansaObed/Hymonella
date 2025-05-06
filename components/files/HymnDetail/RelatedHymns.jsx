// components/hymnDetail/RelatedHymns.jsx
import Link from "next/link";

export default function RelatedHymns({ relatedHymns }) {
  if (!relatedHymns.length) return null;

  return (
    <div className="mt-8 sm:mt-12">
      <h2 className="text-xl font-serif font-semibold mb-4 sm:mb-6 text-center text-indigo-800">
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {relatedHymns.map((relatedHymn, index) => (
          <Link
            key={relatedHymn._id}
            href={`/hymns/hymn-detail/${relatedHymn._id}`}
            className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-l-4 ${
              index % 3 === 0
                ? "border-blue-400"
                : index % 3 === 1
                ? "border-green-400"
                : "border-purple-400"
            }`}
          >
            <div className="p-4 sm:p-6 relative">
              <div className="absolute top-0 right-0 opacity-10">
                <Music size={30} className="text-indigo-400" />
              </div>
              <h3 className="font-serif font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-gray-900">
                {relatedHymn.title}
              </h3>
              <p className="text-indigo-600 text-xs sm:text-sm mb-1 sm:mb-2">
                By {relatedHymn.author}
              </p>
              <p className="text-gray-500 text-xs">
                Hymn #{relatedHymn.hymnNumber}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
