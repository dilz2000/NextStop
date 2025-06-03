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

interface Route {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  fare: number;
  isActive: boolean;
}

interface EditRouteModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentRoute: Route | null;
  setCurrentRoute: React.Dispatch<React.SetStateAction<Route | null>>;
  onEditRoute: () => void;
}

const EditRouteModal: React.FC<EditRouteModalProps> = ({
  isOpen,
  onOpenChange,
  currentRoute,
  setCurrentRoute,
  onEditRoute,
}) => {
  if (!currentRoute) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Route</DialogTitle>
          <DialogDescription>
            Update the details for this route.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-origin" className="text-right">
              Origin
            </Label>
            <Input
              id="edit-origin"
              value={currentRoute.origin}
              onChange={(e) =>
                setCurrentRoute({ ...currentRoute, origin: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-destination" className="text-right">
              Destination
            </Label>
            <Input
              id="edit-destination"
              value={currentRoute.destination}
              onChange={(e) =>
                setCurrentRoute({
                  ...currentRoute,
                  destination: e.target.value,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-distance" className="text-right">
              Distance (miles)
            </Label>
            <Input
              id="edit-distance"
              type="number"
              value={currentRoute.distance}
              onChange={(e) =>
                setCurrentRoute({
                  ...currentRoute,
                  distance: parseInt(e.target.value) || 0,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-duration" className="text-right">
              Duration (minutes)
            </Label>
            <Input
              id="edit-duration"
              type="number"
              value={currentRoute.duration}
              onChange={(e) =>
                setCurrentRoute({
                  ...currentRoute,
                  duration: parseInt(e.target.value) || 0,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-fare" className="text-right">
              Fare ($)
            </Label>
            <Input
              id="edit-fare"
              type="number"
              value={currentRoute.fare}
              onChange={(e) =>
                setCurrentRoute({
                  ...currentRoute,
                  fare: parseFloat(e.target.value) || 0,
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
                checked={currentRoute.isActive}
                onCheckedChange={(checked) =>
                  setCurrentRoute({ ...currentRoute, isActive: !!checked })
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
          <Button onClick={onEditRoute}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRouteModal;
