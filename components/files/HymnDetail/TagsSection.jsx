// components/hymnDetail/TagsSection.jsx
import Link from "next/link";

export default function TagsSection({ tags }) {
  return (
    <div className="mb-6 sm:mb-8">
      <h3 className="text-lg font-serif font-semibold mb-2 sm:mb-3 flex items-center text-indigo-800">
        <Tags size={18} className="mr-2" />
        Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Link
            key={index}
            href={`/hymns/tags/${tag}`}
            className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs sm:text-sm hover:bg-indigo-200 transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
