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
  Shield,
  Mail,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchDashboardData, isAdminAuthenticated, DashboardStats } from "../../api/dashboardApi";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth check
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      window.location.href = "/";
      return;
    }
  }, []);

  // Fetch dashboard stats
  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboardData = await fetchDashboardData();
      setStats(dashboardData);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadStats(); 
  }, []);

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

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Main stats card data
  const mainStats = [
    {
      title: "Total Buses",
      value: stats.totalBuses,
      icon: <Bus className="h-8 w-8 text-primary" />,
      change: "",
    },
    {
      title: "Active Routes",
      value: stats.activeRoutes,
      icon: <RouteIcon className="h-8 w-8 text-primary" />,
      change: "",
    },
    {
      title: "Scheduled Trips",
      value: stats.totalSchedules,
      icon: <Calendar className="h-8 w-8 text-primary" />,
      change: "",
    },
    {
      title: "Registered Users",
      value: stats.totalUsers,
      icon: <Users className="h-8 w-8 text-primary" />,
      // change: `${stats.activeUsers} active`,
    },
  ];

  // User summary cards with real data
  const userStats = [
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: <UserCheck className="h-6 w-6 text-green-600" />,
      color: "bg-green-50 text-green-800",
    },
    {
      title: "Inactive Users",
      value: stats.totalUsers - stats.activeUsers,
      icon: <UserX className="h-6 w-6 text-red-600" />,
      color: "bg-red-50 text-red-800",
    },
    {
      title: "Admin Users",
      value: stats.adminUsers,
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      color: "bg-purple-50 text-purple-800",
    },
    {
      title: "Verified Emails",
      value: stats.verifiedUsers,
      icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
      color: "bg-blue-50 text-blue-800",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-7 w-7 text-primary" />
          Admin Dashboard
        </h1>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={loadStats}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mainStats.map((stat, index) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {userStats.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + idx * 0.1 }}
          >
            <Card className={`flex items-center p-4 ${stat.color}`}>
              {stat.icon}
              <div className="ml-4">
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-sm">{stat.title}</div>
              </div>
            </Card>
          </motion.div>
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
            {stats.popularRoute ? (
              <span className="text-lg font-semibold text-blue-700">{stats.popularRoute}</span>
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
            onClick={() => (window.location.href = "/admin/users")}
          >
            <CardContent className="p-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              <span>Manage Users</span>
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
