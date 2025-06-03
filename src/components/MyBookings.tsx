
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Calendar, Clock, MapPin, Users, Bus, Loader2 } from "lucide-react";
import Navigation from "./Navigation";
import BookingDetailsModal from "./BookingDetailsModal";
import { fetchUserBookings, Booking } from "../api/myBookingsApi";

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const USER_ID = 101; // Hardcoded for now

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    applyDateFilter();
  }, [bookings, dateFilter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await fetchUserBookings(USER_ID);
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
            <Button onClick={loadBookings}>Try Again</Button>
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
                      ${booking.totalPrice.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      ${booking.pricePerSeat.toFixed(2)} per seat
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
      />
    </div>
  );
};

export default MyBookings;
