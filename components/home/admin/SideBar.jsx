"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Music,
  Home,
  Users,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  List,
  Heart,
  LogOut,
  BarChart3,
  Bookmark,
  Search,
  Users2,
  Mail,
  LogIn,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/auth/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { path: "/admin/dashboard", name: "Dashboard", icon: <Home size={20} /> },
    {
      path: "/admin/hymn-management",
      name: "Manage Hymns",
      icon: <Music size={20} />,
    },
    {
      path: "/admin/hymns/add",
      name: "Add Hymn",
      icon: <PlusCircle size={20} />,
    },
    {
      path: "/admin/categories",
      name: "Categories",
      icon: <Bookmark size={20} />,
    },
    { path: "/admin/users", name: "Users", icon: <Users size={20} /> },
    {
      path: "/admin/comments",
      name: "Comments",
      icon: <BarChart3 size={20} />,
    },
    {
      path: "/admin/contact",
      name: "Contacts",
      icon: <Users2 size={20} />,
    },
    {
      path: "/admin/news-letter",
      name: "News Letter",
      icon: <Mail size={20} />,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-indigo-600 text-white shadow-lg"
        >
          <List size={20} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-indigo-600 via-indigo-700 to-purple-800
          shadow-xl flex flex-col z-50 transition-all duration-300 ease-in-out
          ${isMobile ? (mobileOpen ? "w-64" : "-translate-x-full") : ""}
          ${!isMobile && collapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-indigo-500/30">
          <div className="flex items-center">
            <Music className="text-white" size={24} />
            {(!collapsed || isMobile) && (
              <span className="ml-2 font-bold text-white text-lg whitespace-nowrap">
                Hymonella
              </span>
            )}
          </div>

          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="text-white hover:bg-indigo-500 p-1 rounded-md"
            >
              {collapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              href={item.path}
              key={item.path}
              className={`
                flex items-center p-3 rounded-md transition-colors whitespace-nowrap
                ${
                  isActive(item.path)
                    ? "bg-indigo-800 text-white"
                    : "text-indigo-100 hover:bg-indigo-500/50"
                }
                ${collapsed && !isMobile ? "justify-center" : ""}
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {(!collapsed || isMobile) && (
                <span className="ml-3 overflow-hidden text-ellipsis">
                  {item.name}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-indigo-500/30">
          <Link
            href="/"
            className="flex items-center p-3 rounded-md text-indigo-100 hover:bg-indigo-500/50"
          >
            <BookOpen size={20} />
            {(!collapsed || isMobile) && (
              <span className="ml-3">View Website</span>
            )}
          </Link>
          {session?.user ? (
            <button
              onClick={handleLogout}
              className="flex items-center p-3 rounded-md bg-red-500/30 text-indigo-100 hover:bg-red-500 w-full"
            >
              <LogOut size={20} />
              {(!collapsed || isMobile) && (
                <span className="ml-3 ">Sign Out</span>
              )}
            </button>
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              className="flex items-center p-3 rounded-md bg-blue-500 text-indigo-100 hover:bg-indigo-500 w-full"
            >
              <LogIn size={20} />
              {(!collapsed || isMobile) && (
                <span className="ml-3 ">Sign In</span>
              )}
            </button>
          )}

          {/* Optional: Display user info */}
          {(!collapsed || isMobile) && session?.user && (
            <div className="mt-2 px-3 py-2 text-xs text-indigo-200 truncate">
              Logged in as: {session.user.email}
            </div>
          )}
        </div>
      </aside>

      {/* Add margin to main content when sidebar is expanded (desktop) */}
      {!isMobile && (
        <style jsx global>{`
          body {
            margin-left: ${collapsed ? "5rem" : "16rem"};
            transition: margin-left 0.3s ease-in-out;
          }
        `}</style>
      )}
    </>
  );
};

export default Sidebar;
