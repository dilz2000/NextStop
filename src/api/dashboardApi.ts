const BASE_URL_BUS = 'http://localhost:8080';
const BASE_URL_ROUTE = 'http://localhost:8080';
const BASE_URL_SCHEDULE = 'http://localhost:8080';
const BASE_URL_USER = 'http://localhost:8095/api';

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

export interface DashboardStats {
  totalBuses: number;
  activeRoutes: number;
  totalSchedules: number;
  totalUsers: number;
  activeUsers: number;
  verifiedUsers: number;
  adminUsers: number;
  popularRoute: string | null;
}

// Fetch dashboard data from multiple APIs
export const fetchDashboardData = async (): Promise<DashboardStats> => {
  try {
    const [buses, routes, schedules, users] = await Promise.all([
      fetch(`${BASE_URL_BUS}/bus/getAllBuses`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch buses');
        return res.json();
      }),
      fetch(`${BASE_URL_ROUTE}/routes/getAllRoutes`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch routes');
        return res.json();
      }),
      fetch(`${BASE_URL_SCHEDULE}/schedules/getAllSchedules`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch schedules');
        return res.json();
      }),
      fetch(`${BASE_URL_USER}/admin/users`, {
        headers: createAuthHeaders(),
      }).then(res => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      }),
    ]);

    // Calculate popular route
    const routeCount: Record<string, number> = {};
    schedules.forEach((s: any) => {
      const key = `${s.route.sourceCity} → ${s.route.destinationCity}`;
      routeCount[key] = (routeCount[key] || 0) + 1;
    });
    const sortedRoutes = Object.entries(routeCount).sort((a, b) => b[1] - a[1]);
    const popularRoute = sortedRoutes.length > 0 ? `${sortedRoutes[0][0]} (${sortedRoutes[0][1]} trips)` : null;

    return {
      totalBuses: buses.length,
      activeRoutes: routes.filter((r: any) => r.status === 'active').length,
      totalSchedules: schedules.length,
      totalUsers: users.length,
      activeUsers: users.filter((u: any) => u.active).length,
      verifiedUsers: users.filter((u: any) => u.emailVerified).length,
      adminUsers: users.filter((u: any) => u.roles.includes('ROLE_ADMIN')).length,
      popularRoute,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const isAdminAuthenticated = (): boolean => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return false;
    
    const user = JSON.parse(userData);
    return user.role === 'ROLE_ADMIN' && !!getAuthToken();
  } catch {
    return false;
  }
};
