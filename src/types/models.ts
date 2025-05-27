// Data models for the bus booking application

// Bus model
export interface Bus {
  id: string;
  name: string;
  registrationNumber: string;
  capacity: number;
  amenities: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Route model
export interface Route {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: number; // in minutes
  fare: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schedule model
export interface Schedule {
  id: string;
  routeId: string;
  busId: string;
  departureTime: Date;
  arrivalTime: Date;
  availableSeats: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Booking model
export interface Booking {
  id: string;
  userId: string;
  scheduleId: string;
  seatNumbers: string[];
  totalFare: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Booking status enum
export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

// Payment status enum
export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
  FAILED = "FAILED",
}

// User model
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// User role enum
export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}
