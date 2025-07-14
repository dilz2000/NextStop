import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Bus, 
  Users, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Route as RouteIcon
} from "lucide-react";
import { fetchBookingDetails, Booking, BookingDetails } from "../../api/bookingApi";

interface BookingDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (booking && isOpen) {
      loadBookingDetails();
    }
  }, [booking, isOpen]);

  const loadBookingDetails = async () => {
    if (!booking) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const details = await fetchBookingDetails(booking);
      setBookingDetails(details);
    } catch (err) {
      setError("Failed to load booking details");
      console.error("Error loading booking details:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const getRoleColor = (roles: string[]) => {
    const hasAdmin = roles.some(role => role.includes('ADMIN'));
    return hasAdmin 
      ? "bg-red-100 text-red-800 border-red-200" 
      : "bg-blue-100 text-blue-800 border-blue-200";
  };

  const formatRole = (roles: string[]) => {
    return roles.map(role => 
      role === 'ROLE_ADMIN' ? 'Administrator' : 
      role === 'ROLE_CUSTOMER' ? 'Customer' : role
    ).join(', ');
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-6 w-6 text-blue-600" />
            Booking Details - #{booking.id}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Loading booking details...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <span className="ml-2 text-red-600">{error}</span>
          </div>
        ) : bookingDetails ? (
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Booking Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-700">Route</p>
                  <p className="font-semibold text-blue-900 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {booking.source} → {booking.destination}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Travel Date</p>
                  <p className="font-semibold text-blue-900">{formatDate(booking.travelDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Departure Time</p>
                  <p className="font-semibold text-blue-900 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {formatTime(booking.departureTime)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Total Amount</p>
                  <p className="font-bold text-green-700 text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    {booking.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  Customer Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium text-gray-900">{bookingDetails.user.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {bookingDetails.user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <Badge variant="outline" className={getRoleColor(bookingDetails.user.roles)}>
                      {formatRole(bookingDetails.user.roles)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Status</p>
                    <Badge variant="outline" className={bookingDetails.user.active 
                      ? "bg-green-50 text-green-700 border-green-200" 
                      : "bg-red-50 text-red-700 border-red-200"
                    }>
                      {bookingDetails.user.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email Verification</p>
                    <Badge variant="outline" className={bookingDetails.user.emailVerified 
                      ? "bg-green-50 text-green-700 border-green-200" 
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {bookingDetails.user.emailVerified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Seat Information */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Seat Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Number of Seats</p>
                    <p className="font-medium text-gray-900 text-2xl">{booking.numberOfSeats}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Seat Numbers</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {booking.seatNumbers.split(',').map((seat, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Seat {seat.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price per Seat</p>
                    <p className="font-medium text-gray-900">${booking.pricePerSeat.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Booking Date & Time</p>
                    <p className="font-medium text-gray-900">{formatDateTime(booking.bookingDateTime)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bus Information */}
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Bus className="h-5 w-5 text-blue-600" />
                Bus Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Bus Number</p>
                  <p className="font-medium text-gray-900">{bookingDetails.schedule.bus.busNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bus Type</p>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {bookingDetails.schedule.bus.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Operator</p>
                  <p className="font-medium text-gray-900">{bookingDetails.schedule.bus.operatorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Seats</p>
                  <p className="font-medium text-gray-900">{bookingDetails.schedule.bus.totalSeats}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bus Status</p>
                  <Badge variant="outline" className={bookingDetails.schedule.bus.status === 'active' 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : "bg-red-50 text-red-700 border-red-200"
                  }>
                    {bookingDetails.schedule.bus.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Route Information */}
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <RouteIcon className="h-5 w-5 text-orange-600" />
                Route Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Source City</p>
                  <p className="font-medium text-gray-900">{bookingDetails.schedule.route.sourceCity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Destination City</p>
                  <p className="font-medium text-gray-900">{bookingDetails.schedule.route.destinationCity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="font-medium text-gray-900">{bookingDetails.schedule.route.distanceKm} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium text-gray-900">{bookingDetails.schedule.route.duration}</p>
                </div>
              </div>
            </div>

            {/* Schedule Information */}
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Schedule Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Departure Time</p>
                  <p className="font-medium text-gray-900">{formatTime(booking.departureTime)}</p>
                </div>
                {/* <div>
                  <p className="text-sm text-gray-600">Arrival Time</p>
                  <p className="font-medium text-gray-900">{formatTime(booking.arrivalTime)}</p>
                </div> */}
                <div>
                  <p className="text-sm text-gray-600">Schedule Fare</p>
                  <p className="font-medium text-gray-900">${bookingDetails.schedule.fare.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Schedule Status</p>
                  <Badge variant="outline" className={bookingDetails.schedule.status === 'active' 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : "bg-red-50 text-red-700 border-red-200"
                  }>
                    {bookingDetails.schedule.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsModal;
