
const BASE_URL = 'http://localhost:8765/bus-service';
// const BASE_URL = 'http://localhost:8080';

// GET ALL BUSES
export interface BusFromAPI {
  id: number;
  busNumber: string;
  type: string;
  totalSeats: number;
  operatorName: string;
  status: string;
}

export interface Bus {
  id: string;
  busNumber: string;
  type: string;
  totalSeats: number;
  operatorName: string;
  status: 'active' | 'inactive';
  amenities?: string[];
}

export const fetchAllBuses = async (): Promise<Bus[]> => {
  try {
    const response = await fetch(`${BASE_URL}/bus/getAllBuses`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: BusFromAPI[] = await response.json();
    
    // Transform API data to match UI interface
    return data.map(bus => ({
      id: bus.id.toString(),
      busNumber: bus.busNumber,
      type: bus.type,
      totalSeats: bus.totalSeats,
      operatorName: bus.operatorName,
      status: bus.status as 'active' | 'inactive',
      amenities: bus.type === 'AC' ? ['AC'] : ['Non-AC'] 
    }));
  } catch (error) {
    console.error('Error fetching buses:', error);
    throw error;
  }
};



// UPDATE BUS DETAILS
export interface BusUpdateRequest {
  busNumber: string;
  type: 'AC' | 'Non-AC';
  totalSeats: number;
  operatorName: string;
  status: 'active' | 'inactive';
}

export const updateBus = async (id: number, busData: BusUpdateRequest): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/bus/updateBus/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(busData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update bus: ${errorText || response.statusText}`);
    }
  } catch (error) {
    console.error('Error updating bus:', error);
    throw error;
  }
};


// CREATE A BUS
export interface BusCreateRequest {
  busNumber: string;
  type: 'AC' | 'Non-AC';
  totalSeats: number;
  operatorName: string;
  status: 'active' | 'inactive';
}

export const createBus = async (busData: BusCreateRequest): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/bus/createBus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(busData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create bus: ${errorText || response.statusText}`);
    }
  } catch (error) {
    console.error('Error creating bus:', error);
    throw error;
  }
};


export const updateBusWithSchedules = async (id: number, busData: BusUpdateRequest): Promise<void> => {
  try {
    // First update the bus
    await updateBus(id, busData);
    
    // If bus status is set to inactive, update related schedules
    if (busData.status === 'inactive') {
      await updateSchedulesForInactiveBus(id);
    }
  } catch (error) {
    console.error('Error updating bus with schedules:', error);
    throw error;
  }
};

const updateSchedulesForInactiveBus = async (busId: number): Promise<void> => {
  try {
    // Fetch all schedules
    const response = await fetch(`${BASE_URL}/schedules/getAllSchedules`);
    if (!response.ok) throw new Error('Failed to fetch schedules');
    
    const schedules = await response.json();
    
    // Find schedules with the specific bus ID that are currently active
    const schedulesToUpdate = schedules.filter((schedule: any) => 
      schedule.bus.id === busId && schedule.status === 'active'
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
    console.error('Error updating schedules for inactive bus:', error);
    throw error;
  }
};


