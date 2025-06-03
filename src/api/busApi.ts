const BASE_URL = 'http://localhost:8765/bus-service';


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
