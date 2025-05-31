import React from "react";
import SearchPanel from "../SearchPanel";
import { fetchSchedules, ScheduleResponse } from "@/api/scheduleApi";

interface SearchStepProps {
  onSearchComplete: (
    searchData: {
      origin: string;
      destination: string;
      date: Date | undefined;
    },
    schedules: ScheduleResponse[]
  ) => void;
}

export const SearchStep: React.FC<SearchStepProps> = ({ onSearchComplete }) => {
  const handleSearch = async (searchData: {
    origin: string;
    destination: string;
    date: Date | undefined;
  }) => {
    if (searchData.origin && searchData.destination && searchData.date) {
      try {
        const formattedDate = searchData.date.toISOString().split("T")[0];
        const result = await fetchSchedules(
          searchData.origin,
          searchData.destination,
          formattedDate
        );
        onSearchComplete(searchData, result);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
        onSearchComplete(searchData, []);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Book Your Bus Ticket</h2>
      <SearchPanel onSearch={handleSearch} />
    </div>
  );
};
