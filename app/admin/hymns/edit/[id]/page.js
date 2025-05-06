"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Music,
  Save,
  ArrowLeft,
  FileText,
  User,
  Tag,
  Clock,
  Globe,
  Heart,
  Trash2,
} from "lucide-react";
import Sidebar from "@/components/home/admin/SideBar";
import LoadingSpinner from "@/components/home/general/LoadingSpinner";

import toast from "react-hot-toast";
import UploadImage from "@/components/uploadthing/uploadImage";
import UploadAudio from "@/components/uploadthing/uploadAudio";

const EditHymnPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    lyrics: "",
    imageUrl: [],
    duration: "",
    language: "English",
    notes: "",
    tags: [],
    favoriteCount: 0,
    audioUrl: null,
    hymnNumber: "",
  });

  const [validation, setValidation] = useState({
    title: true,
    author: true,
    category: true,
    lyrics: true,
  });

  // Fetch hymn data and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch hymn data
        const hymnResponse = await axios.get(`/api/hymns/${id}`);
        const hymnData = hymnResponse.data;

        // Fetch categories
        const categoriesResponse = await axios.get("/api/categories");
        const categoriesData = categoriesResponse.data;

        setCategories(categoriesData);
        console.log("Hymn data:", hymnData);
        // Set form data with existing hymn data
        setFormData({
          title: hymnData.title || "",
          author: hymnData.author || "",
          category: hymnData.category?._id || hymnData.category || "",
          lyrics: hymnData.lyrics || "",
          imageUrl: hymnData.imageUrl || [],
          duration: hymnData.duration || "",
          language: hymnData.language || "English",
          notes: hymnData.notes || "",
          tags: hymnData.tags || [],
          favoriteCount: hymnData.favoriteCount || 0,
          audioUrl: hymnData.audioUrl || null,
          hymnNumber: hymnData.hymnNumber || "",
          history: hymnData.history || "",
        });
      } catch (err) {
        setError("Failed to load hymn data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle image upload changes
  const handleImagesChange = (newImages) => {
    console.log("Images updated:", newImages);
    setFormData((prev) => ({
      ...prev,
      imageUrl: newImages,
    }));
  };

  // Handle audio upload changes
  const handleAudioChange = (audioFile) => {
    setFormData((prev) => ({
      ...prev,
      audioUrl: audioFile?.ufsUrl || null,
    }));
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation errors as user types
    if (validation[name] === false) {
      setValidation({
        ...validation,
        [name]: true,
      });
    }
  };

  // Handle tags input
  const handleTagsChange = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag],
        });
      }
      e.target.value = "";
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  // Toggle delete confirmation modal
  const toggleDeleteConfirmation = () => {
    setDeleteConfirmationOpen(!deleteConfirmationOpen);
  };

  // Delete hymn
  const deleteHymn = async () => {
    try {
      setSubmitting(true);

      await axios.delete(`/api/hymns/${id}`);

      toast.success("Hymn deleted successfully.");
      setTimeout(() => router.push("/admin/hymn-management"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete hymn.");
      toast.error("Failed to delete hymn");
    } finally {
      setSubmitting(false);
      setDeleteConfirmationOpen(false);
    }
  };

  // Validate form
  const validateForm = () => {
    const newValidation = {
      title: !!formData.title.trim(),
      author: !!formData.author.trim(),
      category: !!formData.category,
      lyrics: !!formData.lyrics.trim(),
    };

    setValidation(newValidation);

    return Object.values(newValidation).every((isValid) => isValid);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      console.log("Updated form data:", formData);

      await axios.put(`/api/hymns/${id}`, formData);

      setSuccess(true);
      toast.success("Hymn updated successfully.");
      setTimeout(() => router.push("/admin/hymn-management"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update hymn.");
      toast.error("Failed to update hymn");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete confirmation modal
  const DeleteConfirmationModal = () => (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${
        deleteConfirmationOpen ? "block" : "hidden"
      }`}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Delete Hymn
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this hymn? This action
                    cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={deleteHymn}
              disabled={submitting}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {submitting ? "Deleting..." : "Delete"}
            </button>
            <button
              type="button"
              onClick={toggleDeleteConfirmation}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center">
                <Music className="mr-2 text-indigo-500" />
                Edit Hymn
              </h1>

              <Link
                href="/admin/hymn-management"
                className="px-4 py-2 bg-white text-indigo-600 rounded-full shadow-md hover:bg-indigo-50 transition-all flex items-center"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back to Hymns
              </Link>
            </div>
            <p className="text-indigo-800 opacity-90 mt-1">
              Edit the details of this hymn
            </p>
          </div>

          {loading ? (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
              <div className="text-center">
                <LoadingSpinner />
              </div>
            </div>
          ) : (
            <>
              {/* Success Message */}
              {success && (
                <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-lg shadow-md flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Hymn updated successfully! Redirecting...
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-30"></div>
                  <div className="relative bg-white rounded-lg shadow-xl overflow-hidden p-8">
                    {/* Basic Info Section */}
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-indigo-700 mb-6 flex items-center">
                        <FileText size={18} className="mr-2" />
                        Basic Information
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div>
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium text-indigo-700 mb-1"
                          >
                            Hymn Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`block w-full px-4 py-3 border ${
                              validation.title
                                ? "border-indigo-200 focus:border-indigo-500"
                                : "border-red-300 focus:border-red-500"
                            } rounded-lg text-black bg-indigo-50 focus:ring-indigo-500 focus:ring-opacity-50 focus:outline-none  focus:ring-2`}
                            placeholder="Enter hymn title"
                          />
                          {!validation.title && (
                            <p className="mt-1 text-sm text-red-600">
                              Title is required
                            </p>
                          )}
                        </div>

                        {/* Author */}
                        <div>
                          <label
                            htmlFor="author"
                            className="block text-sm font-medium text-indigo-700 mb-1"
                          >
                            Author <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User size={16} className="text-indigo-400" />
                            </div>
                            <input
                              type="text"
                              id="author"
                              name="author"
                              value={formData.author}
                              onChange={handleChange}
                              className={`block w-full pl-10 pr-4 py-3 border ${
                                validation.author
                                  ? "border-indigo-200 focus:border-indigo-500"
                                  : "border-red-300 focus:border-red-500"
                              } rounded-lg bg-indigo-50 focus:ring-indigo-500 focus:ring-opacity-50 focus:outline-none text-black focus:ring-2`}
                              placeholder="Enter author name"
                            />
                          </div>
                          {!validation.author && (
                            <p className="mt-1 text-sm text-red-600">
                              Author is required
                            </p>
                          )}
                        </div>

                        {/* Category */}
                        <div>
                          <label
                            htmlFor="category"
                            className="block text-sm font-medium text-indigo-700 mb-1"
                          >
                            Category <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Tag size={16} className="text-indigo-400" />
                            </div>
                            <select
                              id="category"
                              name="category"
                              value={formData.category}
                              onChange={handleChange}
                              className={`block w-full pl-10 pr-10 py-3 border ${
                                validation.category
                                  ? "border-indigo-200 focus:border-indigo-500"
                                  : "border-red-300 focus:border-red-500"
                              } rounded-lg bg-indigo-50 focus:ring-indigo-500 focus:ring-opacity-50 focus:outline-none text-black focus:ring-2 appearance-none`}
                            >
                              <option value="">Select Category</option>
                              {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <svg
                                className="h-5 w-5 text-indigo-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                          {!validation.category && (
                            <p className="mt-1 text-sm text-red-600">
                              Category is required
                            </p>
                          )}

                          {/* New Category Link */}
                          <div className="mt-2 flex justify-end">
                            <Link
                              href="/admin/categories/add"
                              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                            >
                              <Heart size={14} className="mr-1" />
                              Manage Categories
                            </Link>
                          </div>
                        </div>

                        {/* Duration */}
                        <div>
                          <label
                            htmlFor="duration"
                            className="block text-sm font-medium text-indigo-700 mb-1"
                          >
                            Duration
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Clock size={16} className="text-indigo-400" />
                            </div>
                            <input
                              type="text"
                              id="duration"
                              name="duration"
                              value={formData.duration}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-4 py-3 border border-indigo-200 focus:border-indigo-500 rounded-lg bg-indigo-50 focus:ring-indigo-500 focus:ring-opacity-50 focus:outline-none text-black focus:ring-2"
                              placeholder="e.g. 3:45"
                            />
                          </div>
                          <p className="mt-1 text-sm text-indigo-600">
                            Optional: Format as minutes:seconds
                          </p>
                        </div>

                        {/* Language */}
                        <div>
                          <label
                            htmlFor="language"
                            className="block text-sm font-medium text-indigo-700 mb-1"
                          >
                            Language
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Globe size={16} className="text-indigo-400" />
                            </div>
                            <input
                              type="text"
                              id="language"
                              name="language"
                              value={formData.language}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-4 py-3 border border-indigo-200 focus:border-indigo-500 rounded-lg bg-indigo-50 focus:ring-indigo-500 focus:ring-opacity-50 focus:outline-none text-black focus:ring-2"
                              placeholder="e.g. English"
                            />
                          </div>
                        </div>

                        {/* Hymn Number */}
                        <div>
                          <label
                            htmlFor="hymnNumber"
                            className="block text-sm font-medium text-indigo-700 mb-1"
                          >
                            Hymn Number
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Music size={16} className="text-indigo-400" />
                            </div>
                            <input
                              type="text"
                              id="hymnNumber"
                              name="hymnNumber"
                              value={formData.hymnNumber}
                              onChange={handleChange}
                              className="block w-full pl-10 pr-4 py-3 border border-indigo-200 focus:border-indigo-500 rounded-lg bg-indigo-50 focus:ring-indigo-500 focus:ring-opacity-50 focus:outline-none text-black focus:ring-2"
                              placeholder="e.g. 33"
                            />
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="md:col-span-2">
                          <label
                            htmlFor="tags"
                            className="block text-sm font-medium text-indigo-700 mb-1"
                          >
                            Tags
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Tag size={16} className="text-indigo-400" />
                            </div>
                            <input
                              type="text"
                              id="tags"
                              name="tags"
                              onKeyDown={handleTagsChange}
                              className="block w-full pl-10 pr-4 py-3 border border-indigo-200 focus:border-indigo-500 rounded-lg bg-indigo-50 focus:ring-indigo-500 focus:ring-opacity-50 focus:outline-none text-black focus:ring-2"
                              placeholder="Type tag and press Enter"
                            />
                          </div>
                          <p className="mt-1 text-sm text-indigo-600">
                            Optional: Add tags to make hymns easier to find
                          </p>

                          {/* Tag Display */}
                          {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {formData.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                                >
                                  {tag}
                                  <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="ml-1.5 h-4 w-4 rounded-full flex items-center justify-center text-indigo-600 hover:bg-indigo-200"
                                  >
                                    <span className="sr-only">Remove tag</span>×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Lyrics Section */}
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-indigo-700 mb-6 flex items-center">
                        <Music size={18} className="mr-2" />
                        Hymn Lyrics
                      </h2>

                      <div>
                        <label
                          htmlFor="lyrics"
                          className="block text-sm font-medium text-indigo-700 mb-1"
                        >
                          Lyrics <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <textarea
                            id="lyrics"
                            name="lyrics"
                            value={formData.lyrics}
                            onChange={handleChange}
                            rows={10}
                            className={`block w-full px-4 py-3 border ${
                              validation.lyrics
                                ? "border-indigo-200 focus:border-indigo-500"
                                : "border-red-300 focus:border-red-500"
                            } rounded-lg bg-indigo-50 focus:ring-indigo-500 focus:ring-opacity-50 focus:outline-none text-black focus:ring-2`}
                            placeholder="Enter hymn lyrics. Use a blank line to separate verses."
                          ></textarea>
                        </div>
                        {!validation.lyrics && (
                          <p className="mt-1 text-sm text-red-600">
                            Lyrics are required
                          </p>
                        )}
                        <p className="mt-1 text-sm text-indigo-600">
                          Separate verses with a blank line (press Enter twice)
                        </p>
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-indigo-700 mb-6 flex items-center">
                        <FileText size={18} className="mr-2" />
                        Additional Information
                      </h2>

                      <div>
                        <label
                          htmlFor="history"
                          className="block text-sm font-medium text-indigo-700 mb-1"
                        >
                          Notes
                        </label>
                        <div className="relative">
                          <textarea
                            id="history"
                            name="history"
                            value={formData.history}
                            onChange={handleChange}
                            rows={4}
                            className="block w-full px-4 py-3 border border-indigo-200 focus:border-indigo-500 rounded-lg bg-indigo-50 focus:ring-indigo-500 focus:ring-opacity-50 focus:outline-none text-black focus:ring-2"
                            placeholder="Enter any additional notes about this hymn"
                          ></textarea>
                        </div>
                        <p className="mt-1 text-sm text-indigo-600">
                          Optional: Add historical context, performance notes,
                          etc.
                        </p>
                      </div>
                    </div>

                    {/*  Upload Section */}
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-indigo-700 mb-6 flex items-center">
                        <FileText size={18} className="mr-2" />
                        Music Sheet
                      </h2>

                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                          Upload Music Sheet
                        </label>
                        <UploadImage
                          onChange={handleImagesChange}
                          existingImages={formData.imageUrl}
                        />
                        <p className="mt-1 text-sm text-gray-700">
                          Optional: Upload sheet music or other images related
                          to the hymn
                        </p>
                      </div>
                    </div>

                    {/* Audio Upload Section */}
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-indigo-600 mb-6 flex items-center">
                        <FileText size={18} className="mr-2" />
                        Audio File
                      </h2>

                      <div>
                        <label className="block text-sm font-medium text-black mb-1">
                          Upload Audio File
                        </label>
                        <UploadAudio
                          onChange={handleAudioChange}
                          existingAudio={formData.audioUrl}
                        />
                        <p className="mt-1 text-sm text-gray-800">
                          Optional: Upload audio file
                        </p>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4">
                      <Link
                        href="/admin/hymns"
                        className="px-6 py-3 bg-white border border-indigo-300 text-indigo-600 rounded-full shadow-sm hover:bg-indigo-50 transition-all"
                      >
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                      >
                        {submitting ? (
                          <>
                            <span className="ml-2">Updating...</span>
                          </>
                        ) : (
                          <>
                            <Save size={18} className="mr-2" />
                            Update Hymn
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditHymnPage;
