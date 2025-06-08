
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bus,
  Route as RouteIcon,
  Calendar,
  Users,
  Map,
  Tag,
  AlertCircle,
  TrendingUp,
  UserCheck,
  UserX,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Utility for fetching and error handling
const fetchDashboardData = async (endpoint: string) => {
  const res = await fetch(`http://localhost:8080${endpoint}`);
  if (!res.ok) throw new Error(`Failed to fetch from ${endpoint}`);
  return res.json();
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stats
  const [busCount, setBusCount] = useState(0);
  const [activeRouteCount, setActiveRouteCount] = useState(0);
  const [scheduleCount, setScheduleCount] = useState(0);
  // User API integration commented out for now
  // const [userCount, setUserCount] = useState(0);
  // const [activeUserCount, setActiveUserCount] = useState(0);
  // const [inactiveUserCount, setInactiveUserCount] = useState(0);
  const [popularRoute, setPopularRoute] = useState<string | null>(null);

  // Auth check
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      window.location.href = "/";
      return;
    }
    try {
      const user = JSON.parse(userData);
      if (user.role !== "ROLE_ADMIN") {
        window.location.href = "/";
      }
    } catch {
      window.location.href = "/";
    }
  }, []);

  // Fetch dashboard stats
  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [buses, routes, schedules] = await Promise.all([
        fetchDashboardData("/bus/getAllBuses"),
        fetchDashboardData("/routes/getAllRoutes"),
        fetchDashboardData("/schedules/getAllSchedules"),
        // User API integration commented out until available
        // fetchDashboardData("/users/getAllUsers"),
      ]);
      
      setBusCount(buses.filter((b: any) => b.status === "active").length);
      setActiveRouteCount(routes.filter((r: any) => r.status === "active").length);
      setScheduleCount(schedules.filter((s: any) => s.status === "active").length);
      
      // User API integration commented out - using dummy values
      // setUserCount(users.length);
      // setActiveUserCount(users.filter((u: any) => u.isActive).length);
      // setInactiveUserCount(users.filter((u: any) => !u.isActive).length);

      // Find the most popular route (by schedule count)
      const routeCount: Record<string, number> = {};
      schedules.forEach((s: any) => {
        const key = `${s.route.sourceCity} → ${s.route.destinationCity}`;
        routeCount[key] = (routeCount[key] || 0) + 1;
      });
      const sortedRoutes = Object.entries(routeCount).sort((a, b) => b[1] - a[1]);
      setPopularRoute(sortedRoutes.length > 0 ? `${sortedRoutes[0][0]} (${sortedRoutes[0][1]} trips)` : null);

    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Unable to load dashboard</h2>
        <p className="mb-4 text-gray-500">{error}</p>
        <Button onClick={loadStats}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-12 w-12 animate-spin text-blue-600" />
        <span className="ml-4 text-lg text-gray-700">Loading dashboard...</span>
      </div>
    );
  }

  // Stats card data
  const stats = [
    {
      title: "Active Buses",
      value: busCount,
      icon: <Bus className="h-8 w-8 text-blue-600" />,
      change: "",
    },
    {
      title: "Active Routes",
      value: activeRouteCount,
      icon: <RouteIcon className="h-8 w-8 text-green-600" />,
      change: "",
    },
    {
      title: "Scheduled Trips",
      value: scheduleCount,
      icon: <Calendar className="h-8 w-8 text-purple-600" />,
      change: "",
    },
    {
      title: "Registered Users",
      value: 2457, // Dummy value - replace when user API is available
      icon: <Users className="h-8 w-8 text-orange-600" />,
      // change: "+85 this month", // Dummy change value
    },
  ];

  // User summary cards with dummy values
  const userStats = [
    {
      title: "Active Users",
      value: 2100, // Dummy value - replace when user API is available
      icon: <UserCheck className="h-6 w-6 text-green-600" />,
      color: "bg-green-50 text-green-800",
    },
    {
      title: "Inactive Users",
      value: 357, // Dummy value - replace when user API is available
      icon: <UserX className="h-6 w-6 text-red-600" />,
      color: "bg-red-50 text-red-800",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-blue-600" />
          Admin Dashboard
        </h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.change && <p className="text-xs text-gray-500 mt-1">{stat.change}</p>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* User Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {userStats.map((stat, idx) => (
          <Card key={stat.title} className={`flex items-center p-4 ${stat.color}`}>
            {stat.icon}
            <div className="ml-4">
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-sm">{stat.title}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Popular Route Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          Most Popular Route
        </h2>
        <Card>
          <CardContent className="p-4 flex items-center">
            {popularRoute ? (
              <span className="text-lg font-semibold text-blue-700">{popularRoute}</span>
            ) : (
              <span className="text-gray-500">No route data available</span>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => (window.location.href = "/admin/buses")}
          >
            <CardContent className="p-4 flex items-center">
              <Bus className="h-5 w-5 mr-2 text-primary" />
              <span>Add New Bus</span>
            </CardContent>
          </Card>
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => (window.location.href = "/admin/routes")}
          >
            <CardContent className="p-4 flex items-center">
              <RouteIcon className="h-5 w-5 mr-2 text-primary" />
              <span>Create New Route</span>
            </CardContent>
          </Card>
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => (window.location.href = "/admin/schedules")}
          >
            <CardContent className="p-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              <span>Schedule Trip</span>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => (window.location.href = "/admin/popular-routes")}
          >
            <CardContent className="p-4 flex items-center">
              <Map className="h-5 w-5 mr-2 text-primary" />
              <span>Manage Popular Routes</span>
            </CardContent>
          </Card>
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => (window.location.href = "/admin/promotions")}
          >
            <CardContent className="p-4 flex items-center">
              <Tag className="h-5 w-5 mr-2 text-primary" />
              <span>Manage Special Offers</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
