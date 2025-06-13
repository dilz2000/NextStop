import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { X, AlertTriangle, Loader2, CheckCircle, XCircle } from "lucide-react";
import { cancelBooking } from "../api/bookingCancelApi";
import { Booking } from "../api/myBookingsApi";

interface BookingCancelProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelSuccess: () => void;
}

const BookingCancel: React.FC<BookingCancelProps> = ({
  booking,
  isOpen,
  onClose,
  onCancelSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [cancelResult, setCancelResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!booking) return null;

  const handleCancel = async () => {
    setIsLoading(true);
    
    try {
      const result = await cancelBooking(booking.bookingId);
      setCancelResult(result);
      setShowResult(true);
      
      if (result.success) {
        setTimeout(() => {
          onCancelSuccess();
          handleClose();
        }, 2000);
      }
    } catch (error) {
      setCancelResult({
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      });
      setShowResult(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowResult(false);
    setCancelResult(null);
    setIsLoading(false);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Cancel Booking
                </h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {!showResult ? (
                <>
                  {/* Warning Section */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <AlertTriangle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-red-800 font-semibold mb-2">
                          Warning: This action cannot be reversed
                        </h3>
                        <p className="text-red-700 text-sm">
                          Once you cancel this booking, you will not be able to recover it. 
                          Please make sure you want to proceed with the cancellation.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Booking Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booking ID:</span>
                        <span className="font-medium">#{booking.bookingId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bus Number:</span>
                        <span className="font-medium">#{booking.busNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Route:</span>
                        <span className="font-medium">
                          {booking.source} → {booking.destination}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Travel Date:</span>
                        <span className="font-medium">
                          {formatDate(booking.travelDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seats:</span>
                        <span className="font-medium">
                          {booking.seatNumbers.join(', ')}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-bold text-red-600">
                          LKR {booking.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleClose}
                      disabled={isLoading}
                    >
                      Keep Booking
                    </Button>
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        'Cancel Booking'
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                /* Result Section */
                <div className="text-center">
                  <div className="mb-4">
                    {cancelResult?.success ? (
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                    )}
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${
                    cancelResult?.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {cancelResult?.success ? 'Booking Cancelled' : 'Cancellation Failed'}
                  </h3>
                  
                  <p className={`text-sm mb-6 ${
                    cancelResult?.success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {cancelResult?.message}
                  </p>

                  {cancelResult?.success ? (
                    <p className="text-xs text-gray-500">
                      Redirecting to bookings page...
                    </p>
                  ) : (
                    <Button onClick={handleClose} className="w-full">
                      Try Again
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingCancel;
