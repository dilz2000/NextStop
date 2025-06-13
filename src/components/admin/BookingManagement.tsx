import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Search, 
  Loader2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Eye,
  RefreshCw,
  Users,
  User,
  DollarSign,
  MapPin,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fetchAllBookings, Booking } from "../../api/bookingApi";
import BookingDetailsModal from "./BookingDetails";

const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [paginatedBookings, setPaginatedBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [travelDateFilter, setTravelDateFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      let data = await fetchAllBookings();
      
      // Filter out bookings older than 30 days from travelDate
      const now = new Date();
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      data = data.filter(b => new Date(b.travelDate) >= thirtyDaysAgo);
      
      // Order by bookingDateTime descending (most recent first)
      data.sort((a, b) => new Date(b.bookingDateTime).getTime() - new Date(a.bookingDateTime).getTime());
      
      setBookings(data);
      setFilteredBookings(data);
    } catch (err) {
      setError("Failed to load bookings. Please try again later.");
      console.error("Error loading bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings based on search and travel date
  useEffect(() => {
    let filtered = bookings;
    
    if (searchTerm) {
      filtered = filtered.filter(b =>
        b.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.seatNumbers.includes(searchTerm) ||
        b.id.toString().includes(searchTerm)
      );
    }
    
    if (travelDateFilter) {
      filtered = filtered.filter(b => b.travelDate === travelDateFilter);
    }
    
    setFilteredBookings(filtered);
  }, [bookings, searchTerm, travelDateFilter]);

  // Pagination logic
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedBookings(filteredBookings.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(filteredBookings.length / itemsPerPage));
  }, [filteredBookings, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, travelDateFilter]);

  const openDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Calculate statistics
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
  const uniqueRoutes = new Set(bookings.map(b => `${b.source}-${b.destination}`)).size;

  // Pagination Controls Component
  const PaginationControls = () => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredBookings.length);

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing <span className="font-medium">{startItem}</span> to{" "}
            <span className="font-medium">{endItem}</span> of{" "}
            <span className="font-medium">{filteredBookings.length}</span> results
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-2"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNumber)}
                  className="w-8 h-8 p-0"
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Bookings</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadBookings} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            Booking Management
          </h1>
          <p className="text-gray-600 mt-1">View and manage customer bookings</p>
        </div>
        <Button 
          variant="outline" 
          onClick={loadBookings} 
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border shadow-sm"
        >
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg border shadow-sm"
        >
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">LKR {totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg border shadow-sm"
        >
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Booking Value</p>
              <p className="text-2xl font-bold text-gray-900">LKR {avgBookingValue.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg border shadow-sm"
        >
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unique Routes</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueRoutes}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by source, destination, seat numbers, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2 min-w-[200px]">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Input
              type="date"
              value={travelDateFilter}
              onChange={(e) => setTravelDateFilter(e.target.value)}
              className="w-full"
              placeholder="Filter by travel date"
            />
          </div>
        </div>
        
        {/* Filter Results Info */}
        {(searchTerm || travelDateFilter) && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span>
              Found {filteredBookings.length} booking(s)
            </span>
            {searchTerm && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                matching "{searchTerm}"
              </span>
            )}
            {travelDateFilter && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                travel date: {formatDate(travelDateFilter)}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setTravelDateFilter('');
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Booking Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg border shadow-sm"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Booking ID</TableHead>
              <TableHead className="font-semibold">User ID</TableHead>
              <TableHead className="font-semibold">Route</TableHead>
              <TableHead className="font-semibold">Travel Date</TableHead>
              <TableHead className="font-semibold">Departure</TableHead>
              <TableHead className="font-semibold">Seats</TableHead>
              <TableHead className="font-semibold">Total Price</TableHead>
              <TableHead className="font-semibold">Booked At</TableHead>
              <TableHead className="text-right font-semibold">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBookings.length > 0 ? (
              paginatedBookings.map((booking, index) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => openDetails(booking)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      #{booking.id}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      {booking.userId}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{booking.source}</span>
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="font-medium">{booking.destination}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {formatDate(booking.travelDate)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      {formatTime(booking.departureTime)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{booking.numberOfSeats}</span>
                      <span className="text-xs text-gray-500">({booking.seatNumbers})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-bold text-green-700">LKR {booking.totalPrice.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDateTime(booking.bookingDateTime)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        openDetails(booking); 
                      }}
                      className="hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center">
                    <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                    <p className="text-gray-500">
                      {searchTerm || travelDateFilter
                        ? "No bookings match your search or filter criteria."
                        : "No recent bookings available."
                      }
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Pagination Controls */}
        {filteredBookings.length > itemsPerPage && <PaginationControls />}
      </motion.div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default BookingManagement;
