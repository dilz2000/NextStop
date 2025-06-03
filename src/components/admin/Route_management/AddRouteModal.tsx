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

interface Route {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  fare: number;
  isActive: boolean;
}

interface NewRoute {
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  fare: number;
  isActive: boolean;
}

interface AddRouteModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newRoute: NewRoute;
  setNewRoute: React.Dispatch<React.SetStateAction<NewRoute>>;
  onAddRoute: () => void;
}

const AddRouteModal: React.FC<AddRouteModalProps> = ({
  isOpen,
  onOpenChange,
  newRoute,
  setNewRoute,
  onAddRoute,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Route
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Route</DialogTitle>
          <DialogDescription>
            Enter the details for the new route.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="origin" className="text-right">
              Origin
            </Label>
            <Input
              id="origin"
              value={newRoute.origin}
              onChange={(e) =>
                setNewRoute({ ...newRoute, origin: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="destination" className="text-right">
              Destination
            </Label>
            <Input
              id="destination"
              value={newRoute.destination}
              onChange={(e) =>
                setNewRoute({ ...newRoute, destination: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="distance" className="text-right">
              Distance (miles)
            </Label>
            <Input
              id="distance"
              type="number"
              value={newRoute.distance}
              onChange={(e) =>
                setNewRoute({
                  ...newRoute,
                  distance: parseInt(e.target.value) || 0,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration (minutes)
            </Label>
            <Input
              id="duration"
              type="number"
              value={newRoute.duration}
              onChange={(e) =>
                setNewRoute({
                  ...newRoute,
                  duration: parseInt(e.target.value) || 0,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fare" className="text-right">
              Fare ($)
            </Label>
            <Input
              id="fare"
              type="number"
              value={newRoute.fare}
              onChange={(e) =>
                setNewRoute({
                  ...newRoute,
                  fare: parseFloat(e.target.value) || 0,
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
                checked={newRoute.isActive}
                onCheckedChange={(checked) =>
                  setNewRoute({ ...newRoute, isActive: !!checked })
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
          <Button onClick={onAddRoute}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRouteModal;
