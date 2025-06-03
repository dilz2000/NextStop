
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
import AddRouteModal from "./AddRouteModal";
import EditRouteModal from "./EditRouteModal";

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

const RouteManagement = () => {
  // Sample data for routes
  const [routes, setRoutes] = useState<Route[]>([
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
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [newRoute, setNewRoute] = useState<NewRoute>({
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

  const openEditDialog = (route: Route) => {
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
        <AddRouteModal
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          newRoute={newRoute}
          setNewRoute={setNewRoute}
          onAddRoute={handleAddRoute}
        />
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
      <EditRouteModal
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
        onEditRoute={handleEditRoute}
      />
    </div>
  );
};

export default RouteManagement;
