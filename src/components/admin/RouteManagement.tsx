import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
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

const RouteManagement = () => {
  // Sample data for routes
  const [routes, setRoutes] = useState([
    {
      id: "R001",
      origin: "New York, NY",
      destination: "Boston, MA",
      distance: 215,
      duration: 240,
      fare: 45.0,
      isActive: true,
    },
    {
      id: "R002",
      origin: "Los Angeles, CA",
      destination: "San Francisco, CA",
      distance: 380,
      duration: 360,
      fare: 65.0,
      isActive: true,
    },
    {
      id: "R003",
      origin: "Chicago, IL",
      destination: "Detroit, MI",
      distance: 280,
      duration: 300,
      fare: 55.0,
      isActive: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<any>(null);
  const [newRoute, setNewRoute] = useState({
    origin: "",
    destination: "",
    distance: 0,
    duration: 0,
    fare: 0,
    isActive: true,
  });

  // Filter routes based on search term
  const filteredRoutes = routes.filter(
    (route) =>
      route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddRoute = () => {
    const id = `R${String(routes.length + 1).padStart(3, "0")}`;
    setRoutes([...routes, { ...newRoute, id }]);
    setNewRoute({
      origin: "",
      destination: "",
      distance: 0,
      duration: 0,
      fare: 0,
      isActive: true,
    });
    setIsAddDialogOpen(false);
  };

  const handleEditRoute = () => {
    if (!currentRoute) return;
    setRoutes(
      routes.map((route) =>
        route.id === currentRoute.id ? currentRoute : route,
      ),
    );
    setIsEditDialogOpen(false);
  };

  const handleDeleteRoute = (id: string) => {
    setRoutes(routes.filter((route) => route.id !== id));
  };

  const openEditDialog = (route: any) => {
    setCurrentRoute({ ...route });
    setIsEditDialogOpen(true);
  };

  // Format duration in minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Route Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddRoute}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search routes by origin or destination"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Route Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Fare</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoutes.length > 0 ? (
              filteredRoutes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>{route.id}</TableCell>
                  <TableCell className="font-medium">{route.origin}</TableCell>
                  <TableCell>{route.destination}</TableCell>
                  <TableCell>{route.distance} miles</TableCell>
                  <TableCell>{formatDuration(route.duration)}</TableCell>
                  <TableCell>${route.fare.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${route.isActive ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20" : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"}`}
                    >
                      {route.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(route)}
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
                              Are you sure you want to delete this route?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the route and remove it from
                              our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteRoute(route.id)}
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
                  No routes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      {currentRoute && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditRoute}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RouteManagement;
