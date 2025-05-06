// components/hymnDetail/NavigationButtons.jsx
import Link from "next/link";

export default function NavigationButtons({ hymnNumber }) {
  return (
    <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
      <Link
        href="/hymns"
        className="px-4 py-2 bg-white text-indigo-600 rounded-lg shadow hover:bg-indigo-50 flex items-center justify-center sm:justify-start transition-colors"
      >
        <ArrowLeft size={18} className="mr-2" />
        All Hymns
      </Link>
      <div className="flex gap-3 justify-center sm:justify-end">
        <Link
          href={`/hymns/hymn-detail/${parseInt(hymnNumber) - 1}`}
          className={`px-4 py-2 rounded-lg shadow flex items-center ${
            parseInt(hymnNumber) > 1
              ? "bg-white text-indigo-600 hover:bg-indigo-50"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          } transition-colors`}
          onClick={(e) => {
            if (parseInt(hymnNumber) <= 1) e.preventDefault();
          }}
        >
          <ArrowLeft size={18} className="mr-2" />
          Previous
        </Link>
        <Link
          href={`/hymns/hymn-detail/${parseInt(hymnNumber) + 1}`}
          className="px-4 py-2 bg-white text-indigo-600 rounded-lg shadow hover:bg-indigo-50 flex items-center transition-colors"
        >
          Next
          <ArrowRight size={18} className="ml-2" />
        </Link>
      </div>
    </div>
  );
}
