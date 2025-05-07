"use client";
import axios from "axios";
import { Github, Heart, Instagram, Mail, Music, Twitter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value); // Directly set the string value
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/newsletter", { email });

      if (response.status === 200) {
        toast.success("Subscribed successfully!");
        setEmail("");
        setIsSubscribed(true); // Show success message

        // Hide it after 5 seconds
        setTimeout(() => {
          setIsSubscribed(false);
        }, 5000);
      } else {
        throw new Error("Subscription failed");
      }
    } catch (error) {
      console.error("Error sending newsletter email", error);
      toast.error(
        error.response?.data?.message ||
          "Subscription failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <footer className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 ">
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
                href="https://twitter.com/Af38133Gamestar"
                className="bg-indigo-800/50 p-2 rounded-full hover:bg-indigo-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.instagram.com/gamestar010/"
                className="bg-indigo-800/50 p-2 rounded-full hover:bg-indigo-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://github.com/OmwansaObed/"
                className="bg-indigo-800/50 p-2 rounded-full hover:bg-indigo-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={20} />
              </a>
              <a
                href="mailto:gamestaraficionado@gmail.com"
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
                  href="/about-us"
                  className="text-indigo-200 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy"
                  className="text-indigo-200 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-use"
                  className="text-indigo-200 hover:text-white transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          {/* Newsletter */}
          <form onSubmit={handleSubmit} className="col-span-1">
            <h3 className="font-serif font-bold text-lg mb-4 text-indigo-200">
              Stay Updated
            </h3>

            {/* Success Message */}
            {isSubscribed ? (
              <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-200 text-sm mb-4 animate-fade-in">
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 text-green-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>You're all set! Thank you for subscribing.</span>
                </div>
              </div>
            ) : (
              <>
                <p className="text-indigo-200 mb-3">
                  Subscribe to receive new hymns and updates
                </p>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Your email address"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-full bg-indigo-800/50 border border-indigo-700 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`absolute right-1 top-1 rounded-full px-4 py-1 text-sm font-medium transition-all ${
                      isSubmitting
                        ? "bg-indigo-700 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                    } text-white`}
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Decorative divider */}
        <div className="py-8">
          <div className="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        </div>

        {/* Bottom footer */}
        <div className="text-center text-indigo-300 text-sm">
          <p>© {currentYear} Hymonella. All rights reserved.</p>
          <p className="mt-2">
            Made with <Heart size={14} className="inline text-pink-500" /> for
            hymn lovers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};
