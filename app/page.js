"use client";
import { useState, useEffect } from "react";

import {
  Music,
  Book,
  Search,
  Heart,
  Plus,
  SearchIcon,
  BookOpen,
} from "lucide-react";
import axios from "axios";
import LoadingSpinner from "@/components/home/general/LoadingSpinner";
import Link from "next/link";
import { useSession } from "next-auth/react";

const HomePage = () => {
  const [featuredHymn, setFeaturedHymn] = useState(null);
  const [recentHymns, setRecentHymns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchHymns = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/hymns");

        if (response.data && response.data.length > 0) {
          // Select a random hymn as featured
          const randomIndex = Math.floor(Math.random() * response.data.length);
          setFeaturedHymn(response.data[randomIndex]);

          // Get 3 recent hymns (excluding the featured one)
          const filtered = response.data
            .filter((hymn) => hymn._id !== response.data[randomIndex]._id)
            .slice(0, 3);
          setRecentHymns(filtered);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load hymns. Please try again later."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHymns();
  }, []);

  // Format lyrics preview - first verse only
  const formatLyricsPreview = (lyrics) => {
    if (!lyrics) return "";
    const firstVerse = lyrics.split("\n\n")[0];
    return firstVerse.length > 150
      ? firstVerse.substring(0, 150) + "..."
      : firstVerse;
  };

  // Helper function to get vibrant background colors for hymn cards
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
      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
            <Music size={120} className="text-indigo-600" />
          </div>
          <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 opacity-10">
            <BookOpen size={120} className="text-pink-600" />
          </div>

          <Music size={60} className="mx-auto mb-6 text-indigo-500" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Uplifting Hymns
          </h1>
          <p className="text-xl text-indigo-800 max-w-2xl mx-auto mb-8 opacity-90">
            A collection of timeless hymns for worship, reflection, and
            spiritual growth
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/hymns"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <span className="flex items-center">
                <Book size={18} className="mr-2" />
                Browse All Hymns
              </span>
            </Link>
            <Link
              href="/favorites"
              className="px-6 py-3 bg-white text-indigo-600 rounded-full shadow-md hover:bg-indigo-50  transition-all"
            >
              <span className="flex items-center">
                <Heart size={18} className="mr-2" color={"red"} />
                Favorites
              </span>
            </Link>
            {session?.user.isAdmin && (
              <Link
                href="/admin"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition-all"
              >
                <span className="flex items-center">
                  <Settings size={18} className="mr-2" />
                  Admin Dashboard
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Search Section */}

      {/* Featured Hymn Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Featured Hymn
          </h2>

          {loading ? (
            <div className="text-center">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="bg-white p-6 rounded-xl shadow-md text-center border-l-4 border-red-500">
              <p className="text-red-500">{error}</p>
            </div>
          ) : featuredHymn ? (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-30"></div>
              <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="p-8 relative">
                  <div className="absolute top-0 right-0 opacity-10">
                    <Music size={100} className="text-indigo-300" />
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-center text-gray-900 mb-2">
                    {featuredHymn.title}
                  </h3>
                  <p className="text-indigo-500 text-center mb-6">
                    By {featuredHymn.author}
                  </p>
                  <blockquote className="italic text-gray-700 border-l-4 border-indigo-300 pl-4 py-2 mb-8">
                    {formatLyricsPreview(featuredHymn.lyrics)}
                  </blockquote>
                  <div className="text-center">
                    <Link
                      href={`/hymns/hymn-detail/${featuredHymn._id}`}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                      <Book size={18} className="mr-2" />
                      Read Full Hymn
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">
              No featured hymn available.
            </p>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/hymns"
              className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-6 flex flex-col items-center text-center relative z-10">
                <div className="bg-indigo-100 rounded-full p-3 mb-4">
                  <Book size={28} className="text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Browse All Hymns
                </h3>
                <p className="text-gray-600">
                  Explore our complete collection of Uplifting hymns
                </p>
              </div>
            </Link>

            <Link
              href="/favorites"
              className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-6 flex flex-col items-center text-center relative z-10">
                <div className="bg-pink-100 rounded-full p-3 mb-4">
                  <Heart size={28} className="text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  My Favorites
                </h3>
                <p className="text-gray-600">
                  Access your saved hymns for quick reference
                </p>
              </div>
            </Link>

            <Link
              href="/hymns/categories"
              className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-6 flex flex-col items-center text-center relative z-10">
                <div className="bg-purple-100 rounded-full p-3 mb-4">
                  <SearchIcon size={28} className="text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Browse Categories
                </h3>
                <p className="text-gray-600">
                  Find your hymn based on its category
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Hymns */}
      {recentHymns.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Recently Added Hymns
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentHymns.map((hymn, index) => (
                <Link
                  key={hymn._id}
                  href={`/hymns/hymn-detail/${hymn._id}`}
                  className={`${getCardColor(
                    index
                  )} rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <div className="p-6 relative">
                    <div className="absolute top-0 right-0 opacity-10">
                      <Music size={40} className="text-indigo-400" />
                    </div>
                    <h3 className="font-serif font-semibold text-lg mb-2 text-gray-900">
                      {hymn.title}
                    </h3>
                    <p className="text-indigo-600 text-sm mb-4">
                      By {hymn.author}
                    </p>
                    <p className="text-gray-700 text-sm line-clamp-3 italic">
                      {formatLyricsPreview(hymn.lyrics)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Decorative footer element */}
      <div className="py-6 text-center">
        <div className="inline-block">
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
