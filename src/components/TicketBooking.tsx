import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import SearchPanel from "./SearchPanel";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  User,
  Ticket,
  Search,
} from "lucide-react";
import { BookingStatus, PaymentStatus } from "@/types/models";

const TicketBooking = () => {
  const [step, setStep] = useState<number>(1);
  const [searchResults, setSearchResults] = useState<any[]>([
    {
      id: "1",
      route: "New York to Boston",
      departureTime: "10:30 AM",
      arrivalTime: "2:30 PM",
      duration: "4h",
      price: 45.0,
      availableSeats: 32,
      busType: "Premium",
      seatLayout: {
        rows: 10,
        columns: 4,
        unavailableSeats: ["A1", "B3", "C5", "D7", "A9"],
      },
    },
    {
      id: "2",
      route: "New York to Boston",
      departureTime: "12:00 PM",
      arrivalTime: "4:00 PM",
      duration: "4h",
      price: 40.0,
      availableSeats: 28,
      busType: "Standard",
      seatLayout: {
        rows: 10,
        columns: 4,
        unavailableSeats: ["B2", "C3", "D4", "A6", "B8"],
      },
    },
    {
      id: "3",
      route: "New York to Boston",
      departureTime: "3:30 PM",
      arrivalTime: "7:30 PM",
      duration: "4h",
      price: 50.0,
      availableSeats: 15,
      busType: "Premium",
      seatLayout: {
        rows: 10,
        columns: 4,
        unavailableSeats: ["A2", "B4", "C6", "D8", "A10"],
      },
    },
  ]);
  const [selectedBus, setSelectedBus] = useState<any | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengerDetails, setPassengerDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleSearch = (searchData: {
    origin: string;
    destination: string;
    date: Date | undefined;
  }) => {
    console.log("Search data:", searchData);
    // In a real app, this would fetch results from an API
    setStep(2);
  };

  const handleSelectBus = (bus: any) => {
    setSelectedBus(bus);
    setStep(3);
  };

  const handleSeatSelection = (seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else if (selectedSeats.length < 4) {
      // Limit to 4 seats per booking
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const isSeatAvailable = (seatId: string) => {
    if (!selectedBus) return true;
    return !selectedBus.seatLayout.unavailableSeats.includes(seatId);
  };

  const generateSeatId = (row: number, col: number) => {
    const rowLabel = String.fromCharCode(65 + row); // A, B, C, D...
    return `${rowLabel}${col + 1}`;
  };

  const handlePassengerDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setPassengerDetails({ ...passengerDetails, [name]: value });
  };

  const handleContinueToPayment = () => {
    setStep(4);
  };

  const handlePaymentSubmit = () => {
    // In a real app, this would process payment through a payment gateway
    setBookingConfirmed(true);
    setStep(5);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1: // Search
        return (
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Book Your Bus Ticket</h2>
            <SearchPanel onSearch={handleSearch} />
          </div>
        );

      case 2: // Results
        return (
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Available Buses</h2>
            <div className="space-y-4">
              {searchResults.map((bus, index) => (
                <motion.div
                  key={bus.id}
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
                          {bus.route}
                        </span>
                        <span className="ml-3 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {bus.busType}
                        </span>
                      </div>
                      <div className="text-gray-500 text-sm space-y-1">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>
                            {bus.departureTime} - {bus.arrivalTime} (
                            {bus.duration})
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>Available Seats: {bus.availableSeats}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-xl font-bold text-primary mb-2">
                        ${bus.price.toFixed(2)}
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button onClick={() => handleSelectBus(bus)}>
                          Select Bus
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div className="mt-4" whileHover={{ scale: 1.02 }}>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back to Search
              </Button>
            </motion.div>
          </div>
        );

      case 3: // Seat Selection
        return (
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Select Your Seats</h2>
            {selectedBus && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold">{selectedBus.route}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedBus.departureTime} - {selectedBus.arrivalTime}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedBus.busType} Bus • {selectedBus.duration} journey
                    </p>
                  </div>
                  <div className="text-xl font-bold text-primary">
                    ${selectedBus.price.toFixed(2)}
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

              {selectedBus && (
                <div className="mb-6">
                  {/* Bus front */}
                  <div className="w-full bg-gray-200 h-10 rounded-t-xl mb-4 flex items-center justify-center text-gray-600 font-medium">
                    <MapPin className="h-4 w-4 mr-2" /> Front of the Bus
                  </div>

                  {/* Seat layout */}
                  <div className="grid grid-cols-6 gap-3 mb-6">
                    {/* Aisle label */}
                    <div className="col-span-3 text-right text-xs text-gray-500 pr-1">
                      Window
                    </div>
                    <div className="col-span-3 text-left text-xs text-gray-500 pl-1">
                      Window
                    </div>

                    {Array.from({ length: selectedBus.seatLayout.rows }).map(
                      (_, rowIndex) => (
                        <React.Fragment key={`row-${rowIndex}`}>
                          {/* Left side seats (A, B) */}
                          {Array.from({ length: 2 }).map((_, colIndex) => {
                            const seatId = generateSeatId(colIndex, rowIndex);
                            const isSelected = selectedSeats.includes(seatId);
                            const isAvailable = isSeatAvailable(seatId);

                            return (
                              <motion.button
                                key={seatId}
                                whileHover={isAvailable ? { scale: 1.05 } : {}}
                                whileTap={isAvailable ? { scale: 0.95 } : {}}
                                className={`p-2 rounded-md text-center ${isSelected ? "bg-primary text-white" : isAvailable ? "bg-white border border-gray-300 hover:border-primary" : "bg-gray-200 cursor-not-allowed"}`}
                                onClick={() =>
                                  isAvailable && handleSeatSelection(seatId)
                                }
                                disabled={!isAvailable}
                              >
                                {seatId}
                              </motion.button>
                            );
                          })}

                          {/* Aisle */}
                          <div className="col-span-2 flex items-center justify-center">
                            <div className="h-0.5 w-full bg-gray-200"></div>
                          </div>

                          {/* Right side seats (C, D) */}
                          {Array.from({ length: 2 }).map((_, colIndex) => {
                            const seatId = generateSeatId(
                              colIndex + 2,
                              rowIndex,
                            );
                            const isSelected = selectedSeats.includes(seatId);
                            const isAvailable = isSeatAvailable(seatId);

                            return (
                              <motion.button
                                key={seatId}
                                whileHover={isAvailable ? { scale: 1.05 } : {}}
                                whileTap={isAvailable ? { scale: 0.95 } : {}}
                                className={`p-2 rounded-md text-center ${isSelected ? "bg-primary text-white" : isAvailable ? "bg-white border border-gray-300 hover:border-primary" : "bg-gray-200 cursor-not-allowed"}`}
                                onClick={() =>
                                  isAvailable && handleSeatSelection(seatId)
                                }
                                disabled={!isAvailable}
                              >
                                {seatId}
                              </motion.button>
                            );
                          })}
                        </React.Fragment>
                      ),
                    )}
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
                    <div className="w-4 h-4 bg-gray-200 mr-2"></div>
                    <span className="text-sm">Unavailable</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm">
                    Selected Seats: {selectedSeats.join(", ") || "None"}
                  </p>
                  <p className="text-sm">
                    Total: $
                    {(selectedBus?.price * selectedSeats.length).toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back to Results
              </Button>
              <Button
                onClick={handleContinueToPayment}
                disabled={selectedSeats.length === 0}
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        );

      case 4: // Payment
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
                    onChange={handlePassengerDetailsChange}
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
                    onChange={handlePassengerDetailsChange}
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
                    onChange={handlePassengerDetailsChange}
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
                  <span className="font-medium">{selectedBus?.route}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span className="font-medium">
                    {selectedBus?.departureTime}
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
                    ${selectedBus?.price.toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>
                      ${(selectedBus?.price * selectedSeats.length).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back to Seat Selection
              </Button>
              <Button
                onClick={handlePaymentSubmit}
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

      case 5: // Confirmation
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
                    <p className="font-medium">{selectedBus?.route}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">{selectedBus?.departureTime}</p>
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
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">
                      ${(selectedBus?.price * selectedSeats.length).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep(1);
                    setSelectedBus(null);
                    setSelectedSeats([]);
                    setPassengerDetails({ name: "", email: "", phone: "" });
                    setBookingConfirmed(false);
                  }}
                >
                  Book Another Ticket
                </Button>
                <Button onClick={() => (window.location.href = "/my-bookings")}>
                  View My Bookings
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <a href="/">
              <h1 className="text-2xl font-bold text-primary">BusBooker</h1>
            </a>
          </div>
          <div className="hidden md:flex space-x-6">
            <a
              href="/"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Home
            </a>
            <a
              href="/ticket-booking"
              className="text-primary font-medium transition-colors"
            >
              Book Tickets
            </a>
            <a
              href="/my-bookings"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              My Bookings
            </a>
            <a
              href="/support"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Support
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">Register</Button>
          </div>
        </div>
      </nav>

      {/* Progress Indicator */}
      {step < 5 && (
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <div
              className={`flex flex-col items-center ${step >= 1 ? "text-primary" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-white" : "bg-gray-200"}`}
              >
                <Search className="h-4 w-4" />
              </div>
              <span className="text-xs mt-1">Search</span>
            </div>
            <div
              className={`flex-1 h-1 ${step >= 2 ? "bg-primary" : "bg-gray-200"}`}
            ></div>
            <div
              className={`flex flex-col items-center ${step >= 2 ? "text-primary" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-white" : "bg-gray-200"}`}
              >
                <MapPin className="h-4 w-4" />
              </div>
              <span className="text-xs mt-1">Select Bus</span>
            </div>
            <div
              className={`flex-1 h-1 ${step >= 3 ? "bg-primary" : "bg-gray-200"}`}
            ></div>
            <div
              className={`flex flex-col items-center ${step >= 3 ? "text-primary" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-white" : "bg-gray-200"}`}
              >
                <Ticket className="h-4 w-4" />
              </div>
              <span className="text-xs mt-1">Select Seats</span>
            </div>
            <div
              className={`flex-1 h-1 ${step >= 4 ? "bg-primary" : "bg-gray-200"}`}
            ></div>
            <div
              className={`flex flex-col items-center ${step >= 4 ? "text-primary" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 4 ? "bg-primary text-white" : "bg-gray-200"}`}
              >
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="text-xs mt-1">Payment</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderStepContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default TicketBooking;
