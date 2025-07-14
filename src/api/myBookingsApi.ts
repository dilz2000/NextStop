const BASE_URL = 'http://localhost:8765/booking-service/v1';

export interface Booking {
  bookingId: number;
  userId: number;
  seatNumbers: string[];
  numberOfSeats: number;
  pricePerSeat: number;
  totalPrice: number;
  source: string;
  destination: string;
  departureTime: string;
  travelDate: string;
  bookingDateTime: string;
  busNumber: string;
  busType: string;
  operatorName: string;
}

export const fetchUserBookings = async (userId: number): Promise<Booking[]> => {
  try {
    const response = await fetch(`${BASE_URL}/bookings/userBookings/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};
