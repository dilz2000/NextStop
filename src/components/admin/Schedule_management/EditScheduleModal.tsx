import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { format } from "date-fns";

interface Route {
  id: string;
  name: string;
}

interface Bus {
  id: string;
  name: string;
}

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

interface EditScheduleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentSchedule: Schedule | null;
  setCurrentSchedule: React.Dispatch<React.SetStateAction<Schedule | null>>;
  onEditSchedule: () => void;
  routes: Route[];
  buses: Bus[];
}

const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
  isOpen,
  onOpenChange,
  currentSchedule,
  setCurrentSchedule,
  onEditSchedule,
  routes,
  buses,
}) => {
  if (!currentSchedule) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={onEditSchedule}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditScheduleModal;
