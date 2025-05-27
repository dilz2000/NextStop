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

interface SearchPanelProps {
  onSearch?: (searchData: {
    origin: string;
    destination: string;
    date: Date | undefined;
  }) => void;
}

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

  // Mock data for location suggestions
  const locations = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "San Jose, CA",
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
    onSearch({ origin, destination, date });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6">Find Your Bus</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Origin Field */}
        <div className="relative">
          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
            <MapPin className="ml-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="From"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectOrigin(location)}
                >
                  {location}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Destination Field */}
        <div className="relative">
          <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
            <MapPin className="ml-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="To"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectDestination(location)}
                >
                  {location}
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
                className="w-full justify-start text-left font-normal h-10 border"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select date</span>}
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

      {/* Search Button */}
      <div className="mt-6">
        <Button
          className="w-full py-6 text-lg font-semibold"
          onClick={handleSearch}
          disabled={!origin || !destination || !date}
        >
          <Search className="mr-2 h-5 w-5" />
          Search Buses
        </Button>
      </div>
    </div>
  );
};

export default SearchPanel;
