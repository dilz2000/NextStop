
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { ScheduleResponse } from "@/api/scheduleApi";
import { fetchSeatAvailability, SeatAvailability } from "@/api/seatAvailabilityApi";

interface SeatSelectionStepProps {
  selectedSchedule: ScheduleResponse | null;
  selectedSeats: string[];
  // selectedSeatIds: string[];
  travelDate: Date | undefined;
  onSeatSelection: (seatNumber: string) => void;
  onContinueToPayment: () => void;
  onBackToResults: () => void;
}

export const SeatSelectionStep: React.FC<SeatSelectionStepProps> = ({
  selectedSchedule,
  selectedSeats,
  // selectedSeatIds,
  travelDate,
  onSeatSelection,
  onContinueToPayment,
  onBackToResults,
}) => {

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  console.log("Formatted Date:", travelDate ? formatDate(travelDate) : 'No date');

  const [seatAvailability, setSeatAvailability] = useState<SeatAvailability[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSeatAvailability = async () => {
      if (!selectedSchedule || !travelDate) return; // Add travelDate check
  
      setLoading(true);
      setError(null);
      
      try {
        const formattedDate = travelDate.toISOString().split("T")[0]; // Format date
        const availability = await fetchSeatAvailability(selectedSchedule.id, formattedDate);
        setSeatAvailability(availability);
      } catch (error) {
        console.error('Failed to fetch seat availability:', error);
        setError('Failed to load seat availability. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    loadSeatAvailability();
  }, [selectedSchedule, travelDate]); // Add travelDate to dependency array
  

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDuration = (duration: string) => {
    const [hours, minutes] = duration.split(':');
    return `${parseInt(hours)}h ${parseInt(minutes)}m`;
  };

  const getRouteDisplay = (route: ScheduleResponse['route']) => {
    return `${route.sourceCity} → ${route.destinationCity}`;
  };

  const isSeatAvailable = (seatNumber: string): boolean => {
    const seat = seatAvailability.find(s => s.seatNumber === seatNumber);
    return seat ? seat.available : false;
  };

  const generateSeatLayout = (totalSeats: number) => {
    const seatsPerRow = 4;
    const rows = Math.ceil(totalSeats / seatsPerRow);
    return { rows, seatsPerRow };
  };

  const getAvailableSeatsCount = () => {
    return seatAvailability.filter(seat => seat.available).length;
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Select Your Seats</h2>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-500">Loading seat availability...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Select Your Seats</h2>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Select Your Seats</h2>
        {travelDate && (
          <span className="text-lg text-gray-600">
            {formatDate(travelDate)}
          </span>
        )}
      </div>

      {selectedSchedule && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold">{getRouteDisplay(selectedSchedule.route)}</h3>
              <p className="text-sm text-gray-500">
                {formatTime(selectedSchedule.departureTime)} - {formatTime(selectedSchedule.arrivalTime)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {selectedSchedule.bus.type} Bus • {formatDuration(selectedSchedule.route.duration)} journey
              </p>
              <p className="text-sm text-gray-500">
                {selectedSchedule.bus.operatorName} • Bus: {selectedSchedule.bus.busNumber}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {getAvailableSeatsCount()} seats available
              </p>
            </div>
            <div className="text-xl font-bold text-primary">
              LKR {selectedSchedule.fare.toFixed(2)}
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6"
      >
        <h3 className="font-semibold mb-4">Bus Layout</h3>

        {selectedSchedule && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 h-10 rounded-t-xl mb-4 flex items-center justify-center text-gray-600 font-medium">
              <MapPin className="h-4 w-4 mr-2" /> Front of the Bus
            </div>
            <div className="w-full px-4 flex justify-between items-center text-sm text-gray-800 font-semibold mb-3">
             <div className="flex items-center space-x-2">
             <svg
                className="w-8 h-8 text-black-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                viewBox="0 0 24 24"
            >
                <path
                d="M6 3h12v18H6V3zm6 9a1 1 0 110-2 1 1 0 010 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                />
            </svg>
            <span>Bus Door</span>
            </div>


            <div className="flex items-center space-x-2">
                <svg
                className="w-8 h-8 text-black-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                viewBox="0 0 24 24"
                >
                <path
                    d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4s-4 1.79-4 4 1.79 4 4 4zM6 20c0-2.21 3.58-4 6-4s6 1.79 6 4v1H6v-1z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                </svg>
                <span>Driver</span>
            </div>
            </div>
                <br />

            <div className="grid grid-cols-6 gap-3 mb-6">

              {(() => {
                const { rows } = generateSeatLayout(selectedSchedule.bus.totalSeats);
                return Array.from({ length: rows }).map((_, rowIndex) => (
                  <React.Fragment key={`row-${rowIndex}`}>
                    {Array.from({ length: 2 }).map((_, colIndex) => {
                      const seatNumber = rowIndex * 4 + colIndex + 1;
                      if (seatNumber > selectedSchedule.bus.totalSeats) return null;
                      
                      const seatId = `S${seatNumber}`;
                      const isSelected = selectedSeats.includes(seatId);
                      const isAvailable = isSeatAvailable(seatId);

                      return (
                        <motion.button
                          key={seatId}
                          whileHover={isAvailable ? { scale: 1.05 } : {}}
                          whileTap={isAvailable ? { scale: 0.95 } : {}}
                          className={`p-2 rounded-md text-center text-sm font-medium transition-colors ${
                            isSelected 
                              ? "bg-primary text-white shadow-md" 
                              : isAvailable 
                                ? "bg-white border border-gray-300 hover:border-primary hover:bg-blue-50" 
                                : "bg-red-100 border border-red-200 text-red-400 cursor-not-allowed"
                          }`}
                          onClick={() =>
                            isAvailable && onSeatSelection(seatId)
                          }
                          disabled={!isAvailable}
                          title={isAvailable ? `Seat ${seatId} - Available` : `Seat ${seatId} - Unavailable`}
                        >
                          {seatId}
                        </motion.button>
                      );
                    })}

                    <div className="col-span-2 flex items-center justify-center">
                      <div className="h-0.5 w-full bg-gray-200"></div>
                    </div>

                    {Array.from({ length: 2 }).map((_, colIndex) => {
                      const seatNumber = rowIndex * 4 + colIndex + 3;
                      if (seatNumber > selectedSchedule.bus.totalSeats) return null;
                      
                      const seatId = `S${seatNumber}`;
                      const isSelected = selectedSeats.includes(seatId);
                      const isAvailable = isSeatAvailable(seatId);

                      return (
                        <motion.button
                          key={seatId}
                          whileHover={isAvailable ? { scale: 1.05 } : {}}
                          whileTap={isAvailable ? { scale: 0.95 } : {}}
                          className={`p-2 rounded-md text-center text-sm font-medium transition-colors ${
                            isSelected 
                              ? "bg-primary text-white shadow-md" 
                              : isAvailable 
                                ? "bg-white border border-gray-300 hover:border-primary hover:bg-blue-50" 
                                : "bg-red-100 border border-red-200 text-red-400 cursor-not-allowed"
                          }`}
                          onClick={() =>
                            isAvailable && onSeatSelection(seatId)
                          }
                          disabled={!isAvailable}
                          title={isAvailable ? `Seat ${seatId} - Available` : `Seat ${seatId} - Unavailable`}
                        >
                          {seatId}
                        </motion.button>
                      );
                    })}
                  </React.Fragment>
                ));
              })()}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border border-gray-300 mr-2"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-primary mr-2"></div>
              <span className="text-sm">Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-100 border border-red-200 mr-2"></div>
              <span className="text-sm">Unavailable</span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm">
              Selected Seats: {selectedSeats.join(", ") || "None"}
            </p>
            <p className="text-sm">
              Total: LKR {(selectedSchedule?.fare * selectedSeats.length).toFixed(2)}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBackToResults}>
          Back to Results
        </Button>
        <Button
          onClick={onContinueToPayment}
          disabled={selectedSeats.length === 0}
        >
          Continue to Payment ({selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''})
        </Button>
      </div>
    </div>
  );
};
