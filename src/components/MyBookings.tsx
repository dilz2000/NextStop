import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";

const MyBookings = () => {
  // Placeholder data for bookings
  const bookings = [
    {
      id: "BK12345",
      route: "New York to Boston",
      date: "October 15, 2023",
      time: "10:30 AM",
      status: "Confirmed",
      price: "$45.00",
    },
    {
      id: "BK12346",
      route: "Boston to New York",
      date: "October 22, 2023",
      time: "2:15 PM",
      status: "Confirmed",
      price: "$45.00",
    },
    {
      id: "BK12347",
      route: "New York to Washington DC",
      date: "November 5, 2023",
      time: "8:00 AM",
      status: "Pending",
      price: "$65.00",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar - Reused from home page */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <a href="/">
              <h1 className="text-2xl font-bold text-primary">BusBooker</h1>
            </a>
          </div>
          <div className="hidden md:flex space-x-6">
            <a
              href="/"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Home
            </a>
            <a
              href="/my-bookings"
              className="text-primary font-medium transition-colors"
            >
              My Bookings
            </a>
            <a
              href="/support"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Support
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">Register</Button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6">My Bookings</h2>

          {/* Booking Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select className="border border-gray-300 rounded-md px-3 py-2 w-full">
                <option value="all">All Bookings</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select className="border border-gray-300 rounded-md px-3 py-2 w-full">
                <option value="all">All Time</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="last30">Last 30 Days</option>
              </select>
            </div>
            <div className="ml-auto self-end">
              <Button variant="outline" size="sm">
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <span className="text-lg font-semibold">
                        {booking.route}
                      </span>
                      <span
                        className={`ml-3 px-2 py-1 text-xs rounded-full ${booking.status === "Confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-gray-500 text-sm space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>Booking ID: {booking.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-xl font-bold text-primary mb-2">
                      {booking.price}
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {bookings.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-medium mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-6">
                You haven't made any bookings yet. Start by booking your first
                trip!
              </p>
              <Button>Book a Trip</Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyBookings;
