import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Calendar } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

const ScheduleManagement = () => {
  // Sample data for schedules
  const [schedules, setSchedules] = useState([
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
  const routes = [
    { id: "R001", name: "New York to Boston" },
    { id: "R002", name: "Los Angeles to San Francisco" },
    { id: "R003", name: "Chicago to Detroit" },
  ];

  const buses = [
    { id: "B001", name: "Express Deluxe" },
    { id: "B002", name: "City Hopper" },
    { id: "B003", name: "Night Rider" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<any>(null);
  const [newSchedule, setNewSchedule] = useState({
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

  const openEditDialog = (schedule: any) => {
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Schedule</DialogTitle>
              <DialogDescription>
                Enter the details for the new schedule.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="route" className="text-right">
                  Route
                </Label>
                <div className="col-span-3">
                  <Select
                    onValueChange={(value) =>
                      setNewSchedule({ ...newSchedule, routeId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a route" />
                    </SelectTrigger>
                    <SelectContent>
                      {routes.map((route) => (
                        <SelectItem key={route.id} value={route.id}>
                          {route.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bus" className="text-right">
                  Bus
                </Label>
                <div className="col-span-3">
                  <Select
                    onValueChange={(value) =>
                      setNewSchedule({ ...newSchedule, busId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a bus" />
                    </SelectTrigger>
                    <SelectContent>
                      {buses.map((bus) => (
                        <SelectItem key={bus.id} value={bus.id}>
                          {bus.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="departureTime" className="text-right">
                  Departure Time
                </Label>
                <Input
                  id="departureTime"
                  type="datetime-local"
                  onChange={(e) =>
                    setNewSchedule({
                      ...newSchedule,
                      departureTime: new Date(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="arrivalTime" className="text-right">
                  Arrival Time
                </Label>
                <Input
                  id="arrivalTime"
                  type="datetime-local"
                  onChange={(e) =>
                    setNewSchedule({
                      ...newSchedule,
                      arrivalTime: new Date(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="availableSeats" className="text-right">
                  Available Seats
                </Label>
                <Input
                  id="availableSeats"
                  type="number"
                  value={newSchedule.availableSeats}
                  onChange={(e) =>
                    setNewSchedule({
                      ...newSchedule,
                      availableSeats: parseInt(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Active
                </Label>
                <div className="col-span-3">
                  <Checkbox
                    id="isActive"
                    checked={newSchedule.isActive}
                    onCheckedChange={(checked) =>
                      setNewSchedule({ ...newSchedule, isActive: !!checked })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddSchedule}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
      {currentSchedule && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Schedule</DialogTitle>
              <DialogDescription>
                Update the details for this schedule.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-route" className="text-right">
                  Route
                </Label>
                <div className="col-span-3">
                  <Select
                    defaultValue={currentSchedule.routeId}
                    onValueChange={(value) =>
                      setCurrentSchedule({ ...currentSchedule, routeId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a route" />
                    </SelectTrigger>
                    <SelectContent>
                      {routes.map((route) => (
                        <SelectItem key={route.id} value={route.id}>
                          {route.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-bus" className="text-right">
                  Bus
                </Label>
                <div className="col-span-3">
                  <Select
                    defaultValue={currentSchedule.busId}
                    onValueChange={(value) =>
                      setCurrentSchedule({ ...currentSchedule, busId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a bus" />
                    </SelectTrigger>
                    <SelectContent>
                      {buses.map((bus) => (
                        <SelectItem key={bus.id} value={bus.id}>
                          {bus.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-departureTime" className="text-right">
                  Departure Time
                </Label>
                <Input
                  id="edit-departureTime"
                  type="datetime-local"
                  defaultValue={format(
                    currentSchedule.departureTime,
                    "yyyy-MM-dd'T'HH:mm",
                  )}
                  onChange={(e) =>
                    setCurrentSchedule({
                      ...currentSchedule,
                      departureTime: new Date(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-arrivalTime" className="text-right">
                  Arrival Time
                </Label>
                <Input
                  id="edit-arrivalTime"
                  type="datetime-local"
                  defaultValue={format(
                    currentSchedule.arrivalTime,
                    "yyyy-MM-dd'T'HH:mm",
                  )}
                  onChange={(e) =>
                    setCurrentSchedule({
                      ...currentSchedule,
                      arrivalTime: new Date(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-availableSeats" className="text-right">
                  Available Seats
                </Label>
                <Input
                  id="edit-availableSeats"
                  type="number"
                  value={currentSchedule.availableSeats}
                  onChange={(e) =>
                    setCurrentSchedule({
                      ...currentSchedule,
                      availableSeats: parseInt(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-isActive" className="text-right">
                  Active
                </Label>
                <div className="col-span-3">
                  <Checkbox
                    id="edit-isActive"
                    checked={currentSchedule.isActive}
                    onCheckedChange={(checked) =>
                      setCurrentSchedule({
                        ...currentSchedule,
                        isActive: !!checked,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditSchedule}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ScheduleManagement;
