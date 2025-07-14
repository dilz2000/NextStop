export interface BookingRequest {
    userId: number;
    scheduleId: number;
    seatIds: number[];
    travelDate: string;
  }
  
  export interface BookingResponse {
    success: boolean;
    message: string;
    bookingId?: number;
  }
  
  export const createBooking = async (bookingData: BookingRequest): Promise<BookingResponse> => {
    try {
        const modifiedBookingData = {
            ...bookingData,
            travelDate: bookingData.travelDate // Keep as is, but ensure it's formatted correctly in PaymentStep
          };
      const response = await fetch('http://localhost:8765/booking-service/v1/bookings/book-seat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modifiedBookingData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return {
        success: true,
        message: 'Booking created successfully',
        bookingId: data.bookingId || data.id
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        message: 'Failed to create booking. Please try again.'
      };
    }
  };
  


