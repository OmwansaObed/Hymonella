"use client";
import { useState, useEffect } from "react";
import { Music, Plus, List, Settings, Users, Users2 } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import Sidebar from "@/components/home/admin/SideBar";
import LoadingSpinner from "@/components/home/general/LoadingSpinner";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalHymns: 0,
    recentlyAdded: 0,
    favorites: 0,
  });
  const [recentHymns, setRecentHymns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch hymns data
        const hymnsResponse = await axios.get("/api/hymns");

        // Fetch global favorites count
        const favoritesResponse = await axios.get(
          "/api/users/favorites?globalCount=true"
        );
        console.log("favoriteResponse", favoritesResponse);

        // Get statistics
        const totalHymns = hymnsResponse.data.length;
        const recentlyAdded = hymnsResponse.data.filter((h) => {
          const createdDate = new Date(h.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return createdDate > weekAgo;
        }).length;
        const favorites = favoritesResponse.data.count || 0;

        setStats({
          totalHymns,
          recentlyAdded,
          favorites,
        });

        // Get 5 most recent hymns
        const sortedHymns = [...hymnsResponse.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentHymns(sortedHymns.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="container mx-auto px-4 py-8 flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1">
          {loading ? (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
              <div className="text-center">
                <LoadingSpinner />
              </div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}{" "}
              <h2 className="text-2xl font-serif text-black font-bold mb-6">
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className=" text-gray-500 text-sm">Total Hymns</p>
                      <h3 className="text-3xl font-bold mt-1 text-gray-700">
                        {stats.totalHymns}
                      </h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Music size={24} className="text-blue-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link
                      href="/hymn-management"
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View all hymns →
                    </Link>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className=" text-gray-700 text-sm">Recently Added</p>
                      <h3 className="text-3xl font-bold mt-1 text-gray-700">
                        {stats.recentlyAdded}
                      </h3>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <Plus size={24} className="text-green-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">In the last 7 days</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700 text-sm">User Favorites</p>
                      <h3 className="text-3xl font-bold mt-1  text-gray-700">
                        {stats.favorites}
                      </h3>
                    </div>
                    <div className="bg-red-100 p-3 rounded-full">
                      <Users size={24} className="text-red-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Total favorites for all hymns
                    </p>
                  </div>
                </div>
              </div>
              {/* Recent Hymns */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="font-bold text-black">Recently Added Hymns</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentHymns.length > 0 ? (
                    recentHymns.map((hymn) => (
                      <div
                        key={hymn._id}
                        className="px-6 py-4 flex justify-between items-center"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {hymn.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            By {hymn.author}
                          </p>
                        </div>
                        <Link
                          href={`/admin/hymns/edit/${hymn._id}`}
                          className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors text-gray-700"
                        >
                          Edit
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="px-6 py-4 text-gray-500">No hymns found.</p>
                  )}
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <Link
                    href="/admin/hymns/add"
                    className="text-sm flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Plus size={16} className="mr-1" />
                    Add New Hymn
                  </Link>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
