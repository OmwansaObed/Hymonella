import { Github, Heart, Instagram, Mail, Music, Twitter } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Music size={32} className="text-indigo-300" />
              <span className="font-serif font-bold text-xl">Hymonella</span>
            </div>
            <p className="text-indigo-200 mb-4">
              A collection of timeless hymns for worship, reflection, and
              spiritual growth.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-indigo-800/50 p-2 rounded-full hover:bg-indigo-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="bg-indigo-800/50 p-2 rounded-full hover:bg-indigo-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="bg-indigo-800/50 p-2 rounded-full hover:bg-indigo-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="bg-indigo-800/50 p-2 rounded-full hover:bg-indigo-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-serif font-bold text-lg mb-4 text-indigo-200">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-indigo-200 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/hymns"
                  className="text-indigo-200 hover:text-white transition-colors"
                >
                  All Hymns
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="text-indigo-200 hover:text-white transition-colors"
                >
                  My Favorites
                </Link>
              </li>
              <li>
                <Link
                  href="/hymns/categories"
                  className="text-indigo-200 hover:text-white transition-colors"
                >
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="font-serif font-bold text-lg mb-4 text-indigo-200">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-indigo-200 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-indigo-200 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-indigo-200 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-indigo-200 hover:text-white transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="font-serif font-bold text-lg mb-4 text-indigo-200">
              Stay Updated
            </h3>
            <p className="text-indigo-200 mb-3">
              Subscribe to receive new hymns and updates
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2  rounded-full bg-indigo-800/50 border border-indigo-700  placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button className="absolute right-1 top-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full px-4 py-1 text-sm font-medium hover:from-indigo-500 hover:to-purple-500 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="py-8">
          <div className="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        </div>

        {/* Bottom footer */}
        <div className="text-center text-indigo-300 text-sm">
          <p>© {currentYear} Uplifting Hymns. All rights reserved.</p>
          <p className="mt-2">
            Made with <Heart size={14} className="inline text-pink-500" /> for
            hymn lovers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};
