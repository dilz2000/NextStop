
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import AddScheduleModal from "./AddScheduleModal";
import EditScheduleModal from "./EditScheduleModal";

interface Schedule {
  id: string;
  routeId: string;
  busId: string;
  departureTime: Date;
  arrivalTime: Date;
  availableSeats: number;
  isActive: boolean;
  routeName: string;
  busName: string;
}

interface NewSchedule {
  routeId: string;
  busId: string;
  departureTime: Date;
  arrivalTime: Date;
  availableSeats: number;
  isActive: boolean;
}

interface Route {
  id: string;
  name: string;
}

interface Bus {
  id: string;
  name: string;
}

const ScheduleManagement = () => {
  // Sample data for schedules
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: "S001",
      routeId: "R001",
      busId: "B001",
      departureTime: new Date("2023-10-15T10:30:00"),
      arrivalTime: new Date("2023-10-15T14:30:00"),
      availableSeats: 32,
      isActive: true,
      routeName: "New York to Boston",
      busName: "Express Deluxe",
    },
    {
      id: "S002",
      routeId: "R002",
      busId: "B002",
      departureTime: new Date("2023-10-16T12:00:00"),
      arrivalTime: new Date("2023-10-16T18:00:00"),
      availableSeats: 28,
      isActive: true,
      routeName: "Los Angeles to San Francisco",
      busName: "City Hopper",
    },
    {
      id: "S003",
      routeId: "R003",
      busId: "B003",
      departureTime: new Date("2023-10-17T08:00:00"),
      arrivalTime: new Date("2023-10-17T13:00:00"),
      availableSeats: 15,
      isActive: false,
      routeName: "Chicago to Detroit",
      busName: "Night Rider",
    },
  ]);

  // Sample data for routes and buses (for dropdowns)
  const routes: Route[] = [
    { id: "R001", name: "New York to Boston" },
    { id: "R002", name: "Los Angeles to San Francisco" },
    { id: "R003", name: "Chicago to Detroit" },
  ];

  const buses: Bus[] = [
    { id: "B001", name: "Express Deluxe" },
    { id: "B002", name: "City Hopper" },
    { id: "B003", name: "Night Rider" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null);
  const [newSchedule, setNewSchedule] = useState<NewSchedule>({
    routeId: "",
    busId: "",
    departureTime: new Date(),
    arrivalTime: new Date(),
    availableSeats: 0,
    isActive: true,
  });

  // Filter schedules based on search term
  const filteredSchedules = schedules.filter(
    (schedule) =>
      schedule.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.busName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddSchedule = () => {
    const id = `S${String(schedules.length + 1).padStart(3, "0")}`;
    const selectedRoute = routes.find((r) => r.id === newSchedule.routeId);
    const selectedBus = buses.find((b) => b.id === newSchedule.busId);

    setSchedules([
      ...schedules,
      {
        ...newSchedule,
        id,
        routeName: selectedRoute?.name || "",
        busName: selectedBus?.name || "",
      },
    ]);

    setNewSchedule({
      routeId: "",
      busId: "",
      departureTime: new Date(),
      arrivalTime: new Date(),
      availableSeats: 0,
      isActive: true,
    });
    setIsAddDialogOpen(false);
  };

  const handleEditSchedule = () => {
    if (!currentSchedule) return;

    const selectedRoute = routes.find((r) => r.id === currentSchedule.routeId);
    const selectedBus = buses.find((b) => b.id === currentSchedule.busId);

    setSchedules(
      schedules.map((schedule) =>
        schedule.id === currentSchedule.id
          ? {
              ...currentSchedule,
              routeName: selectedRoute?.name || currentSchedule.routeName,
              busName: selectedBus?.name || currentSchedule.busName,
            }
          : schedule,
      ),
    );
    setIsEditDialogOpen(false);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  const openEditDialog = (schedule: Schedule) => {
    setCurrentSchedule({ ...schedule });
    setIsEditDialogOpen(true);
  };

  // Format date and time
  const formatDateTime = (date: Date) => {
    return format(date, "MMM d, yyyy h:mm a");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedule Management</h1>
        <AddScheduleModal
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          newSchedule={newSchedule}
          setNewSchedule={setNewSchedule}
          onAddSchedule={handleAddSchedule}
          routes={routes}
          buses={buses}
        />
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search schedules by route or bus"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Schedule Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Bus</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Available Seats</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules.length > 0 ? (
              filteredSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.id}</TableCell>
                  <TableCell className="font-medium">
                    {schedule.routeName}
                  </TableCell>
                  <TableCell>{schedule.busName}</TableCell>
                  <TableCell>
                    {formatDateTime(schedule.departureTime)}
                  </TableCell>
                  <TableCell>{formatDateTime(schedule.arrivalTime)}</TableCell>
                  <TableCell>{schedule.availableSeats}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${schedule.isActive ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20" : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"}`}
                    >
                      {schedule.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(schedule)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to delete this schedule?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the schedule and remove it from
                              our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No schedules found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <EditScheduleModal
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentSchedule={currentSchedule}
        setCurrentSchedule={setCurrentSchedule}
        onEditSchedule={handleEditSchedule}
        routes={routes}
        buses={buses}
      />
    </div>
  );
};

export default ScheduleManagement;
