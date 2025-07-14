
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { CreditCard, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { ScheduleResponse } from "@/api/scheduleApi";
import { processPayment } from "@/api/paymentApi";
import { createBooking } from "@/api/ticketbookingAPI";
import { getSeatIdsBySeatNumbers } from "@/api/seatMappingApi";
import { sendBookingConfirmationEmail } from "@/api/notificationApi";

interface PaymentStepProps {
  selectedSchedule: ScheduleResponse | null;
  selectedSeats: string[]; // Display seat numbers like ["S1", "S7", "S12"]
  travelDate: Date | undefined;
  onPaymentSuccess: (bookingId: number) => void;
  onBackToSeatSelection: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  selectedSchedule,
  selectedSeats,
  travelDate,
  onPaymentSuccess,
  onBackToSeatSelection,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'success' | 'error'>('select');

  const getUserId = (): number | null => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id || null;
      }
      return null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  };

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getRouteDisplay = (route: ScheduleResponse['route']) => {
    return `${route.sourceCity} → ${route.destinationCity}`;
  };

  const totalAmount = selectedSchedule ? selectedSchedule.fare * selectedSeats.length : 0;

  const paymentMethods = [
    { id: 'pm_card_visa', name: 'Visa Card', description: 'Pay with Visa' },
    { id: 'pm_card_mastercard', name: 'Mastercard', description: 'Pay with Mastercard' },
    { id: 'pm_card_amex', name: 'American Express', description: 'Pay with Amex' }
  ];

  const getUserInfo = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return {
          fullName: user.fullName || 'N/A',
          email: user.email || 'N/A'
        };
      }
      return { fullName: 'N/A', email: 'N/A' };
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return { fullName: 'N/A', email: 'N/A' };
    }
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }

    if (!selectedSchedule || !travelDate) {
      setError('Missing booking information');
      return;
    }

    const userId = getUserId();
    if (!userId) {
      setError('User not found. Please log in again.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setPaymentStep('processing');

    try {
      // Map seat numbers to actual seat IDs
      console.log('Mapping seat numbers to IDs:', selectedSeats);
      const actualSeatIds = await getSeatIdsBySeatNumbers(selectedSchedule.id, selectedSeats);
      console.log('Actual seat IDs from backend:', actualSeatIds);

      const adjustedTravelDate = new Date(travelDate);
      adjustedTravelDate.setDate(adjustedTravelDate.getDate() + 1);
      const formattedTravelDate = adjustedTravelDate.toISOString().split('T')[0];

      // Process Payment
      const paymentData = {
        userId,
        scheduleId: selectedSchedule.id,
        travelDate: formattedTravelDate,
        amount: totalAmount,
        paymentMethodId: selectedPaymentMethod,
        currency: 'lkr'
      };

      console.log('Processing payment with data:', paymentData);
      const paymentResult = await processPayment(paymentData);

      if (!paymentResult.success) {
        throw new Error(paymentResult.message);
      }

      console.log('Payment successful:', paymentResult);

      // Create Booking with actual seat IDs
      const bookingData = {
        userId,
        scheduleId: selectedSchedule.id,
        seatIds: actualSeatIds, // Use the mapped seat IDs
        travelDate: formattedTravelDate 
      };

      console.log('Creating booking with data:', bookingData);
      const bookingResult = await createBooking(bookingData);

      if (!bookingResult.success) {
        throw new Error(bookingResult.message);
      }

      console.log('Booking successful:', bookingResult);

      // Send booking confirmation email
    try {
      const userInfo = getUserInfo();
      if (userInfo.email && userInfo.fullName && selectedSchedule) {
        const emailData = {
          email: userInfo.email,
          passengerName: userInfo.fullName,
          bookingId: bookingResult.bookingId || 0,
          route: getRouteDisplay(selectedSchedule.route),
          travelDate: formatDate(travelDate),
          departureTime: formatTime(selectedSchedule.departureTime),
          busNumber: selectedSchedule.bus.busNumber,
          operatorName: selectedSchedule.bus.operatorName,
          seatNumbers: selectedSeats,
          numberOfSeats: selectedSeats.length,
          pricePerSeat: selectedSchedule.fare,
          totalAmount: totalAmount
        };
        
        await sendBookingConfirmationEmail(emailData);
        console.log('Booking confirmation email sent');
      }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Continue with booking success even if email fails
    }

      setPaymentStep('success');
      
      // Redirect to success after 2 seconds
      setTimeout(() => {
        if (bookingResult.bookingId) {
          onPaymentSuccess(bookingResult.bookingId);
        }
      }, 2000);

    } catch (error: any) {
      console.error('Payment/Booking error:', error);
      setError(error.message || 'Payment failed. Please try again.');
      setPaymentStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentContent = () => {
    switch (paymentStep) {
      case 'processing':
        return (
          <div className="text-center py-8">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">Processing Payment</h3>
            <p className="text-gray-600 mb-4">Please wait while we process your payment...</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                Do not close this window or navigate away from this page.
              </p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">Payment Successful!</h3>
            <p className="text-green-600 mb-4">Your booking has been confirmed.</p>
            <p className="text-sm text-gray-500">Redirecting to confirmation...</p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-800 mb-2">Payment Failed</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => setPaymentStep('select')} className="mr-2">
              Try Again
            </Button>
            <Button variant="outline" onClick={onBackToSeatSelection}>
              Back to Seat Selection
            </Button>
          </div>
        );

      default:
        return (
          <>
            {/* Booking Summary */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-900 mb-3">Booking Summary</h3>
              {selectedSchedule && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Route:</span>
                    <span className="font-medium">{getRouteDisplay(selectedSchedule.route)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Travel Date:</span>
                    <span className="font-medium">{formatDate(travelDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Departure Time:</span>
                    <span className="font-medium">{formatTime(selectedSchedule.departureTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Bus:</span>
                    <span className="font-medium">
                      {selectedSchedule.bus.busNumber} ({selectedSchedule.bus.operatorName})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Selected Seats:</span>
                    <span className="font-medium">{selectedSeats.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Number of Seats:</span>
                    <span className="font-medium">{selectedSeats.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Price per Seat:</span>
                    <span className="font-medium">LKR {selectedSchedule.fare.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-blue-900">Total Amount:</span>
                      <span className="text-blue-900">LKR {totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Select Payment Method
              </h3>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedPaymentMethod === method.id
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={method.id}
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPaymentMethod === method.id}
                        onChange={() => setSelectedPaymentMethod(method.id)}
                        className="mr-3"
                      />
                      <div>
                        <label htmlFor={method.id} className="font-medium cursor-pointer">
                          {method.name}
                        </label>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Important Notes */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Important Notes:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• This is a test payment using Stripe test mode</li>
                <li>• No real money will be charged</li>
                <li>• Your booking will be confirmed after successful payment</li>
                <li>• You will receive a confirmation email</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={onBackToSeatSelection}
                disabled={isProcessing}
              >
                Back to Seat Selection
              </Button>
              <Button
                onClick={handlePayment}
                disabled={!selectedPaymentMethod || isProcessing}
                className="min-w-[200px]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay LKR {totalAmount.toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payment</h2>
        {travelDate && (
          <span className="text-lg text-gray-600">
            {formatDate(travelDate)}
          </span>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderPaymentContent()}
      </motion.div>
    </div>
  );
};
