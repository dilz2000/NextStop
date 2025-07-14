// src/api/scheduleApi.ts
import axios from "axios";

export interface ScheduleResponse {
  id: number;
  bus: {
    id: number;
    busNumber: string;
    type: string;
    totalSeats: number;
    operatorName: string;
    status: string;
  };
  route: {
    id: number;
    sourceCity: string;
    destinationCity: string;
    distanceKm: number;
    duration: string;
    status: string;
  };
  departureTime: string;
  arrivalTime: string;
  fare: number;
  status: string;
}

export const fetchSchedules = async (
    origin: string,
    destination: string,
    date: string 
  ): Promise<ScheduleResponse[]> => {
    // Adjust date by +1 day 
    const originalDate = new Date(date);
    originalDate.setDate(originalDate.getDate() + 1);
  
    // format (YYYY-MM-DD)
    const adjustedDate = originalDate.toISOString().split("T")[0];
  
    const response = await axios.get("http://localhost:8765/bus-service/schedules/filter", {
      params: {
        sourceCity: origin,
        destinationCity: destination,
        travelDate: adjustedDate,
      },
    });
  
    console.log("responseeeee ==", response.data);
    console.log("origin", origin);
    console.log("destination", destination);
    console.log("adjusted date", adjustedDate);
  
    return response.data;
  };
  
