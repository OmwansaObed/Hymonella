// FavoritesPage with the new theme
"use client";
import { useState, useEffect } from "react";

import { Heart, Book, Trash2, AlertCircle, Music } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { BarLoader } from "react-spinners";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteHymns, setFavoriteHymns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);

      try {
        let savedFavorites = [];

        if (session) {
          // ✅ Logged in - fetch from API
          const response = await axios.get("/api/users/favorites");

          savedFavorites = response.data?.favorites || [];
        } else {
          // 👤 Guest - get from localStorage
          savedFavorites = JSON.parse(
            localStorage.getItem("favoriteHymns") || "[]"
          );
        }

        setFavorites(savedFavorites);

        if (savedFavorites.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch hymn details
        const hymnData = await Promise.all(
          savedFavorites.map(async (item) => {
            const id = typeof item === "object" ? item._id : item;
            try {
              const res = await axios.get(`/api/hymns/${id}`);
              const response = res.data;
              console.log("Response", res.data);
              return response;
            } catch (err) {
              console.log("Fetch Error", err.message);
              return {
                _id: id,
                title: "Unknown Hymn",
                author: "Unknown",
                error: true,
              };
            }
          })
        );

        setFavoriteHymns(hymnData);
      } catch (err) {
        setError("Failed to load favorites.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Only run after session is loaded
    if (status !== "loading") {
      loadFavorites();
    }
  }, [session, status]);

  const removeFavorite = async (id) => {
    const updatedFavorites = favorites.filter((favId) => favId !== id);
    setFavorites(updatedFavorites);
    setFavoriteHymns(favoriteHymns.filter((hymn) => hymn._id !== id));

    if (session) {
      try {
        await axios.delete(`/api/users/favorites?hymnId=${id}`);
      } catch (err) {
        console.error("Failed to remove favorite:", err);
      }
    } else {
      localStorage.setItem("favoriteHymns", JSON.stringify(updatedFavorites));
    }
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    setFavoriteHymns([]);
    localStorage.removeItem("favorites");
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with decorative elements */}
        <div className="text-center mb-10 relative">
          <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 opacity-20">
            <Heart size={40} className="text-pink-400" />
          </div>
          <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 opacity-20">
            <Heart size={40} className="text-pink-400" />
          </div>

          <h1 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-3">
            My Favorites
          </h1>
          <p className="text-indigo-500 font-medium">
            Your collection of beloved hymns
          </p>
        </div>

        {/* Back button with gradient hover effect */}
        <div className="mb-8">
          <Link
            href="/hymns"
            className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white transition-all duration-300"
          >
            <Book size={16} className="mr-2" />
            Back to hymns
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className=" text-indigo-600 font-medium">
              <BarLoader
                color="indigo"
                height={4}
                width={1000}
                loading={true}
              />
            </div>
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-xl shadow-md text-center border-l-4 border-red-500">
            <AlertCircle className="inline-block mr-2 text-red-500" size={24} />
            <span className="text-red-500">{error}</span>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow-md text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-pink-50"></div>
            <div className="relative">
              <Heart size={60} className="mx-auto mb-6 text-pink-300" />
              <h2 className="text-2xl font-serif font-semibold mb-3 text-gray-800">
                No Favorites Yet
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You haven&apos;t added any hymns to your favorites collection
                yet. Discover hymns and mark them with a heart to save them
                here.
              </p>
              <Link
                href="/hymns"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition-all"
              >
                <Book size={18} className="mr-2" />
                Explore Hymns
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <p className="bg-white px-4 py-2 rounded-full shadow-sm text-indigo-600 font-medium">
                {favoriteHymns.length}{" "}
                {favoriteHymns.length === 1 ? "hymn" : "hymns"} in your
                collection
              </p>
              <button
                onClick={clearAllFavorites}
                className="text-sm px-4 py-2 bg-white rounded-full shadow-sm text-red-500 hover:bg-red-50 transition-all"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favoriteHymns.map((hymn, index) => (
                <div
                  key={hymn._id}
                  className={`${getCardColor(
                    index
                  )} rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <div className="p-6 relative">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 opacity-10">
                      <Music size={60} className="text-indigo-400" />
                    </div>

                    <h3 className="text-xl font-serif font-bold text-gray-700 mb-1 pr-12">
                      {hymn.error ? (
                        <span className="text-red-500">{hymn.title}</span>
                      ) : (
                        hymn.title
                      )}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      By {hymn.author}
                    </p>

                    {/* First few lines of lyrics preview */}
                    {hymn.lyrics && (
                      <div className="text-gray-700 text-sm mb-4 line-clamp-3 italic">
                        {hymn.lyrics.split("\n").slice(0, 3).join("\n")}
                        {hymn.lyrics.split("\n").length > 3 && "..."}
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-4">
                      {!hymn.error ? (
                        <Link
                          href={`/hymns/hymn-detail/${hymn._id}`}
                          className="text-sm px-4 py-2 bg-white bg-opacity-70 rounded-full shadow-sm text-indigo-600 hover:bg-indigo-50 transition-all"
                        >
                          View Hymn
                        </Link>
                      ) : (
                        <span className="text-sm text-red-500">
                          Hymn no longer available
                        </span>
                      )}
                      <button
                        onClick={() => removeFavorite(hymn._id)}
                        className="text-sm p-2 bg-white bg-opacity-70 rounded-full shadow-sm text-red-500 hover:bg-red-50 transition-all"
                        title="Remove from favorites"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Decorative footer element */}
        <div className="mt-12 text-center">
          <div className="inline-block">
            <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
