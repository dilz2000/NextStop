import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Search, Image } from "lucide-react";
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

interface RouteItem {
  id: string;
  title: string;
  description: string;
  image: string;
  action: string;
}

const PopularRouteManagement = () => {
  // Sample data for popular routes
  const [routes, setRoutes] = useState<RouteItem[]>([
    {
      id: "1",
      title: "Colombo to Galle",
      description: "Daily departures, 2 hour journey",
      image:
        "https://theportuguesetraveler.com/wp-content/uploads/2024/11/colombo-sri-lanka-drone-view-1.jpg.webp",
      action: "Select Route",
    },
    {
      id: "2",
      title: "Jaffna to Trinco",
      description: "Beach side drive",
      image:
        "https://us.lakpura.com/cdn/shop/files/LKI9500075-01-E_b9676f68-bb02-4827-ad28-9de134e5b198.jpg?v=1653459755&width=3200",
      action: "Select Route",
    },
    {
      id: "3",
      title: "Mathugama to Negombo",
      description: "Overnight options available, 4 hour journey",
      image:
        "https://www.travelmapsrilanka.com/destinations/destinationimages/negombo-lagoon-in-sri-lanka.webp",
      action: "Select Route",
    },
    {
      id: "4",
      title: "Colombo to Kalutara",
      description: "Going down from the capital",
      image:
        "https://www.travelmapsrilanka.com/destinations/destinationimages/kalutara-bodhiya-buddhist-temple.webp",
      action: "Select Route",
    },
    {
      id: "5",
      title: "Kandy to Matara",
      description: "Scenic route with mountain views, 3 hour journey",
      image:
        "https://www.srilankainstyle.com/storage/app/media/uploaded-files/7-reasons-to-visit-kandy-in-sri-lanka-slider-1.jpg",
      action: "Select Route",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RouteItem | null>(null);
  const [newRoute, setNewRoute] = useState<RouteItem>({
    id: "",
    title: "",
    description: "",
    image: "",
    action: "Select Route",
  });

  // Filter routes based on search term
  const filteredRoutes = routes.filter(
    (route) =>
      route.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddRoute = () => {
    const id = `${routes.length + 1}`;
    setRoutes([...routes, { ...newRoute, id }]);
    setNewRoute({
      id: "",
      title: "",
      description: "",
      image: "",
      action: "Select Route",
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

  const openEditDialog = (route: RouteItem) => {
    setCurrentRoute({ ...route });
    setIsEditDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Popular Routes Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Route
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Popular Route</DialogTitle>
              <DialogDescription>
                Enter the details for the new popular route to display on the
                home page.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newRoute.title}
                  onChange={(e) =>
                    setNewRoute({ ...newRoute, title: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="e.g. New York to Boston"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newRoute.description}
                  onChange={(e) =>
                    setNewRoute({ ...newRoute, description: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="e.g. Daily departures, 4.5 hour journey"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="image"
                  value={newRoute.image}
                  onChange={(e) =>
                    setNewRoute({ ...newRoute, image: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="action" className="text-right">
                  Action Text
                </Label>
                <Input
                  id="action"
                  value={newRoute.action}
                  onChange={(e) =>
                    setNewRoute({ ...newRoute, action: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="e.g. Select Route"
                />
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
            placeholder="Search routes by title or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Routes Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Action Text</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoutes.length > 0 ? (
              filteredRoutes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>{route.id}</TableCell>
                  <TableCell>
                    <div className="h-12 w-20 relative rounded overflow-hidden">
                      <img
                        src={route.image}
                        alt={route.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{route.title}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {route.description}
                  </TableCell>
                  <TableCell>{route.action}</TableCell>
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
                              permanently delete the route from the popular
                              routes section.
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
                <TableCell colSpan={6} className="text-center py-4">
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
              <DialogTitle>Edit Popular Route</DialogTitle>
              <DialogDescription>
                Update the details for this popular route.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={currentRoute.title}
                  onChange={(e) =>
                    setCurrentRoute({ ...currentRoute, title: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  value={currentRoute.description}
                  onChange={(e) =>
                    setCurrentRoute({
                      ...currentRoute,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-image" className="text-right">
                  Image URL
                </Label>
                <div className="col-span-3 space-y-2">
                  <Input
                    id="edit-image"
                    value={currentRoute.image}
                    onChange={(e) =>
                      setCurrentRoute({
                        ...currentRoute,
                        image: e.target.value,
                      })
                    }
                  />
                  {currentRoute.image && (
                    <div className="h-24 w-40 relative rounded overflow-hidden">
                      <img
                        src={currentRoute.image}
                        alt={currentRoute.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-action" className="text-right">
                  Action Text
                </Label>
                <Input
                  id="edit-action"
                  value={currentRoute.action}
                  onChange={(e) =>
                    setCurrentRoute({ ...currentRoute, action: e.target.value })
                  }
                  className="col-span-3"
                />
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

export default PopularRouteManagement;
