export interface SeatAvailability {
    seatId: number;
    seatNumber: string;
    available: boolean;
  }

  export const fetchSeatAvailability = async (scheduleId: number, travelDate: string): Promise<SeatAvailability[]> => {
    console.log("SCHEDULE ID: ", scheduleId, "TRAVEL DATE: ", travelDate);
    
    // Add one day to the travel date
    const adjustedDate = new Date(travelDate);
    adjustedDate.setDate(adjustedDate.getDate() + 1);
    const adjustedDateString = adjustedDate.toISOString().split("T")[0];
    
    console.log("ADJUSTED TRAVEL DATE: ", adjustedDateString);
    
    try {
      const response = await fetch(
        `http://localhost:8765/booking-service/v1/bookings/seats/availability/${scheduleId}?travelDate=${adjustedDateString}`,
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
  