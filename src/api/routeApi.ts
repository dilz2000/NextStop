const BASE_URL = 'http://localhost:8080';

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
