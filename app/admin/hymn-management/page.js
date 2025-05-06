// pages/admin/hymns/index.js
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Music,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Heart,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Download,
  Bookmark,
  Calendar,
} from "lucide-react";
import Sidebar from "@/components/home/admin/SideBar";
import LoadingSpinner from "@/components/home/general/LoadingSpinner";

const HymnManagementPage = () => {
  const [hymns, setHymns] = useState([]);
  const [filteredHymns, setFilteredHymns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [hymnToDelete, setHymnToDelete] = useState(null);

  // Fetch hymns and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch hymns
        const hymnsResponse = await axios.get("/api/hymns");
        setHymns(hymnsResponse.data);
        setFilteredHymns(hymnsResponse.data);

        console.log("Hymns res", hymnsResponse.data);

        // Fetch categories
        const categoriesResponse = await axios.get("/api/categories");
        setCategories(categoriesResponse.data);
      } catch (err) {
        setError(
          "Failed to load hymns and categories. Please try again later."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters, sorting, and search
  useEffect(() => {
    let result = [...hymns];

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((hymn) => hymn.category.name === selectedCategory);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (hymn) =>
          hymn.title.toLowerCase().includes(searchLower) ||
          hymn.author.toLowerCase().includes(searchLower) ||
          hymn.category.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let fieldA, fieldB;
      if (sortField === "category") {
        fieldA = a.category?.name?.toLowerCase();
        fieldB = b.category?.name?.toLowerCase();
      } else {
        fieldA =
          typeof a[sortField] === "string"
            ? a[sortField].toLowerCase()
            : a[sortField];
        fieldB =
          typeof b[sortField] === "string"
            ? b[sortField].toLowerCase()
            : b[sortField];
      }

      // Handle string sorting
      if (typeof fieldA === "string") {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
      }

      if (sortDirection === "asc") {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });

    setFilteredHymns(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [hymns, searchTerm, sortField, sortDirection, selectedCategory]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHymns.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHymns.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle delete confirmation
  const handleDeleteConfirmation = (hymn) => {
    setHymnToDelete(hymn);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/admin/hymns/${hymnToDelete._id}`);
      setHymns((prevHymns) =>
        prevHymns.filter((hymn) => hymn._id !== hymnToDelete._id)
      );
      setFilteredHymns((prevFiltered) =>
        prevFiltered.filter((hymn) => hymn._id !== hymnToDelete._id)
      );
      setShowDeleteConfirmation(false);
      setHymnToDelete(null);
    } catch (err) {
      setError("Failed to delete hymn. Please try again.");
      console.error(err);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setHymnToDelete(null);
  };

  // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex pt-[60px]">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Hymn Management
          </h1>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search hymns..."
                value={searchTerm}
                onChange={handleSearch}
                className="px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <Search
                className="absolute left-3 top-3 text-gray-500"
                size={20}
              />
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <label htmlFor="category-filter" className="mr-2 text-gray-600">
                Filter by Category:
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">All</option>

                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hymns Table */}
          {loading ? (
            <div className="text-center">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center border-l-4 border-red-500">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th
                      onClick={() => handleSort("title")}
                      className="cursor-pointer py-3 px-4 bg-indigo-50 text-left text-gray-700"
                    >
                      <div className="flex items-center">
                        Title{" "}
                        {sortField === "title" ? (
                          sortDirection === "asc" ? (
                            <ArrowUpDown size={16} className="ml-2" />
                          ) : (
                            <ArrowUpDown
                              size={16}
                              className="ml-2 transform rotate-180"
                            />
                          )
                        ) : null}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("author")}
                      className="cursor-pointer py-3 px-4 bg-indigo-50 text-left text-gray-700"
                    >
                      <div className="flex items-center">
                        Author{" "}
                        {sortField === "author" ? (
                          sortDirection === "asc" ? (
                            <ArrowUpDown size={16} className="ml-2" />
                          ) : (
                            <ArrowUpDown
                              size={16}
                              className="ml-2 transform rotate-180"
                            />
                          )
                        ) : null}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("category")}
                      className="cursor-pointer py-3 px-4 bg-indigo-50 text-left text-gray-700"
                    >
                      <div className="flex items-center">
                        Category{" "}
                        {sortField === "category" ? (
                          sortDirection === "asc" ? (
                            <ArrowUpDown size={16} className="ml-2" />
                          ) : (
                            <ArrowUpDown
                              size={16}
                              className="ml-2 transform rotate-180"
                            />
                          )
                        ) : null}
                      </div>
                    </th>
                    {/* <th
                      onClick={() => handleSort("views")}
                      className="cursor-pointer py-3 px-4 bg-indigo-50 text-left text-gray-700"
                    >
                      <div className="flex items-center">
                        Views{" "}
                        {sortField === "views" ? (
                          sortDirection === "asc" ? (
                            <ArrowUpDown size={16} className="ml-2" />
                          ) : (
                            <ArrowUpDown
                              size={16}
                              className="ml-2 transform rotate-180"
                            />
                          )
                        ) : null}
                      </div>
                    </th> */}
                    <th
                      onClick={() => handleSort("favorites")}
                      className="cursor-pointer py-3 px-4 bg-indigo-50 text-left text-gray-700"
                    >
                      <div className="flex items-center">
                        Favorites{" "}
                        {sortField === "favorites" ? (
                          sortDirection === "asc" ? (
                            <ArrowUpDown size={16} className="ml-2" />
                          ) : (
                            <ArrowUpDown
                              size="16"
                              className="ml-2 transform rotate-180"
                            />
                          )
                        ) : null}
                      </div>
                    </th>

                    <th className="py-3 px-4 bg-indigo-50 text-left text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((hymn) => (
                    <tr key={hymn._id}>
                      <td className="py-3 px-4 border-t border-gray-200">
                        <Link
                          href={`/hymns/hymn-detail/${hymn._id}`}
                          className="text-indigo-600 hover:underline"
                        >
                          {hymn.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4 border-t text-black border-gray-200">
                        {hymn.author}
                      </td>

                      <td className="py-3 px-4 border-t text-black border-gray-200">
                        {hymn.category?.name}
                      </td>
                      <td className="py-3 px-4 border-t text-black border-gray-200">
                        {hymn.views}
                      </td>
                      {/* <td className="py-3 px-4 border-t border-gray-200">
                        {hymn.favorites}
                      </td> */}

                      <td className="py-3 px-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/hymns/hymn-detail/${hymn._id}`}
                            aria-label="View"
                          >
                            <Eye
                              size={20}
                              className="text-gray-500 hover:text-indigo-600"
                            />
                          </Link>
                          <Link
                            href={`/admin/hymns/edit/${hymn._id}`}
                            aria-label="Edit"
                          >
                            <Edit2
                              size={20}
                              className="text-gray-500 hover:text-indigo-600"
                            />
                          </Link>
                          <button
                            onClick={() => handleDeleteConfirmation(hymn)}
                            aria-label="Delete"
                          >
                            <Trash2
                              size={20}
                              className="text-gray-500 hover:text-red-600"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-center mt-6">
                <nav>
                  <ul className="flex">
                    <li className="mr-3">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200 disabled:bg-gray-200 disabled:text-gray-400"
                      >
                        <ChevronLeft size={16} />
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <li key={index} className="mr-3">
                        <button
                          onClick={() => paginate(index + 1)}
                          className={`px-3 py-2 rounded-md ${
                            currentPage === index + 1
                              ? "bg-indigo-600 text-white"
                              : "bg-indigo-100 text-indigo-600"
                          } hover:bg-indigo-200`}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li className="mr-3">
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200 disabled:bg-gray-200 disabled:text-gray-400"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
                <p>
                  Are you sure you want to delete the hymn "{hymnToDelete.title}
                  "?
                </p>
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HymnManagementPage;
