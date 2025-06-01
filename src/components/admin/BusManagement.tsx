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

const BusManagement = () => {
  // Sample data for buses
  const [buses, setBuses] = useState([
    {
      id: "B001",
      name: "Express Deluxe",
      registrationNumber: "NY-5432",
      capacity: 45,
      amenities: ["WiFi", "AC", "USB Ports", "Restroom"],
      isActive: true,
    },
    {
      id: "B002",
      name: "City Hopper",
      registrationNumber: "CA-7890",
      capacity: 35,
      amenities: ["WiFi", "AC"],
      isActive: true,
    },
    {
      id: "B003",
      name: "Night Rider",
      registrationNumber: "TX-1234",
      capacity: 40,
      amenities: ["WiFi", "AC", "Reclining Seats", "Restroom"],
      isActive: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentBus, setCurrentBus] = useState<any>(null);
  const [newBus, setNewBus] = useState({
    name: "",
    registrationNumber: "",
    capacity: 0,
    amenities: [] as string[],
    isActive: true,
  });

  // Filter buses based on search term
  const filteredBuses = buses.filter(
    (bus) =>
      bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddBus = () => {
    const id = `B${String(buses.length + 1).padStart(3, "0")}`;
    setBuses([...buses, { ...newBus, id }]);
    setNewBus({
      name: "",
      registrationNumber: "",
      capacity: 0,
      amenities: [],
      isActive: true,
    });
    setIsAddDialogOpen(false);
  };

  const handleEditBus = () => {
    if (!currentBus) return;
    setBuses(buses.map((bus) => (bus.id === currentBus.id ? currentBus : bus)));
    setIsEditDialogOpen(false);
  };

  const handleDeleteBus = (id: string) => {
    setBuses(buses.filter((bus) => bus.id !== id));
  };

  const openEditDialog = (bus: any) => {
    setCurrentBus({ ...bus });
    setIsEditDialogOpen(true);
  };

  const handleAmenityChange = (
    checked: boolean | string,
    amenity: string,
    isEdit: boolean,
  ) => {
    if (isEdit && currentBus) {
      if (checked) {
        setCurrentBus({
          ...currentBus,
          amenities: [...currentBus.amenities, amenity],
        });
      } else {
        setCurrentBus({
          ...currentBus,
          amenities: currentBus.amenities.filter((a: string) => a !== amenity),
        });
      }
    } else {
      if (checked) {
        setNewBus({ ...newBus, amenities: [...newBus.amenities, amenity] });
      } else {
        setNewBus({
          ...newBus,
          amenities: newBus.amenities.filter((a) => a !== amenity),
        });
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bus Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Bus
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bus</DialogTitle>
              <DialogDescription>
                Enter the details for the new bus.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newBus.name}
                  onChange={(e) =>
                    setNewBus({ ...newBus, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="regNumber" className="text-right">
                  Registration
                </Label>
                <Input
                  id="regNumber"
                  value={newBus.registrationNumber}
                  onChange={(e) =>
                    setNewBus({ ...newBus, registrationNumber: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">
                  Capacity
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newBus.capacity}
                  onChange={(e) =>
                    setNewBus({
                      ...newBus,
                      capacity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Amenities</Label>
                <div className="col-span-3 space-y-2">
                  {[
                    "WiFi",
                    "AC",
                    "USB Ports",
                    "Restroom",
                    "Reclining Seats",
                  ].map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity}`}
                        checked={newBus.amenities.includes(amenity)}
                        onCheckedChange={(checked) =>
                          handleAmenityChange(checked, amenity, false)
                        }
                      />
                      <label
                        htmlFor={`amenity-${amenity}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Active
                </Label>
                <div className="col-span-3">
                  <Checkbox
                    id="isActive"
                    checked={newBus.isActive}
                    onCheckedChange={(checked) =>
                      setNewBus({ ...newBus, isActive: !!checked })
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
              <Button onClick={handleAddBus}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search buses by name or registration number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Bus Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Registration</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Amenities</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBuses.length > 0 ? (
              filteredBuses.map((bus) => (
                <TableRow key={bus.id}>
                  <TableCell>{bus.id}</TableCell>
                  <TableCell className="font-medium">{bus.name}</TableCell>
                  <TableCell>{bus.registrationNumber}</TableCell>
                  <TableCell>{bus.capacity}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {bus.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${bus.isActive ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20" : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"}`}
                    >
                      {bus.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(bus)}
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
                              Are you sure you want to delete this bus?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the bus and remove it from our
                              servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteBus(bus.id)}
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
                <TableCell colSpan={7} className="text-center py-4">
                  No buses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      {currentBus && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Bus</DialogTitle>
              <DialogDescription>
                Update the details for this bus.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={currentBus.name}
                  onChange={(e) =>
                    setCurrentBus({ ...currentBus, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-regNumber" className="text-right">
                  Registration
                </Label>
                <Input
                  id="edit-regNumber"
                  value={currentBus.registrationNumber}
                  onChange={(e) =>
                    setCurrentBus({
                      ...currentBus,
                      registrationNumber: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-capacity" className="text-right">
                  Capacity
                </Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  value={currentBus.capacity}
                  onChange={(e) =>
                    setCurrentBus({
                      ...currentBus,
                      capacity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Amenities</Label>
                <div className="col-span-3 space-y-2">
                  {[
                    "WiFi",
                    "AC",
                    "USB Ports",
                    "Restroom",
                    "Reclining Seats",
                  ].map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-amenity-${amenity}`}
                        checked={currentBus.amenities.includes(amenity)}
                        onCheckedChange={(checked) =>
                          handleAmenityChange(checked, amenity, true)
                        }
                      />
                      <label
                        htmlFor={`edit-amenity-${amenity}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-isActive" className="text-right">
                  Active
                </Label>
                <div className="col-span-3">
                  <Checkbox
                    id="edit-isActive"
                    checked={currentBus.isActive}
                    onCheckedChange={(checked) =>
                      setCurrentBus({ ...currentBus, isActive: !!checked })
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
              <Button onClick={handleEditBus}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BusManagement;
