import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { CheckCircle, Download } from "lucide-react";

interface ConfirmationStepProps {
  bookingId: number | null;
  onViewBookings: () => void;
  onBookAnother: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  bookingId,
  onViewBookings,
  onBookAnother,
}) => {
  useEffect(() => {
    // Auto redirect to My Bookings after 5 seconds
    // const timer = setTimeout(() => {
    //   onViewBookings();
    // }, 5000);

    // return () => clearTimeout(timer);
  }, [onViewBookings]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2 text-green-800">
          Booking Confirmed!
        </h2>
        
        <p className="text-gray-600 mb-6">
          Your bus ticket has been successfully booked.
        </p>

        {bookingId && (
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <p className="text-green-800 font-medium">
              Booking ID: #{bookingId}
            </p>
            <p className="text-green-600 text-sm mt-1">
              {/* Please save this booking ID for your records. */}
            </p>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• You can download your ticket from My Bookings</li>
            <li>• A confirmation email has been sent to your registered email</li>
            <li>• Please arrive 15 minutes before departure time</li>
            <li>• Carry ticket softcopy for verification</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={onViewBookings}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            View My Bookings
          </Button>
          <Button
            variant="outline"
            onClick={onBookAnother}
          >
            Book Another Ticket
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          {/* Redirecting to My Bookings in 5 seconds... */}
        </p>
      </div>
    </div>
  );
};
