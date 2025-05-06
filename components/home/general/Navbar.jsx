"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Music,
  Book,
  Heart,
  Menu,
  X,
  Home,
  BookOpen,
  LayoutDashboard,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  // Track scrolling for navbar appearance change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get user initials for fallback avatar
  const getUserInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Music
            size={28}
            className={`transition-colors ${
              isScrolled ? "text-indigo-600" : "text-indigo-500"
            }`}
          />
          <span
            className={`font-serif font-bold text-xl ${
              isScrolled
                ? "text-gray-800"
                : "text-transparent bg-clip-text bg-white/90"
            }`}
          >
            Hymonella
          </span>
        </Link>

        {/* Desktop Navigation - Properly structured with main nav and user sections */}
        <div className="hidden md:flex items-center">
          {/* Main Navigation Links */}
          <nav className="flex items-center space-x-1 mr-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-full transition-all flex items-center space-x-1 ${
                isScrolled
                  ? "hover:bg-indigo-50 text-gray-700 hover:text-indigo-600"
                  : "hover:bg-white/20 text-indigo-50 hover:text-white"
              }`}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>

            <Link
              href="/hymns"
              className={`px-3 py-2 rounded-full transition-all flex items-center space-x-1 ${
                isScrolled
                  ? "hover:bg-indigo-50 text-gray-700 hover:text-indigo-600"
                  : "hover:bg-white/20 text-indigo-50 hover:text-white"
              }`}
            >
              <Book size={18} />
              <span>Hymns</span>
            </Link>

            <Link
              href="/favorites"
              className={`px-3 py-2 rounded-full transition-all flex items-center space-x-1 ${
                isScrolled
                  ? "hover:bg-indigo-50 text-gray-700 hover:text-indigo-600"
                  : "hover:bg-white/20 text-indigo-50 hover:text-white"
              }`}
            >
              <Heart size={18} />
              <span>Favorites</span>
            </Link>

            <Link
              href="/hymns/categories"
              className={`px-3 py-2 rounded-full transition-all flex items-center space-x-1 ${
                isScrolled
                  ? "hover:bg-indigo-50 text-gray-700 hover:text-indigo-600"
                  : "hover:bg-white/20 text-indigo-50 hover:text-white"
              }`}
            >
              <BookOpen size={18} />
              <span>Categories</span>
            </Link>
          </nav>

          {/* Dashboard and User Profile Section */}
          <div className="flex items-center space-x-2">
            {session?.user?.isAdmin && (
              <Link
                href="/admin/dashboard"
                className={`px-3 py-2 rounded-full transition-all flex items-center space-x-1 ${
                  isScrolled
                    ? "hover:bg-indigo-50 text-pink-500 hover:text-indigo-600"
                    : "hover:text-white hover:bg-indigo-400 text-pink-500"
                }`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            )}

            {/* User Profile or Login Button */}
            {session ? (
              <div className="relative group ml-2 rounded-lg shadow-lg">
                <button
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isScrolled
                      ? "bg-indigo-100 hover:bg-indigo-200"
                      : "bg-white/20 hover:bg-white/30"
                  } transition-colors`}
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="User profile"
                      className="w-full h-full border border-gray-300 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      className={`font-medium ${
                        isScrolled ? "text-indigo-600" : "text-white"
                      }`}
                    >
                      {getUserInitials(session.user.name)}
                    </span>
                  )}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-700">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session.user.email}
                    </p>
                  </div>

                  <button
                    onClick={() => signOut()}
                    className="block w-full text-center px-4 py-2 text-sm text-black bg-gray-200 hover:text-white hover:bg-red-600"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className={`ml-2 px-4 py-2 rounded-md transition-all flex items-center space-x-1 ${
                  isScrolled
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-white/20 hover:bg-white/30 text-white"
                }`}
              >
                <UserIcon size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-indigo-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md animate-fadeIn">
          <div className="flex flex-col p-4 space-y-2">
            <Link
              href="/"
              className="p-3 flex items-center space-x-3 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-indigo-500">
                <Home size={18} />
              </span>
              <span>Home</span>
            </Link>

            <Link
              href="/hymns"
              className="p-3 flex items-center space-x-3 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-indigo-500">
                <Book size={18} />
              </span>
              <span>Hymns</span>
            </Link>

            <Link
              href="/favorites"
              className="p-3 flex items-center space-x-3 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-indigo-500">
                <Heart size={18} />
              </span>
              <span>Favorites</span>
            </Link>

            <Link
              href="/hymns/categories"
              className="p-3 flex items-center space-x-3 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-indigo-500">
                <BookOpen size={18} />
              </span>
              <span>Categories</span>
            </Link>

            {session?.user?.isAdmin && (
              <Link
                href="/admin/dashboard"
                className="p-3 flex items-center space-x-3 rounded-lg hover:bg-indigo-50 text-pink-500 hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-indigo-500">
                  <LayoutDashboard size={18} />
                </span>
                <span>Dashboard</span>
              </Link>
            )}

            {session ? (
              <>
                <div className="p-3 flex items-center space-x-3 rounded-lg">
                  <div className="flex items-center space-x-3 border border-white rounded-full ">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="User profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {getUserInitials(session.user.name)}
                        </span>
                      </div>
                    )}
                    <span className="text-gray-700">{session.user.name}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="p-3 pl-12 flex items-center space-x-3 text-white bg-red-500 rounded-lg hover:bg-red-600 text-left"
                >
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="p-3 flex items-center space-x-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserIcon size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
