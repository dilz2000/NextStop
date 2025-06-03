import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Route {
  id: string;
  name: string;
}

interface Bus {
  id: string;
  name: string;
}

interface NewSchedule {
  routeId: string;
  busId: string;
  departureTime: Date;
  arrivalTime: Date;
  availableSeats: number;
  isActive: boolean;
}

interface AddScheduleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newSchedule: NewSchedule;
  setNewSchedule: React.Dispatch<React.SetStateAction<NewSchedule>>;
  onAddSchedule: () => void;
  routes: Route[];
  buses: Bus[];
}

const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  isOpen,
  onOpenChange,
  newSchedule,
  setNewSchedule,
  onAddSchedule,
  routes,
  buses,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={onAddSchedule}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddScheduleModal;
