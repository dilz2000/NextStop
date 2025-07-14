
const BASE_URL = 'http://localhost:8765/booking-service/v1';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to create headers with auth token
const createAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export interface Booking {
  id: number;
  userId: number;
  scheduleId: number;
  seatNumbers: string; // comma separated
  numberOfSeats: number;
  pricePerSeat: number;
  totalPrice: number;
  source: string;
  destination: string;
  bookingDateTime: string; // ISO string
  travelDate: string; // date string
  departureTime: string; // time string
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  emailVerified: boolean;
  active: boolean;
  roles: string[];
}

export interface Bus {
  id: number;
  busNumber: string;
  type: string;
  totalSeats: number;
  operatorName: string;
  status: string;
}

export interface Route {
  id: number;
  sourceCity: string;
  destinationCity: string;
  distanceKm: number;
  duration: string;
  status: string;
}

export interface Schedule {
  id: number;
  bus: Bus;
  route: Route;
  departureTime: string;
  arrivalTime: string;
  status: string;
  fare: number;
}

export interface BookingDetails {
  booking: Booking;
  user: User;
  schedule: Schedule;
}

// Fetch all bookings
export const fetchAllBookings = async (): Promise<Booking[]> => {
  try {
    const response = await fetch(`${BASE_URL}/bookings/all`, {
      headers: createAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

// Fetch user by id
export const fetchUserById = async (userId: number): Promise<User> => {
  try {
    const response = await fetch(`http://localhost:8765/user-service/api/admin/users/${userId}`, {
      headers: createAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Fetch schedule by id (includes bus and route details)
export const fetchScheduleById = async (scheduleId: number): Promise<Schedule> => {
  try {
    const response = await fetch(`http://localhost:8765/bus-service/schedules/getAllSchedules`);
    if (!response.ok) {
      throw new Error('Failed to fetch schedules');
    }
    const schedules: Schedule[] = await response.json();
    const schedule = schedules.find(s => s.id === scheduleId);
    if (!schedule) {
      throw new Error('Schedule not found');
    }
    return schedule;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
};

// Fetch complete booking details
export const fetchBookingDetails = async (booking: Booking): Promise<BookingDetails> => {
  try {
    const [user, schedule] = await Promise.all([
      fetchUserById(booking.userId),
      fetchScheduleById(booking.scheduleId)
    ]);

    return {
      booking,
      user,
      schedule
    };
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw error;
  }
};

