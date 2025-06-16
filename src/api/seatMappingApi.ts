export interface SeatMapping {
    seatId: number;
    seatNumber: string;
  }
  
  export const getSeatIdsBySeatNumbers = async (
    scheduleId: number, 
    seatNumbers: string[]
  ): Promise<number[]> => {
    try {
      const response = await fetch(
        `http://localhost:8765/booking-service/v1/bookings/seats/map-seat-numbers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            scheduleId: scheduleId,
            seatNumbers: seatNumbers
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const seatIds: number[] = await response.json();
      return seatIds;
    } catch (error) {
      console.error('Error mapping seat numbers to IDs:', error);
      throw error;
    }
  };
  