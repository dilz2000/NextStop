export interface CancelBookingResponse {
    success: boolean;
    message: string;
  }
  
  export const cancelBooking = async (bookingId: number): Promise<CancelBookingResponse> => {
    try {
      const response = await fetch(
        `http://localhost:8765/booking-service/v1/bookings/cancel/${bookingId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return {
        success: true,
        message: 'Booking cancelled successfully'
      };
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return {
        success: false,
        message: 'Failed to cancel booking. Please try again.'
      };
    }
  };
  