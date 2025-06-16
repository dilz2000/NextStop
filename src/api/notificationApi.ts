export interface BookingConfirmationRequest {
    email: string;
    passengerName: string;
    bookingId: number;
    route: string;
    travelDate: string;
    departureTime: string;
    busNumber: string;
    operatorName: string;
    seatNumbers: string[];
    numberOfSeats: number;
    pricePerSeat: number;
    totalAmount: number;
  }
  
  export const sendBookingConfirmationEmail = async (
    bookingData: BookingConfirmationRequest
  ): Promise<void> => {
    try {
      const response = await fetch('http://localhost:8765/notification-service/api/notifications/booking-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      console.log('Booking confirmation email sent successfully');
    } catch (error) {
      console.error('Error sending booking confirmation email:', error);
    }
  };
  