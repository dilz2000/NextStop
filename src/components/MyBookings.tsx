
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Calendar, Clock, MapPin, Users, Bus, Loader2 } from "lucide-react";
import Navigation from "./Navigation";
import BookingDetailsModal from "./BookingDetailsModal";
import { fetchUserBookings, Booking } from "../api/myBookingsApi";
import { isAuthenticated, redirectToLogin } from "../api/auth";

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authError, setAuthError] = useState<boolean>(false);

  // Get user ID from localStorage
  const getUserId = (): number | null => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id || null;
      }
      return null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  };

  useEffect(() => {
    // Check authentication before loading bookings
    if (!isAuthenticated()) {
      setAuthError(true);
      setTimeout(() => {
        setAuthError(false);
        redirectToLogin();
      }, 3000); // Show message for 3 seconds before redirecting
      return;
    }

    const userId = getUserId();
    if (!userId) {
      setError("User information not found. Please log in again.");
      setTimeout(() => {
        redirectToLogin();
      }, 2000);
      return;
    }

    loadBookings(userId);
  }, []);

  useEffect(() => {
    applyDateFilter();
  }, [bookings, dateFilter]);

  const loadBookings = async (userId: number) => {
    try {
      setLoading(true);
      const data = await fetchUserBookings(userId);
      // Sort by bookingDateTime in descending order (newest first)
      const sortedBookings = data.sort((a, b) => 
        new Date(b.bookingDateTime).getTime() - new Date(a.bookingDateTime).getTime()
      );
      setBookings(sortedBookings);
      setError(null);
    } catch (err) {
      setError("Failed to load bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const applyDateFilter = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let filtered = [...bookings];

    switch (dateFilter) {
      case "upcoming":
        filtered = bookings.filter(booking => 
          new Date(booking.travelDate) >= today
        );
        break;
      case "past":
        filtered = bookings.filter(booking => 
          new Date(booking.travelDate) < today
        );
        break;
      case "last30":
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = bookings.filter(booking => 
          new Date(booking.bookingDateTime) >= thirtyDaysAgo
        );
        break;
      default:
        filtered = bookings;
    }

    setFilteredBookings(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (travelDate: string) => {
    const today = new Date();
    const travel = new Date(travelDate);
    
    if (travel < today) {
      return "bg-gray-100 text-gray-800";
    } else {
      return "bg-green-100 text-green-800";
    }
  };

  const getStatusText = (travelDate: string) => {
    const today = new Date();
    const travel = new Date(travelDate);
    
    if (travel < today) {
      return "Completed";
    } else {
      return "Confirmed";
    }
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  // Show authentication error message
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation currentPage="my-bookings" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Authentication Required
              </h2>
              <p className="text-gray-600 mb-4">
                You must Sign In first to view your bookings
              </p>
              <p className="text-red-600 text-sm mb-6">
                Redirecting to login page...
              </p>
              <Button onClick={() => redirectToLogin()}>
                Go to Login
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation currentPage="my-bookings" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading your bookings...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation currentPage="my-bookings" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-red-500 mb-4">
              <Calendar className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-medium mb-2">Error Loading Bookings</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <div className="space-x-4">
              <Button onClick={() => {
                const userId = getUserId();
                if (userId) {
                  loadBookings(userId);
                } else {
                  redirectToLogin();
                }
              }}>
                Try Again
              </Button>
              <Button variant="outline" onClick={() => redirectToLogin()}>
                Sign In Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="my-bookings" />

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
                Date Range
              </label>
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="last30">Last 30 Days</option>
              </select>
            </div>
            <div className="ml-auto self-end">
              <span className="text-sm text-gray-600">
                {filteredBookings.length} booking(s) found
              </span>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <motion.div
                key={booking.bookingId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleBookingClick(booking)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0 flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-lg font-semibold">
                        {booking.source} → {booking.destination}
                      </span>
                      <span
                        className={`ml-3 px-2 py-1 text-xs rounded-full ${getStatusColor(booking.travelDate)}`}
                      >
                        {getStatusText(booking.travelDate)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-gray-500 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(booking.travelDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{formatTime(booking.departureTime)}</span>
                      </div>
                      <div className="flex items-center">
                        <Bus className="h-4 w-4 mr-2" />
                        <span>{booking.operatorName}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{booking.numberOfSeats} seat(s)</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      Booking ID: #{booking.bookingId} • Seats: {booking.seatNumbers.join(", ")}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-xl font-bold text-primary mb-2">
                      LKR {booking.totalPrice.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      LKR {booking.pricePerSeat.toFixed(2)} per seat
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredBookings.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-medium mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-6">
                {dateFilter === "all" 
                  ? "You haven't made any bookings yet. Start by booking your first trip!"
                  : "No bookings found for the selected date range."
                }
              </p>
              <Button>
                <a href="/ticket-booking">Book a Trip</a>
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookingCancelled={() => {
          // Refresh bookings list
          const userId = getUserId();
          if (userId) {
            loadBookings(userId);
          }
        }}
      />

    </div>
  );
};

export default MyBookings;
