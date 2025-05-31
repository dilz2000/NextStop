import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Clock, MapPin, Ticket, Bus } from "lucide-react";
import { ScheduleResponse } from "@/api/scheduleApi";

interface ResultsStepProps {
  schedules: ScheduleResponse[];
  onSelectBus: (schedule: ScheduleResponse) => void;
  onBackToSearch: () => void;
}

export const ResultsStep: React.FC<ResultsStepProps> = ({
  schedules,
  onSelectBus,
  onBackToSearch,
}) => {
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Available Buses</h2>
      {schedules.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">No buses available for the selected route and date.</p>
          <Button className="mt-4" variant="outline" onClick={onBackToSearch}>
            Search Again
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule, index) => (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-semibold">
                      {getRouteDisplay(schedule.route)}
                    </span>
                    <span className="ml-3 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {schedule.bus.type}
                    </span>
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {schedule.bus.operatorName}
                    </span>
                  </div>
                  <div className="text-gray-500 text-sm space-y-1">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        {formatTime(schedule.departureTime)} - {formatTime(schedule.arrivalTime)} 
                        ({formatDuration(schedule.route.duration)})
                      </span>
                    </div>
                    <div className="flex items-center">
                        <Bus className="h-4 w-4 mr-2" />
                        <span>Bus: {schedule.bus.busNumber}</span>
                        </div>
                    <div className="flex items-center">
                      <Ticket className="h-4 w-4 mr-2" />
                      <span>Total Seats: {schedule.bus.totalSeats}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>Distance: {schedule.route.distanceKm} km</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-xl font-bold text-primary mb-2">
                    LKR {schedule.fare.toFixed(2)}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button onClick={() => onSelectBus(schedule)}>
                      Select Bus
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <motion.div className="mt-4" whileHover={{ scale: 1.02 }}>
        <Button variant="outline" onClick={onBackToSearch}>
          Back to Search
        </Button>
      </motion.div>
    </div>
  );
};
