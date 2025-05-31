import React from "react";
import { Button } from "../ui/button";
import { Ticket } from "lucide-react";
import { ScheduleResponse } from "@/api/scheduleApi";

interface ConfirmationStepProps {
  selectedSchedule: ScheduleResponse | null;
  selectedSeats: string[];
  passengerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  onBookAnother: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  selectedSchedule,
  selectedSeats,
  passengerDetails,
  onBookAnother,
}) => {
  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getRouteDisplay = (route: ScheduleResponse['route']) => {
    return `${route.sourceCity} → ${route.destinationCity}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Ticket className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Your booking has been confirmed. A confirmation email has been
          sent to {passengerDetails.email}.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
          <h3 className="font-semibold mb-2">Booking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-500">Booking ID</p>
              <p className="font-medium">
                BK{Math.floor(Math.random() * 10000)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Route</p>
              <p className="font-medium">{selectedSchedule && getRouteDisplay(selectedSchedule.route)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-medium">{selectedSchedule && formatTime(selectedSchedule.departureTime)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bus</p>
              <p className="font-medium">{selectedSchedule?.bus.busNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Seats</p>
              <p className="font-medium">{selectedSeats.join(", ")}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Passenger</p>
              <p className="font-medium">{passengerDetails.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Operator</p>
              <p className="font-medium">{selectedSchedule?.bus.operatorName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium">
                LKR {(selectedSchedule?.fare * selectedSeats.length).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={onBookAnother}>
            Book Another Ticket
          </Button>
          <Button onClick={() => (window.location.href = "/my-bookings")}>
            View My Bookings
          </Button>
        </div>
      </div>
    </div>
  );
};
