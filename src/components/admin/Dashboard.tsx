import React from "react";
import { motion } from "framer-motion";
import {
  Bus,
  Route as RouteIcon,
  Calendar,
  Users,
  Map,
  Tag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  // Sample data for dashboard stats
  const stats = [
    {
      title: "Total Buses",
      value: 24,
      icon: <Bus className="h-8 w-8 text-primary" />,
      change: "+2 this week",
    },
    {
      title: "Active Routes",
      value: 36,
      icon: <RouteIcon className="h-8 w-8 text-primary" />,
      change: "+4 this month",
    },
    {
      title: "Scheduled Trips",
      value: 128,
      icon: <Calendar className="h-8 w-8 text-primary" />,
      change: "+12 this week",
    },
    {
      title: "Registered Users",
      value: 2457,
      icon: <Users className="h-8 w-8 text-primary" />,
      change: "+85 this month",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
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
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {[
                {
                  action: "New bus added",
                  details: "Bus #B-2458 was added to the fleet",
                  time: "2 hours ago",
                },
                {
                  action: "Route updated",
                  details: "NYC to Boston route fare increased by $5",
                  time: "5 hours ago",
                },
                {
                  action: "Schedule modified",
                  details: "Trip #T-8754 departure time changed to 10:30 AM",
                  time: "Yesterday",
                },
                {
                  action: "User account created",
                  details: "New admin user 'john.smith@example.com' created",
                  time: "2 days ago",
                },
              ].map((item, index) => (
                <div key={index} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.action}</p>
                      <p className="text-sm text-gray-500">{item.details}</p>
                    </div>
                    <div className="text-xs text-gray-400">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
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
