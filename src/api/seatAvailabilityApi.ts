export interface SeatAvailability {
    seatId: number;
    seatNumber: string;
    available: boolean;
  }
  
  export const fetchSeatAvailability = async (scheduleId: number): Promise<SeatAvailability[]> => {
    console.log("SCHEDULE ID: ", scheduleId);
    try {
      const response = await fetch(
        `http://localhost:8765/booking-service/v1/bookings/seats/availability/${scheduleId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: SeatAvailability[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching seat availability:', error);
      throw error;
    }
  };
  