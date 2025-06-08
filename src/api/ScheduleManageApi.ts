// const BASE_URL = 'http://localhost:8765/bus-service';
const BASE_URL = 'http://localhost:8080';

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
  duration: string; // HH:MM:SS
  status: string;
}

export interface ScheduleFromAPI {
  id: number;
  bus: Bus;
  route: Route;
  departureTime: string; // ISO string
  arrivalTime: string; // ISO string
  status: string;
  fare: number;
}

export interface Schedule {
  id: number;
  bus: Bus;
  route: Route;
  departureTime: string; // ISO string
  arrivalTime: string; // ISO string
  status: 'active' | 'inactive';
  fare: number;
}

export interface ScheduleCreateRequest {
  bus: { id: number };
  route: { id: number };
  departureTime: string; // ISO string
  arrivalTime: string; // ISO string
  fare: number;
}

export interface ScheduleUpdateRequest extends ScheduleCreateRequest {
  status: 'active' | 'inactive';
}

export const fetchAllSchedules = async (): Promise<Schedule[]> => {
  const response = await fetch(`${BASE_URL}/schedules/getAllSchedules`);
  if (!response.ok) throw new Error('Failed to fetch schedules');
  const data: ScheduleFromAPI[] = await response.json();
  return data.map(schedule => ({
    ...schedule,
    status: schedule.status as 'active' | 'inactive',
  }));
};

export const fetchAllBuses = async (): Promise<Bus[]> => {
  const response = await fetch(`${BASE_URL}/bus/getAllBuses`);
  if (!response.ok) throw new Error('Failed to fetch buses');
  return response.json();
};

export const fetchAllRoutes = async (): Promise<Route[]> => {
  const response = await fetch(`${BASE_URL}/routes/getAllRoutes`);
  if (!response.ok) throw new Error('Failed to fetch routes');
  return response.json();
};

export const createSchedule = async (schedule: ScheduleCreateRequest): Promise<void> => {
  const response = await fetch(`${BASE_URL}/schedules/addSchedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(schedule),
  });
  if (!response.ok) throw new Error(await response.text() || 'Failed to create schedule');
};

export const updateSchedule = async (id: number, schedule: ScheduleUpdateRequest): Promise<void> => {
  const response = await fetch(`${BASE_URL}/schedules/updateSchedule/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(schedule),
  });
  if (!response.ok) throw new Error(await response.text() || 'Failed to update schedule');
};
