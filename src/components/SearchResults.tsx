// src/components/SearchResults.tsx
import { format } from "date-fns";
import { ScheduleResponse } from "@/api/scheduleApi";
import SeatSelectionModal from "./SeatSelectionModal"; 
import React, { useState, useEffect } from "react";

interface SearchResultsProps {
  schedules: ScheduleResponse[];
}

const SearchResults = ({ schedules }: SearchResultsProps) => {

    const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookNow = (scheduleId) => {
    const schedule = schedules.find((s) => s.id === scheduleId);
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSchedule(null);
  };

  // Filter schedules to show only those with bus.status = 'active'
  const activeSchedules = schedules.filter((schedule) => schedule.status === 'active');

  if (!activeSchedules.length) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-center text-gray-500">No buses available.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {activeSchedules.map((schedule) => (
        <div
          key={schedule.id}
          className="border rounded-lg p-4 bg-gray-50 shadow-sm"
        >
          <div className="flex justify-between items-center bg-white shadow-md rounded-lg p-6 mb-4">
        {/* Left: Bus Details */}
        <div>
            <p className="text-xl font-bold text-gray-900">{schedule.bus.operatorName}</p>
            <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-700">
                <span className="font-semibold">Bus Number:</span> {schedule.bus.busNumber}
            </p>
            <p className="text-sm text-gray-700 capitalize">
                <span className="font-semibold">Type:</span> {schedule.bus.type}
            </p>
            <p className="text-sm text-gray-700">
                <span className="font-semibold">Total Seats:</span> {schedule.bus.totalSeats}
            </p>
            <p className="text-xs text-gray-400">
                <span className="font-semibold">ID:</span> {schedule.id}
            </p>
            </div>
        </div>

        {/* Center: Schedule Details */}
        <div className="flex flex-col items-start mx-8">
            <div className="flex items-center space-x-4 mb-2">
            <p className="text-base font-medium text-green-700">
                Departure: {format(new Date(schedule.departureTime), "p")}
            </p>
            <span className="text-gray-400">→</span>
            <p className="text-base font-medium text-blue-700">
                Arrival: {format(new Date(schedule.arrivalTime), "p")}
            </p>
            </div>
            <div className="space-y-1">
            <p className="text-sm text-gray-600">
                <span className="font-semibold">Fare:</span> ₹{schedule.fare.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
                <span className="font-semibold">Source:</span> {schedule.route.sourceCity}
            </p>
            </div>
        </div>

        {/* Right: Book Now Button */}
        {/* <div className="flex flex-col items-end">
            <button
            className="bg-black text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-gray-900 transition"
            onClick={() => handleBookNow(schedule.id)}
            >
            Book Now
            </button>
        </div> */}
        </div>

        </div>
      ))}
      {isModalOpen && selectedSchedule && (
        <SeatSelectionModal
          schedule={selectedSchedule}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default SearchResults;
