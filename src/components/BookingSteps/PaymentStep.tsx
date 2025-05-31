import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CreditCard } from "lucide-react";
import { ScheduleResponse } from "@/api/scheduleApi";

interface PaymentStepProps {
  selectedSchedule: ScheduleResponse | null;
  selectedSeats: string[];
  passengerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  onPassengerDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPaymentSubmit: () => void;
  onBackToSeatSelection: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  selectedSchedule,
  selectedSeats,
  passengerDetails,
  onPassengerDetailsChange,
  onPaymentSubmit,
  onBackToSeatSelection,
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
      <h2 className="text-2xl font-bold mb-6">Payment</h2>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <h3 className="font-semibold mb-4">Passenger Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input
              type="text"
              name="name"
              value={passengerDetails.name}
              onChange={onPassengerDetailsChange}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={passengerDetails.email}
              onChange={onPassengerDetailsChange}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input
              type="tel"
              name="phone"
              value={passengerDetails.phone}
              onChange={onPassengerDetailsChange}
              placeholder="(123) 456-7890"
            />
          </div>
        </div>

        <h3 className="font-semibold mb-4">Payment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <Input type="text" placeholder="1234 5678 9012 3456" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name
            </label>
            <Input type="text" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <Input type="text" placeholder="MM/YY" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV
            </label>
            <Input type="text" placeholder="123" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <h3 className="font-semibold mb-4">Booking Summary</h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Route:</span>
            <span className="font-medium">{selectedSchedule && getRouteDisplay(selectedSchedule.route)}</span>
          </div>
          <div className="flex justify-between">
            <span>Date & Time:</span>
            <span className="font-medium">
              {selectedSchedule && formatTime(selectedSchedule.departureTime)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Bus:</span>
            <span className="font-medium">
              {selectedSchedule?.bus.busNumber} ({selectedSchedule?.bus.operatorName})
            </span>
          </div>
          <div className="flex justify-between">
            <span>Seats:</span>
            <span className="font-medium">
              {selectedSeats.join(", ")}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Price per seat:</span>
            <span className="font-medium">
              LKR {selectedSchedule?.fare.toFixed(2)}
            </span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>
                LKR {(selectedSchedule?.fare * selectedSeats.length).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBackToSeatSelection}>
          Back to Seat Selection
        </Button>
        <Button
          onClick={onPaymentSubmit}
          disabled={
            !passengerDetails.name ||
            !passengerDetails.email ||
            !passengerDetails.phone
          }
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Pay Now
        </Button>
      </div>
    </div>
  );
};
