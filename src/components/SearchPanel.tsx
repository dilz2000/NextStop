
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, MapPin, Search } from "lucide-react";
import { format } from "date-fns";
import { isAuthenticated, redirectToLogin } from "../api/auth";

interface SearchPanelProps {
  onSearch?: (searchData: {
    origin: string;
    destination: string;
    date: Date | undefined;
  }) => void;
}

const capitalizeFirstLetter = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const SearchPanel = ({ onSearch = () => {} }: SearchPanelProps) => {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    string[]
  >([]);
  const [showOriginSuggestions, setShowOriginSuggestions] =
    useState<boolean>(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState<boolean>(false);
  const [authError, setAuthError] = useState<boolean>(false);

  // Mock data for location suggestions
  const locations = [
    "Colombo",
    "Trinco",
    "Kandy",
    "Galle",
    "Jaffna",
    "Anuradhapura",
    "Polonnaruwa",
    "Matara",
    "Negombo",
    "Kurunegala",
    "Ratnapura",
    "Mathugama",

  ];

  const handleOriginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOrigin(value);

    if (value.length > 1) {
      const filtered = locations.filter((location) =>
        location.toLowerCase().includes(value.toLowerCase()),
      );
      setOriginSuggestions(filtered);
      setShowOriginSuggestions(true);
    } else {
      setShowOriginSuggestions(false);
    }
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestination(value);

    if (value.length > 1) {
      const filtered = locations.filter((location) =>
        location.toLowerCase().includes(value.toLowerCase()),
      );
      setDestinationSuggestions(filtered);
      setShowDestinationSuggestions(true);
    } else {
      setShowDestinationSuggestions(false);
    }
  };

  const selectOrigin = (location: string) => {
    setOrigin(location);
    setShowOriginSuggestions(false);
  };

  const selectDestination = (location: string) => {
    setDestination(location);
    setShowDestinationSuggestions(false);
  };

  const handleSearch = () => {
    // Check if user is authenticated before proceeding
    if (!isAuthenticated()) {
      setAuthError(true);
      setTimeout(() => {
        setAuthError(false);
        redirectToLogin();
      }, 3000); // Show message for 3 seconds before redirecting
      return;
    }

    // Normalize origin and destination to proper case
    const normalizedOrigin = capitalizeFirstLetter(origin.trim());
    const normalizedDestination = capitalizeFirstLetter(destination.trim());

    onSearch({ 
      origin: normalizedOrigin, 
      destination: normalizedDestination, 
      date 
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Find Your Bus
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Origin Field */}
        <div className="relative">
          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all duration-200">
            <MapPin className="ml-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="From"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
              value={origin}
              onChange={handleOriginChange}
              onFocus={() =>
                origin.length > 1 && setShowOriginSuggestions(true)
              }
              onBlur={() =>
                setTimeout(() => setShowOriginSuggestions(false), 200)
              }
            />
          </div>

          {showOriginSuggestions && originSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {originSuggestions.map((location, index) => (
                <div
                  key={index}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                  onClick={() => selectOrigin(location)}
                >
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-700">{location}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Destination Field */}
        <div className="relative">
          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all duration-200">
            <MapPin className="ml-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="To"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
              value={destination}
              onChange={handleDestinationChange}
              onFocus={() =>
                destination.length > 1 && setShowDestinationSuggestions(true)
              }
              onBlur={() =>
                setTimeout(() => setShowDestinationSuggestions(false), 200)
              }
            />
          </div>

          {showDestinationSuggestions && destinationSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {destinationSuggestions.map((location, index) => (
                <div
                  key={index}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                  onClick={() => selectDestination(location)}
                >
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-700">{location}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date Picker */}
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-10 border hover:border-primary transition-colors duration-200"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                {date ? (
                  <span className="text-gray-700">
                    {format(date, "PPP")}
                  </span>
                ) : (
                  <span className="text-gray-400">Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Authentication Error Message */}
      {authError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md animate-pulse">
          <div className="flex items-center justify-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-800 font-medium text-center">
                You must Sign In first
              </p>
              <p className="text-red-600 text-sm text-center mt-1">
                Redirecting to login page...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search Button */}
      <div className="mt-6">
        <Button
          className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          onClick={handleSearch}
          disabled={!origin || !destination || !date || authError}
        >
          <Search className="mr-2 h-5 w-5" />
          Search Buses
        </Button>
      </div>

      {/* Helper Text */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Find the best bus routes for your journey
        </p>
      </div>
    </div>
  );
};

export default SearchPanel;
