import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Bus, Route as RouteIcon, Calendar, Users, Home, Menu, X, Map, Tag, } from "lucide-react";

const AdminLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/admin/buses", label: "Buses", icon: <Bus size={20} /> },
    { path: "/admin/routes", label: "Routes", icon: <RouteIcon size={20} /> },
    { path: "/admin/schedules", label: "Schedules", icon: <Calendar size={20} />,},
    { path: "/admin/users", label: "Users", icon: <Users size={20} /> },
    { path: "/admin/popular-routes", label: "Popular Routes", icon: <Map size={20} />,},
    { path: "/admin/promotions", label: "Special Offers", icon: <Tag size={20} />,},
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ width: isSidebarOpen ? "250px" : "0px" }}
        animate={{ width: isSidebarOpen ? "250px" : "0px" }}
        transition={{ duration: 0.3 }}
        className={`bg-white shadow-md z-20 ${isSidebarOpen ? "block" : "hidden"}`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">NextStop Admin</h1>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md hover:bg-gray-100 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-md transition-colors ${location.pathname === item.path ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-md hover:bg-gray-100 ${isSidebarOpen ? "lg:hidden" : ""}`}
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Link to="/admin/profile" className="cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  A
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
