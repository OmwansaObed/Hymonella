"use client";
import { useState, useEffect, useRef } from "react";
import {
  Music,
  Heart,
  Share2,
  BookOpen,
  Play,
  Pause,
  Tags,
  Clock,
  Globe,
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
  X,
  Maximize2,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import LoadingSpinner from "@/components/home/general/LoadingSpinner";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import CommentsList from "@/components/commentList/CommentsList";
import Image from "next/image";

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

const HymnDetailPage = () => {
  const { id } = useParams();

  const [hymn, setHymn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [relatedHymns, setRelatedHymns] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [expandedImage, setExpandedImage] = useState(null);
  const { data: session } = useSession();

  const audioRef = useRef(null);

  useEffect(() => {
    const fetchHymnDetails = async () => {
      try {
        setLoading(true);

        // Fetch hymn details
        const response = await axios.get(`/api/hymns/${id}`);
        setHymn(response.data);

        // Fetch related hymns (by same category or author)
        const relatedResponse = await axios.get(`/api/hymns/related/${id}`);
        setRelatedHymns(relatedResponse.data.slice(0, 3));
      } catch (err) {
        setError("Failed to load hymn details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHymnDetails();
    }
  }, [id]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        let favoriteData = [];

        if (session) {
          const response = await axios.get(`/api/users/favorites`, {
            withCredentials: true,
          });
          favoriteData = Array.isArray(response.data?.favorites)
            ? response.data.favorites
            : [];
        } else {
          const stored = localStorage.getItem("favoriteHymns");
          favoriteData = stored ? JSON.parse(stored) : [];
        }

        setFavorites(favoriteData);

        // ✅ Consistent isFavorite logic
        const isFav = favoriteData.some((fav) =>
          typeof fav === "object" ? fav._id === id : fav === id
        );
        setIsFavorite(isFav);
      } catch (err) {
        console.error("Error fetching favorite hymns:", err);
        setFavorites([]);
        setIsFavorite(false);
      }
    };

    if (id) fetchFavorites();
  }, [session, id]);

  useEffect(() => {
    // Setup audio event listeners
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateTime);
      audioRef.current.addEventListener("ended", handleAudioEnd);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("timeupdate", updateTime);
          audioRef.current.removeEventListener("ended", handleAudioEnd);
        }
      };
    }
  }, [audioRef.current]);

  // Handle keyboard events for image modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && expandedImage !== null) {
        setExpandedImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Prevent body scrolling when modal is open
    if (expandedImage !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [expandedImage]);

  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressClick = (e) => {
    if (audioRef.current && hymn) {
      const progressBar = e.currentTarget;
      const clickPosition =
        (e.clientX - progressBar.getBoundingClientRect().left) /
        progressBar.offsetWidth;
      const newTime = clickPosition * hymn.duration;

      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFavorite = async () => {
    const prevFavorite = isFavorite;
    setIsFavorite(!prevFavorite);

    try {
      if (prevFavorite) {
        // Removing from favorites
        if (session) {
          await axios.delete(`/api/users/favorites?hymnId=${id}`);
          localStorage.removeItem("favoriteHymns");
        } else {
          const newFavorites = favorites.filter((favId) => favId !== id);
          setFavorites(newFavorites);
          localStorage.setItem("favoriteHymns", JSON.stringify(newFavorites));
        }
        toast.success("Hymn removed from favorites.");
      } else {
        // Adding to favorites
        if (session) {
          await axios.post(`/api/users/favorites`, { hymnId: id });
          localStorage.removeItem("favoriteHymns");
        } else {
          const newFavorites = [...favorites, id];
          setFavorites(newFavorites);
          localStorage.setItem("favoriteHymns", JSON.stringify(newFavorites));
        }
        toast.success("Hymn added to favorites.");
      }

      // Update UI count
      const newCount = hymn.favoritesCount + (prevFavorite ? -1 : 1);
      setHymn({ ...hymn, favoritesCount: newCount });
    } catch (err) {
      console.error("Error updating favorite status:", err);
      setIsFavorite(prevFavorite); // rollback optimistic update
      toast.error("Failed to update favorite status.");
    }
  };

  const shareHymn = () => {
    if (navigator.share) {
      navigator
        .share({
          title: hymn.title,
          text: `Check out this beautiful hymn: ${hymn.title} by ${hymn.author}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch((err) => console.error("Could not copy text: ", err));
    }
  };

  // Format lyrics with proper verse structure
  const formatLyrics = (lyrics) => {
    if (!lyrics) return [];

    return lyrics.split("\n\n").map((verse, index) => ({
      number: index + 1,
      text: verse,
    }));
  };

  // Get categories as tags from hymn
  const getHymnTags = () => {
    if (!hymn || !hymn.tags) return [];
    return hymn.tags;
  };

  // Open image in full screen modal
  const openImageModal = (imageUrl) => {
    setExpandedImage(imageUrl);
  };

  // Close image modal
  const closeImageModal = () => {
    setExpandedImage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !hymn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center border-l-4 border-red-500">
            <p className="text-red-500 mb-4">{error || "Hymn not found"}</p>
            <Link
              href="/hymns"
              className="text-indigo-600 hover:underline flex items-center justify-center"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to all hymns
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const verses = formatLyrics(hymn.lyrics);
  const tags = getHymnTags();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Navigation */}
      <div className="max-w-5xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <Link
          href="/hymns"
          className="text-indigo-600 hover:text-indigo-800 inline-flex items-center group mb-6"
        >
          <ArrowLeft
            size={18}
            className="mr-2 group-hover:translate-x-[-3px] transition-transform"
          />
          Back to Hymns
        </Link>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Hymn header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 opacity-10">
              <Music size={120} className="text-white" />
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
                  isFavorite
                    ? "bg-pink-500 text-white"
                    : "bg-white text-pink-600"
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

          <div className="p-4 sm:p-6 md:p-8">
            {/* Audio player */}
            {hymn.audioUrl && (
              <div className="mb-8 md:mb-10 bg-indigo-50 p-4 sm:p-5 md:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-serif font-semibold mb-3 md:mb-4 text-indigo-800 flex items-center">
                  <Music size={20} className="mr-2" />
                  Listen to Hymn
                </h3>

                <audio
                  ref={audioRef}
                  src={hymn.audioUrl}
                  style={{ display: "none" }}
                />

                <div className="flex items-center mb-2 md:mb-4">
                  <button
                    onClick={togglePlayPause}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-md"
                  >
                    {isPlaying ? (
                      <Pause size={18} className="sm:text-lg" />
                    ) : (
                      <Play size={18} className="ml-1 sm:text-lg" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div
                      className="bg-indigo-200 h-2 sm:h-3 rounded-full cursor-pointer relative"
                      onClick={handleProgressClick}
                    >
                      <div
                        className="bg-indigo-600 h-2 sm:h-3 rounded-full absolute top-0 left-0"
                        style={{
                          width: `${
                            hymn.duration
                              ? (currentTime / hymn.duration) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>

                    <div className="flex justify-between mt-1 sm:mt-2 text-indigo-600 text-xs sm:text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(hymn.duration || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hymn metadata */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
              {hymn.language && (
                <div className="flex items-center text-gray-600 text-sm sm:text-base">
                  <Globe size={16} className="mr-1 text-indigo-400" />
                  <span>{hymn.language}</span>
                </div>
              )}

              {hymn.duration && (
                <div className="flex items-center text-gray-600 text-sm sm:text-base">
                  <Clock size={16} className="mr-1 text-indigo-400" />
                  <span>{formatTime(hymn.duration)}</span>
                </div>
              )}
            </div>

            {/* Hymn lyrics */}
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-serif font-semibold mb-4 sm:mb-6 flex items-center text-indigo-800">
                <BookOpen size={20} className="mr-2" />
                Lyrics
              </h2>

              <div className="space-y-6 sm:space-y-8">
                {verses.map((verse, index) => (
                  <div key={index} className="space-y-1 sm:space-y-2">
                    <h3 className="font-semibold text-indigo-600">
                      Verse {verse.number}
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                      {verse.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
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
            )}

            {/* Images if available */}
            {hymn.imageUrl && hymn.imageUrl.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg font-serif font-semibold mb-3 sm:mb-4 text-indigo-800 flex items-center">
                  <BookOpen size={18} className="mr-2" />
                  Music Sheet
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {hymn.imageUrl.map((img, index) => (
                    <div
                      key={index}
                      className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg shadow-md group cursor-pointer relative"
                      onClick={() => openImageModal(img)}
                    >
                      <Image
                        src={img}
                        alt={`${hymn.title} music sheet ${index + 1}`}
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Maximize2 size={24} className="text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related hymns */}
        {relatedHymns.length > 0 && (
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
                      <Music
                        size={30}
                        sm={{ size: 40 }}
                        className="text-indigo-400"
                      />
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
        )}

        {/* Navigation buttons */}
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
              href={`/hymns/hymn-detail/${parseInt(hymn.hymnNumber) - 1}`}
              className={`px-4 py-2 rounded-lg shadow flex items-center ${
                parseInt(hymn.hymnNumber) > 1
                  ? "bg-white text-indigo-600 hover:bg-indigo-50"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              } transition-colors`}
              onClick={(e) => {
                if (parseInt(hymn.hymnNumber) <= 1) {
                  e.preventDefault();
                }
              }}
            >
              <ArrowLeft size={18} className="mr-2" />
              Previous
            </Link>

            <Link
              href={`/hymns/hymn-detail/${parseInt(hymn.hymnNumber) + 1}`}
              className="px-4 py-2 bg-white text-indigo-600 rounded-lg shadow hover:bg-indigo-50 flex items-center transition-colors"
            >
              Next
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
      <CommentsList hymnId={id} />

      {/* Decorative footer element */}
      <div className="py-6 text-center">
        <div className="inline-block">
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded mx-auto"></div>
        </div>
      </div>

      {/* Full screen image modal */}
      {expandedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <Image
              src={expandedImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HymnDetailPage;
