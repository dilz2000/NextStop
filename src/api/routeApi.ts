
const BASE_URL = 'http://localhost:8765/bus-service';
// const BASE_URL = 'http://localhost:8080';

export interface RouteFromAPI {
  id: number;
  sourceCity: string;
  destinationCity: string;
  distanceKm: number;
  duration: string; // "HH:MM:SS"
  status: string;
}

export interface Route {
  id: number;
  sourceCity: string;
  destinationCity: string;
  distanceKm: number;
  duration: string;
  status: 'active' | 'inactive';
}

export interface RouteCreateRequest {
  sourceCity: string;
  destinationCity: string;
  distanceKm: number;
  duration: string;
}

export interface RouteUpdateRequest extends RouteCreateRequest {
  status: 'active' | 'inactive';
}

// GET ALL ROUTES
export const fetchAllRoutes = async (): Promise<Route[]> => {
  const response = await fetch(`${BASE_URL}/routes/getAllRoutes`);
  if (!response.ok) throw new Error('Failed to fetch routes');
  const data: RouteFromAPI[] = await response.json();
  return data.map(route => ({
    ...route,
    status: route.status as 'active' | 'inactive',
  }));
};

// CREATE A NEW ROUTE
export const createRoute = async (route: RouteCreateRequest): Promise<void> => {
  const response = await fetch(`${BASE_URL}/routes/createRoute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(route),
  });
  if (!response.ok) throw new Error(await response.text() || 'Failed to create route');
};

// UPDATE A ROUTE
export const updateRoute = async (id: number, route: RouteUpdateRequest): Promise<void> => {
  const response = await fetch(`${BASE_URL}/routes/updateRoute/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(route),
  });
  if (!response.ok) throw new Error(await response.text() || 'Failed to update route');
};

export const updateRouteWithSchedules = async (id: number, routeData: RouteUpdateRequest): Promise<void> => {
  try {
    // First update the route
    await updateRoute(id, routeData);
    
    // If route status is set to inactive, update related schedules
    if (routeData.status === 'inactive') {
      await updateSchedulesForInactiveRoute(id);
    }
  } catch (error) {
    console.error('Error updating route with schedules:', error);
    throw error;
  }
};

const updateSchedulesForInactiveRoute = async (routeId: number): Promise<void> => {
  try {
    // Fetch all schedules
    const response = await fetch(`${BASE_URL}/schedules/getAllSchedules`);
    if (!response.ok) throw new Error('Failed to fetch schedules');
    
    const schedules = await response.json();
    
    // Find schedules with the specific route ID that are currently active
    const schedulesToUpdate = schedules.filter((schedule: any) => 
      schedule.route.id === routeId && schedule.status === 'active'
    );
    
    // Update each schedule to inactive
    const updatePromises = schedulesToUpdate.map((schedule: any) => 
      fetch(`${BASE_URL}/schedules/updateSchedule/${schedule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bus: { id: schedule.bus.id },
          route: { id: schedule.route.id },
          departureTime: schedule.departureTime,
          arrivalTime: schedule.arrivalTime,
          fare: schedule.fare,
          status: 'inactive'
        })
      })
    );
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error updating schedules for inactive route:', error);
    throw error;
  }
};
