"use client";
import { useState, useEffect } from "react";
import { Mail, Calendar, Eye } from "lucide-react";
import axios from "axios";
import LoadingSpinner from "@/components/home/general/LoadingSpinner";
import Sidebar from "@/components/home/admin/SideBar";
import toast from "react-hot-toast";

// View Details Modal Component
const ContactDetailsModal = ({ isOpen, contact, onClose }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 shadow-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-black mb-4">
            News Letter Details
          </h3>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500">Email</h4>
            <p className="text-indigo-600">{contact?.email}</p>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500">Date Received</h4>
            <p className="text-gray-800">{formatDate(contact?.createdAt)}</p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const ReceivedContactsAdmin = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/newsletter`);
      setContacts(response.data?.contacts || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setContacts([]);
      setError(err?.response?.data?.message || "Failed to load Emails");
      toast.error("Error loading emails");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength = 60) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4">
      <Sidebar />
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            NewsLetter Submissions
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-serif font-semibold mb-4 text-gray-800">
              All Newsletter Emails
            </h2>
            <div className="flex items-center space-x-2">
              <Mail size={18} className="text-indigo-600" />
              <p className="text-sm text-gray-600">
                {contacts.length} email{contacts.length !== 1 ? "s" : ""}{" "}
                received
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <LoadingSpinner />
            </div>
          ) : contacts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">No Email submissions found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-black">
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className="border-b hover:bg-gray-50 text-gray-700"
                    >
                      <td className="p-4 text-indigo-600">{contact.email}</td>

                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-gray-500" />
                          {formatDate(contact.createdAt)}
                        </div>
                      </td>
                      <td className="p-4 flex justify-end space-x-2">
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ContactDetailsModal
        isOpen={!!selectedContact}
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
      />
    </div>
  );
};

export default ReceivedContactsAdmin;
