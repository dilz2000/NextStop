// import { fetchAllUsers } from '../api/userApi';

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


// export const fetchUserById = async (userId: number): Promise<User> => {
//     try {
//       // Debug authentication
//       const token = localStorage.getItem('authToken');
//       const userData = localStorage.getItem('user');
      
//       console.log('=== AUTH DEBUG ===');
//       console.log('Token exists:', !!token);
//       console.log('Token length:', token?.length);
//       console.log('User data:', userData);
//       console.log('Current URL:', window.location.href);
//       console.log('==================');
      
//       console.log('Fetching user via getAllUsers approach for userId:', userId);
      
//       // Use the working getAllUsers endpoint
//       const allUsers = await fetchAllUsers();
//       console.log("USERS: ", allUsers)
      
//       // Rest of your existing code...
  
      
//       // Rest of your existing code...
  
    
//     // Find the specific user from the complete list
//     const user = allUsers.find(u => u.id == userId);
    
//     if (!user) {
//       console.warn(`User ${userId} not found in users list`);
//       // Return fallback data
//       return {
//         id: userId,
//         fullName: `User ${userId}`,
//         email: 'user@notfound.com',
//         emailVerified: false,
//         active: true,
//         roles: ['ROLE_CUSTOMER']
//       };
//     }
    
//     console.log('Successfully found user:', user);
//     return user;
//   } catch (error) {
//     console.error('Error fetching user via getAllUsers:', error);
//     // Return fallback data
//     return {
//       id: userId,
//       fullName: `User ${userId}`,
//       email: 'email@unavailable.com',
//       emailVerified: false,
//       active: true,
//       roles: ['ROLE_CUSTOMER']
//     };
//   }
// };

  

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

// Fetch complete booking details with better error handling
// export const fetchBookingDetails = async (booking: Booking): Promise<BookingDetails> => {
//     try {
//       const [userResult, scheduleResult] = await Promise.allSettled([
//         fetchUserById(booking.userId),
//         fetchScheduleById(booking.scheduleId)
//       ]);
  
//       let user: User;
//       let schedule: Schedule;
  
//       // Handle user fetch result
//       if (userResult.status === 'fulfilled') {
//         user = userResult.value;
//       } else {
//         console.warn('Failed to fetch user details, using fallback:', userResult.reason);
//         user = {
//           id: booking.userId,
//           fullName: `User ${booking.userId}`,
//           email: 'email@unavailable.com',
//           emailVerified: false,
//           active: true,
//           roles: ['ROLE_CUSTOMER']
//         };
//       }
  
//       // Handle schedule fetch result
//       if (scheduleResult.status === 'fulfilled') {
//         schedule = scheduleResult.value;
//       } else {
//         console.error('Failed to fetch schedule details:', scheduleResult.reason);
//         throw new Error('Schedule information is required but unavailable');
//       }
  
//       return {
//         booking,
//         user,
//         schedule
//       };
//     } catch (error) {
//       console.error('Error fetching booking details:', error);
//       throw error;
//     }
//   };
  
