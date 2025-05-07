"use client";

import React from "react";
import Link from "next/link";
import { ScrollText, FileText, ArrowLeft } from "lucide-react";

export default function TermsOfUse() {
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

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 lg:p-10 border-l-4 border-purple-400">
          <div className="flex items-center mb-6">
            <ScrollText size={28} className="text-purple-500 mr-3" />
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Terms of Use
            </h1>
          </div>

          <div className="prose max-w-none text-gray-700">
            <p className="text-gray-500 mb-6">Effective Date: May 7, 2025</p>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-purple-700 mt-8 mb-4">
              Welcome to Our Hymnal Web Application
            </h2>
            <p>
              These Terms of Use govern your access to and use of our hymnal web
              application, including any content, functionality, and services
              offered through our website or mobile application (collectively,
              the "Service").
            </p>

            <p>
              Please read these Terms carefully before using our Service. By
              accessing or using the Service, you agree to be bound by these
              Terms. If you do not agree to these Terms, please do not access or
              use our Service.
            </p>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 md:p-6 rounded-xl my-6">
              <div className="flex items-center mb-2">
                <FileText size={18} className="text-purple-500 mr-2" />
                <h3 className="text-lg font-medium text-purple-700 m-0">
                  Quick Summary
                </h3>
              </div>
              <p className="m-0 text-sm">
                This agreement outlines your rights and responsibilities when
                using our hymnal application. It covers account usage, content
                sharing, intellectual property, prohibited activities, and our
                service limitations.
              </p>
            </div>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-purple-700 mt-8 mb-4">
              1. Account Registration
            </h2>

            <h3 className="text-lg font-serif font-semibold text-indigo-600 mt-6 mb-3">
              1.1 Account Creation
            </h3>
            <p>
              To access certain features of the Service, you may be required to
              register for an account. When registering, you agree to provide
              accurate, current, and complete information and to update such
              information to keep it accurate, current, and complete.
            </p>

            <h3 className="text-lg font-serif font-semibold text-indigo-600 mt-6 mb-3">
              1.2 Account Security
            </h3>
            <p>
              You are responsible for safeguarding your password and for all
              activities that occur under your account. You agree to notify us
              immediately of any unauthorized use of your account or any other
              breach of security.
            </p>

            <h3 className="text-lg font-serif font-semibold text-indigo-600 mt-6 mb-3">
              1.3 Age Requirement
            </h3>
            <p>
              You must be at least 13 years of age to create an account. By
              creating an account, you represent that you are at least 13 years
              old.
            </p>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-purple-700 mt-8 mb-4">
              2. User Content
            </h2>

            <h3 className="text-lg font-serif font-semibold text-indigo-600 mt-6 mb-3">
              2.1 Comments and Contributions
            </h3>
            <p>
              Our Service allows you to post, link, store, share, and otherwise
              make available certain information, text, or material ("User
              Content"), such as comments on hymns. You retain ownership rights
              in your User Content.
            </p>

            <h3 className="text-lg font-serif font-semibold text-indigo-600 mt-6 mb-3">
              2.2 License Grant
            </h3>
            <p>
              By posting User Content, you grant us a worldwide, non-exclusive,
              royalty-free license to use, reproduce, modify, adapt, publish,
              translate, and distribute your User Content in any existing or
              future media formats.
            </p>

            <h3 className="text-lg font-serif font-semibold text-indigo-600 mt-6 mb-3">
              2.3 Content Standards
            </h3>
            <p>You agree that User Content will not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable law or regulation</li>
              <li>Infringe upon any intellectual property rights</li>
              <li>Contain defamatory, offensive, or harmful content</li>
              <li>Impersonate any person or entity</li>
              <li>Contain unauthorized advertising or solicitations</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-purple-700 mt-8 mb-4">
              3. Intellectual Property Rights
            </h2>

            <h3 className="text-lg font-serif font-semibold text-indigo-600 mt-6 mb-3">
              3.1 Service Content
            </h3>
            <p>
              The Service and its original content (excluding User Content),
              features, and functionality are owned by us and are protected by
              copyright, trademark, and other intellectual property laws.
            </p>

            <h3 className="text-lg font-serif font-semibold text-indigo-600 mt-6 mb-3">
              3.2 Hymnal Content
            </h3>
            <p>
              Hymns, musical compositions, and recordings available through the
              Service may be protected by copyright. You may use these materials
              for personal, non-commercial purposes only, unless otherwise
              specified.
            </p>

            <h3 className="text-lg font-serif font-semibold text-indigo-600 mt-6 mb-3">
              3.3 Limited License
            </h3>
            <p>
              We grant you a limited, non-exclusive, non-transferable, revocable
              license to access and use the Service for personal, non-commercial
              purposes.
            </p>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-purple-700 mt-8 mb-4">
              4. Prohibited Uses
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Use the Service in any way that violates any applicable law or
                regulation
              </li>
              <li>
                Use the Service to impersonate or attempt to impersonate any
                person or entity
              </li>
              <li>
                Interfere with or disrupt the Service or servers or networks
                connected to the Service
              </li>
              <li>
                Attempt to gain unauthorized access to any portion of the
                Service
              </li>
              <li>
                Use any robot, spider, or other automatic device to access the
                Service
              </li>
              <li>
                Engage in any data mining or similar data gathering activities
              </li>
            </ul>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-purple-700 mt-8 mb-4">
              5. Service Modifications and Termination
            </h2>

            <h3 className="text-lg font-serif font-semibold text-indigo-600 mt-6 mb-3">
              5.1 Service Changes
            </h3>
            <p>
              We reserve the right to modify or discontinue, temporarily or
              permanently, the Service or any features or portions thereof
              without prior notice.
            </p>

            <h3 className="text-lg font-serif font-semibold text-indigo-600 mt-6 mb-3">
              5.2 Account Termination
            </h3>
            <p>
              We may terminate or suspend your account and access to the Service
              immediately, without prior notice, for conduct that we believe
              violates these Terms or is harmful to other users, us, or third
              parties, or for any other reason.
            </p>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-purple-700 mt-8 mb-4">
              6. Disclaimer of Warranties
            </h2>
            <div className="bg-indigo-50 p-4 md:p-6 rounded-xl my-4">
              <p className="uppercase font-bold text-sm text-indigo-700 mb-2">
                IMPORTANT NOTICE:
              </p>
              <p className="m-0">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING,
                BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
            </div>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-purple-700 mt-8 mb-4">
              7. Limitation of Liability
            </h2>
            <p>
              IN NO EVENT SHALL WE, OUR DIRECTORS, EMPLOYEES, PARTNERS, AGENTS,
              SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT
              LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER
              INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR
              INABILITY TO ACCESS OR USE THE SERVICE.
            </p>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-purple-700 mt-8 mb-4">
              8. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of [Your Jurisdiction], without regard to its conflict of
              law provisions.
            </p>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-purple-700 mt-8 mb-4">
              9. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify or replace these Terms at any time.
              If a revision is material, we will provide at least 30 days'
              notice prior to any new terms taking effect.
            </p>

            <h2 className="text-xl md:text-2xl font-serif font-bold text-purple-700 mt-8 mb-4">
              10. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 md:p-6 rounded-xl mt-4">
              <p className="font-medium text-indigo-700 mb-2">
                Email: terms@hymnalapp.com
              </p>
              <p className="font-medium text-indigo-700">
                Postal Address: Hymnal App Legal Team, 123 Music Lane, Harmony
                City, HC 12345
              </p>
            </div>

            <div className="border-t border-indigo-100 mt-10 pt-6 text-sm text-gray-500 text-right">
              <p>These Terms of Use were last updated on May 7, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
