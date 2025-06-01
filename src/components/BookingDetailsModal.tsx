import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign, 
  Bus,
  User,
  Armchair
} from "lucide-react";
import { Booking } from "../api/myBookingsApi";

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
  if (!booking) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Booking Details
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Booking ID and Status */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Booking Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Booking ID:</span>
                      <span className="ml-2 font-medium">#{booking.bookingId}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Booked On:</span>
                      <span className="ml-2 font-medium">
                        {formatDateTime(booking.bookingDateTime)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Journey Details */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Journey Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="font-medium">{booking.source}</span>
                      </div>
                      <div className="flex-1 border-t border-dashed border-gray-300 mx-4"></div>
                      <div className="flex items-center">
                        <span className="font-medium">{booking.destination}</span>
                        <div className="w-3 h-3 bg-red-500 rounded-full ml-3"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-green-600" />
                        <span>{formatDate(booking.travelDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-green-600" />
                        <span>{booking.departureTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bus Details */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                    <Bus className="h-5 w-5 mr-2" />
                    Bus Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-purple-700">Operator:</span>
                      <span className="ml-2 font-medium">{booking.operatorName}</span>
                    </div>
                    <div>
                      <span className="text-purple-700">Bus Number:</span>
                      <span className="ml-2 font-medium">{booking.busNumber}</span>
                    </div>
                    <div>
                      <span className="text-purple-700">Bus Type:</span>
                      <span className="ml-2 font-medium">{booking.busType}</span>
                    </div>
                  </div>
                </div>

                {/* Seat and Payment Details */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-3 flex items-center">
                    <Armchair className="h-5 w-5 mr-2" />
                    Seat & Payment Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-orange-600" />
                        <span className="text-sm">Number of Seats:</span>
                      </div>
                      <span className="font-medium">{booking.numberOfSeats}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Seat Numbers:</span>
                      <div className="flex gap-2">
                        {booking.seatNumbers.map((seat, index) => (
                          <span
                            key={index}
                            className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs font-medium"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Price per seat:</span>
                        <span>${booking.pricePerSeat.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-orange-900">
                        <span>Total Amount:</span>
                        <span>${booking.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Cancel Booking
                  </Button>
                  <Button className="flex-1">
                    Download Ticket
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingDetailsModal;
