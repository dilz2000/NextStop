import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Bus, 
  Route as RouteIcon, 
  Calendar, 
  Users, 
  Home, 
  Menu, 
  X, 
  Map, 
  Tag,
  Ticket,
  LogOut,
  AlertCircle,
  User as UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState<any>(null);
  const [showError, setShowError] = useState(false);

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/admin/buses", label: "Buses", icon: <Bus size={20} /> },
    { path: "/admin/routes", label: "Routes", icon: <RouteIcon size={20} /> },
    { path: "/admin/schedules", label: "Schedules", icon: <Calendar size={20} /> },
    { path: "/admin/users", label: "Users", icon: <Users size={20} /> },
    { path: "/admin/bookings", label: "Bookings", icon: <Ticket size={20} /> },
    { path: "/admin/popular-routes", label: "Popular Routes", icon: <Map size={20} /> },
    { path: "/admin/promotions", label: "Special Offers", icon: <Tag size={20} /> },
  ];

  // Admin validation on component mount
  useEffect(() => {
    const validateAdmin = () => {
      try {
        const userData = localStorage.getItem('user');
        const authToken = localStorage.getItem('authToken');
        
        if (!userData || !authToken) {
          setShowError(true);
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
          return;
        }

        const user = JSON.parse(userData);
        
        if (user.role !== "ROLE_ADMIN") {
          setShowError(true);
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
          return;
        }

        // Admin is authorized
        setIsAuthorized(true);
        setAdminData(user);
      } catch (error) {
        console.error('Error validating admin:', error);
        setShowError(true);
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    validateAdmin();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleGoToPublic = () => {
    window.location.href = "/";
  };

  // Get initials from admin name
  const getInitials = (name: string) => {
    if (!name) return "A";
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Validating access...</p>
        </div>
      </div>
    );
  }

  // Show error message for unauthorized users
  if (showError || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Access Denied:</strong> You don't have admin privileges to access this area. 
              Redirecting to home page...
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ width: isSidebarOpen ? "250px" : "0px" }}
        animate={{ width: isSidebarOpen ? "250px" : "0px" }}
        transition={{ duration: 0.3 }}
        className={`bg-white shadow-md z-20 ${isSidebarOpen ? "block" : "hidden"}`}
      >
        <div className="px-4 py-4  border-b border-gray-200">
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
                  className={`flex items-center p-3 rounded-md transition-colors ${
                    location.pathname === item.path 
                      ? "bg-primary text-white shadow-sm" 
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm px-4 py-0 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
              isSidebarOpen ? "lg:hidden" : ""
            }`}
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center space-x-3 ml-auto pr-4">
            {/* Admin Profile */}
            <Link to="/admin/profile" className="cursor-pointer group">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {getInitials(adminData?.fullName || adminData?.name || "Admin")}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {adminData?.fullName || adminData?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <UserIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </Link>

            {/* Go to Public Button - Rightmost */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoToPublic}
              className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 mr-4"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Public Dashboard</span>
            </Button>
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
