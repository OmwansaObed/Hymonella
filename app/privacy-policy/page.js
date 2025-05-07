"use client";

import React from "react";
import Link from "next/link";
import { Shield, Lock, ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Link
          href="/"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors mb-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 lg:p-10 border-l-4 border-indigo-400">
          <div className="flex items-center mb-6">
            <Shield size={28} className="text-indigo-500 mr-3" />
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Privacy Policy
            </h1>
          </div>

          <div className="prose max-w-none text-gray-700">
            <p className="text-gray-500 mb-6">Effective Date: May 7, 2025</p>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-indigo-700 mt-8 mb-4">
              Introduction
            </h2>
            <p>
              Welcome to our Hymnal Web Application. We respect your privacy and
              are committed to protecting your personal information. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our hymnal service.
            </p>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-indigo-700 mt-8 mb-4">
              Information We Collect
            </h2>

            <h3 className="text-lg font-serif font-semibold text-indigo-600 mt-6 mb-3">
              Personal Information
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account Information</strong>: When you create an
                account, we collect your name, email address, and password.
              </li>
              <li>
                <strong>Profile Information</strong>: profile pictures or other
                information are collected when you use social features to login
              </li>
              <li>
                <strong>Authentication Data</strong>: When you sign in using
                third-party services (like Google or Facebook), we receive basic
                profile information from these providers.
              </li>
            </ul>

            <h3 className="text-lg font-serif font-semibold text-indigo-600 mt-6 mb-3">
              Usage Information
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Interaction Data</strong>: Hymns you view, play, or
                comment on.
              </li>
              <li>
                <strong>Comments and Contributions</strong>: Any reflections,
                comments, or content you share within the community.
              </li>
              <li>
                <strong>Audio Usage</strong>: Information about how you interact
                with audio playback features.
              </li>
            </ul>

            <h3 className="text-lg font-serif font-semibold text-indigo-600 mt-6 mb-3">
              Technical Information
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Device Information</strong>: Browser type, operating
                system, and device type.
              </li>
              <li>
                <strong>Log Data</strong>: IP address, access times, pages
                viewed, and app features used.
              </li>
              <li>
                <strong>Cookies and Similar Technologies</strong>: Information
                collected through cookies to enhance your browsing experience.
              </li>
            </ul>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-indigo-700 mt-8 mb-4">
              How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our hymnal service</li>
              <li>Process and respond to your comments and requests</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>
                Enable community features like comments and shared reflections
              </li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Protect against unauthorized access and potential abuse</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-indigo-700 mt-8 mb-4">
              Sharing Your Information
            </h2>
            <p>We may share information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Service Providers</strong>: Third parties who provide
                services such as hosting, analytics, and customer support.
              </li>
              <li>
                <strong>With Your Consent</strong>: When you explicitly agree to
                the sharing of your information.
              </li>
              <li>
                <strong>Legal Requirements</strong>: To comply with applicable
                laws, regulations, or legal processes.
              </li>
            </ul>
            <p className="mt-4">
              We do not sell your personal information to third parties.
            </p>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-indigo-700 mt-8 mb-4">
              Your Choices
            </h2>
            <p>You can:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                For any update use the contact form in the about page to request
                changes
              </li>
              <li>Control cookie settings through your browser</li>
              <li>Opt-out of promotional communications</li>
              <li>Request deletion of your account and associated data</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-indigo-700 mt-8 mb-4">
              Data Security
            </h2>
            <div className="bg-indigo-50 p-4 md:p-6 rounded-xl mb-6 flex items-start">
              <Lock size={20} className="text-indigo-500 mr-3 mt-1" />
              <p className="m-0">
                We implement reasonable security measures to protect your
                information from unauthorized access, alteration, or
                destruction. However, no internet transmission is completely
                secure, and we cannot guarantee the security of information
                transmitted through our platform.
              </p>
            </div>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-indigo-700 mt-8 mb-4">
              Children&apos;s Privacy
            </h2>
            <p>
              Our service is not directed to children under 13, and we do not
              knowingly collect personal information from children under 13. If
              you believe we have inadvertently collected such information,
              please contact us immediately.
            </p>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-indigo-700 mt-8 mb-4">
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy periodically to reflect changes
              in our practices. We will notify you of any significant changes by
              posting a notice on our website or sending you an email.
            </p>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-indigo-700 mt-8 mb-4">
              Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or our privacy
              practices, please contact us at:
            </p>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 md:p-6 rounded-xl mt-4">
              <p className="font-medium text-indigo-700 mb-2">
                Email: info-hymonella@gmail.com
              </p>
              <p className="font-medium text-indigo-700">
                Address: info-hymonella@gmail.com
              </p>
            </div>

            <div className="border-t border-indigo-100 mt-10 pt-6 text-sm text-gray-500 text-right">
              <p>This privacy policy was last updated on May 7, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
