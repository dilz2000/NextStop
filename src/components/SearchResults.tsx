// src/components/SearchResults.tsx
import { format } from "date-fns";
import { ScheduleResponse } from "@/api/scheduleApi";

interface SearchResultsProps {
  schedules: ScheduleResponse[];
}

const SearchResults = ({ schedules }: SearchResultsProps) => {
  if (!schedules.length) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-center text-gray-500">No buses available.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {schedules.map((schedule) => (
        <div
          key={schedule.id}
          className="border rounded-lg p-4 bg-gray-50 shadow-sm"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-bold">{schedule.bus.operatorName}</p>
              <p className="text-sm text-gray-600">{schedule.bus.busNumber}</p>
              <p className="text-sm text-gray-600 capitalize">{schedule.bus.type}</p>
              <p className="text-sm text-gray-600">
                Total Seats: {schedule.bus.totalSeats}
              </p>
            </div>
            <div className="text-right">
              <p className="text-md font-medium">
                Departure: {format(new Date(schedule.departureTime), "p")}
              </p>
              <p className="text-sm text-gray-500">
                Arrival: {format(new Date(schedule.arrivalTime), "p")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
