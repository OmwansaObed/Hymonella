"use client";
import { useState, useEffect } from "react";
import {
  Music,
  Search,
  Heart,
  ArrowUp,
  Filter,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Play,
} from "lucide-react";
import axios from "axios";
import LoadingSpinner from "@/components/home/general/LoadingSpinner";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const AllHymnsPage = () => {
  const [hymns, setHymns] = useState([]);
  const [filteredHymns, setFilteredHymns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("title");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const { data: session } = useSession();
  const hymnsPerPage = 12;

  // Fetch hymns and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [hymnsResponse, categoriesResponse] = await Promise.all([
          axios.get("/api/hymns"),
          axios.get("/api/categories"),
        ]);

        // Fetch local favorites from localStorage
        const storedFavorites = localStorage.getItem("favoriteHymns");
        const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];
        setFavorites(favoriteIds);

        setHymns(hymnsResponse.data);
        setFilteredHymns(hymnsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (err) {
        setError("Failed to load hymns. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = [...hymns];

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((hymn) => hymn.category?._id === selectedCategory);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (hymn) =>
          hymn.title.toLowerCase().includes(searchLower) ||
          hymn.author.toLowerCase().includes(searchLower) ||
          (hymn.tags &&
            hymn.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "hymnNumber":
          return a.hymnNumber - b.hymnNumber;
        case "favorites":
          return b.favoritesCount - a.favoritesCount;
        default:
          return 0;
      }
    });

    setFilteredHymns(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [hymns, searchTerm, selectedCategory, sortOption]);

  // Calculate pagination
  const indexOfLastHymn = currentPage * hymnsPerPage;
  const indexOfFirstHymn = indexOfLastHymn - hymnsPerPage;
  const currentHymns = filteredHymns.slice(indexOfFirstHymn, indexOfLastHymn);
  const totalPages = Math.ceil(filteredHymns.length / hymnsPerPage);

  // Toggle favorite status
  const toggleFavorite = async (e, hymnId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // Update local state
      const newFavorites = favorites.includes(hymnId)
        ? favorites.filter((id) => id !== hymnId)
        : [...favorites, hymnId];

      setFavorites(newFavorites);

      // Update localStorage
      localStorage.setItem("favoriteHymns", JSON.stringify(newFavorites));

      // Update database
      if (session) {
        const isFavorited = favorites.includes(hymnId);
        const method = isFavorited ? "DELETE" : "POST";
        const endpoint = isFavorited
          ? `/api/users/favorites?hymnId=${hymnId}` // send as query param for DELETE
          : "/api/users/favorites"; // use body for POST

        const axiosConfig = {
          method,
          url: endpoint,
        };

        // Only include data for POST (not DELETE)
        if (method === "POST") {
          axiosConfig.data = { hymnId };
        }

        await axios(axiosConfig);
      }

      toast.success(
        favorites.includes(hymnId)
          ? "Removed from favorites"
          : "Added to favorites"
      );
      // Update the hymn count in the UI
      setHymns((prevHymns) =>
        prevHymns.map((hymn) =>
          hymn._id === hymnId
            ? {
                ...hymn,
                favoritesCount: favorites.includes(hymnId)
                  ? Math.max(0, hymn.favoritesCount - 1)
                  : hymn.favoritesCount + 1,
              }
            : hymn
        )
      );
    } catch (err) {
      console.error("Error toggling favorite status", err);
    }
  };

  // Function to format lyrics for preview
  const formatLyricsPreview = (lyrics) => {
    if (!lyrics) return "";
    const firstVerse = lyrics.split("\n\n")[0];
    return firstVerse.length > 100
      ? firstVerse.substring(0, 100) + "..."
      : firstVerse;
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Mobile responsive card color patterns
  const getCardColor = (index) => {
    const colors = [
      "bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-400",
      "bg-gradient-to-br from-green-50 to-teal-50 border-l-4 border-green-400",
      "bg-gradient-to-br from-yellow-50 to-amber-50 border-l-4 border-yellow-400",
      "bg-gradient-to-br from-pink-50 to-rose-50 border-l-4 border-pink-400",
      "bg-gradient-to-br from-purple-50 to-indigo-50 border-l-4 border-purple-400",
      "bg-gradient-to-br from-red-50 to-orange-50 border-l-4 border-red-400",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header Section */}
      <section className="pt-12 pb-6 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-4">
            <BookOpen size={50} className="mx-auto text-indigo-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            All Hymns
          </h1>
          <p className="text-lg text-indigo-800 max-w-2xl mx-auto mb-6 opacity-90">
            Explore our complete collection of hymns for worship and reflection
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              {/* Search */}
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search by title, author, or tags..."
                  className="w-full px-4 text-black py-3 pl-12 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search
                  className="absolute left-4 top-3.5 text-indigo-400"
                  size={20}
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:w-auto w-full flex items-center justify-center px-4 py-3 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors"
              >
                <Filter size={20} className="mr-2" />
                Filters
              </button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="p-4 bg-indigo-50 text-black rounded-lg mt-2 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sort By
                    </label>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      <option value="title">Title (A-Z)</option>
                      <option value="author">Author (A-Z)</option>
                      <option value="hymnNumber">Hymn Number</option>
                      <option value="favorites">Most Favorited</option>
                    </select>
                  </div>

                  {/* Reset Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("");
                        setSortOption("title");
                      }}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="bg-white p-6 rounded-xl shadow-md text-center border-l-4 border-red-500">
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredHymns.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <Music size={50} className="mx-auto text-indigo-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                No Hymns Found
              </h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any hymns matching your search criteria.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{currentHymns.length}</span> of{" "}
                  <span className="font-medium">{filteredHymns.length}</span>{" "}
                  hymns
                </p>
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
              </div>

              {/* Hymns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentHymns.map((hymn, index) => (
                  <Link
                    key={hymn._id}
                    href={`/hymns/hymn-detail/${hymn._id}`}
                    className={`${getCardColor(
                      index
                    )} rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full mb-2">
                            #{hymn.hymnNumber}
                          </span>
                          <h3 className="font-serif font-semibold text-lg text-gray-900 line-clamp-1">
                            {hymn.title}
                          </h3>
                        </div>
                        <button
                          onClick={(e) => toggleFavorite(e, hymn._id)}
                          className="p-1 rounded-full hover:bg-indigo-100 transition-colors"
                          aria-label="Toggle favorite"
                        >
                          <Heart
                            size={22}
                            className={`${
                              favorites.includes(hymn._id)
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400 group-hover:text-red-400"
                            } transition-colors`}
                          />
                        </button>
                      </div>

                      <p className="text-indigo-600 text-sm mb-2">
                        By {hymn.author}
                      </p>

                      <p className="text-gray-700 text-sm line-clamp-3 italic mb-3">
                        {formatLyricsPreview(hymn.lyrics)}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex flex-wrap gap-1">
                          {hymn.tags &&
                            hymn.tags.slice(0, 2).map((tag, i) => (
                              <span
                                key={i}
                                className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          {hymn.tags && hymn.tags.length > 2 && (
                            <span className="inline-block text-xs text-gray-500">
                              +{hymn.tags.length - 2} more
                            </span>
                          )}
                        </div>
                        {hymn.audioUrl && (
                          <div className="text-gray-500 text-xs flex items-center">
                            <Play size={15} className="mr-1" />
                            {hymn.duration ? `${hymn.duration}m` : "Audio"}
                          </div>
                        )}
                      </div>

                      <div className="absolute top-0 right-0 opacity-10">
                        <Music size={40} className="text-indigo-400" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="inline-flex rounded-md shadow-sm">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft size={16} className="mr-1" />
                      Previous
                    </button>

                    <div className="hidden sm:flex">
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                                currentPage === page
                                  ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              } border-t border-b`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span
                              key={page}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>

      {/* Decorative footer element */}
      <div className="py-12 text-center">
        <div className="inline-block">
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default AllHymnsPage;
