
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Search, MapPin, Ticket, CreditCard } from "lucide-react";
import { ScheduleResponse } from "@/api/scheduleApi";
import { SearchStep } from "../components/BookingSteps/SearchStep";
import { ResultsStep } from "../components/BookingSteps/ResultsStep";
import { SeatSelectionStep } from "../components/BookingSteps/SeatSelectionStep";
import { PaymentStep } from "../components/BookingSteps/PaymentStep";
import { ConfirmationStep } from "../components/BookingSteps/ConfirmationStep";
import Navigation from "./Navigation";

const TicketBooking = () => {
  const [searchResults, setSearchResults] = useState<{
    origin: string;
    destination: string;
    date: Date | undefined;
  } | null>(null);
  
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [step, setStep] = useState<number>(1);
  
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleResponse | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengerDetails, setPassengerDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <SearchStep 
            onSearchComplete={(searchData, fetchedSchedules) => {
              setSearchResults(searchData);
              setSchedules(fetchedSchedules);
              setStep(2);
            }}
          />
        );
      case 2:
        return (
          <ResultsStep 
            schedules={schedules}
            onSelectBus={(schedule) => {
              setSelectedSchedule(schedule);
              setStep(3);
            }}
            onBackToSearch={() => setStep(1)}
          />
        );
      case 3:
        return (
          <SeatSelectionStep 
            selectedSchedule={selectedSchedule}
            selectedSeats={selectedSeats}
            onSeatSelection={(seatNumber) => {
              if (selectedSeats.includes(seatNumber)) {
                setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
              } else if (selectedSeats.length < 4) {
                setSelectedSeats([...selectedSeats, seatNumber]);
              }
            }}
            onContinueToPayment={() => setStep(4)}
            onBackToResults={() => setStep(2)}
          />
        );
      case 4:
        return (
          <PaymentStep 
            selectedSchedule={selectedSchedule}
            selectedSeats={selectedSeats}
            passengerDetails={passengerDetails}
            onPassengerDetailsChange={(e) => {
              const { name, value } = e.target;
              setPassengerDetails({ ...passengerDetails, [name]: value });
            }}
            onPaymentSubmit={() => {
              setBookingConfirmed(true);
              setStep(5);
            }}
            onBackToSeatSelection={() => setStep(3)}
          />
        );
      case 5:
        return (
          <ConfirmationStep 
            selectedSchedule={selectedSchedule}
            selectedSeats={selectedSeats}
            passengerDetails={passengerDetails}
            onBookAnother={() => {
              setStep(1);
              setSelectedSchedule(null);
              setSelectedSeats([]);
              setPassengerDetails({ name: "", email: "", phone: "" });
              setBookingConfirmed(false);
              setSchedules([]);
              setSearchResults(null);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <Navigation currentPage="booking" />

      {/* Progress Indicator */}
      {step < 5 && (
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <div className={`flex flex-col items-center ${step >= 1 ? "text-primary" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-white" : "bg-gray-200"}`}>
                <Search className="h-4 w-4" />
              </div>
              <span className="text-xs mt-1">Search</span>
            </div>
            <div className={`flex-1 h-1 ${step >= 2 ? "bg-primary" : "bg-gray-200"}`}></div>
            <div className={`flex flex-col items-center ${step >= 2 ? "text-primary" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-white" : "bg-gray-200"}`}>
                <MapPin className="h-4 w-4" />
              </div>
              <span className="text-xs mt-1">Select Bus</span>
            </div>
            <div className={`flex-1 h-1 ${step >= 3 ? "bg-primary" : "bg-gray-200"}`}></div>
            <div className={`flex flex-col items-center ${step >= 3 ? "text-primary" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-white" : "bg-gray-200"}`}>
                <Ticket className="h-4 w-4" />
              </div>
              <span className="text-xs mt-1">Select Seats</span>
            </div>
            <div className={`flex-1 h-1 ${step >= 4 ? "bg-primary" : "bg-gray-200"}`}></div>
            <div className={`flex flex-col items-center ${step >= 4 ? "text-primary" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 4 ? "bg-primary text-white" : "bg-gray-200"}`}>
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
