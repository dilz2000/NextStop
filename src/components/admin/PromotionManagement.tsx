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

interface PromotionItem {
  id: string;
  title: string;
  description: string;
  image: string;
  action: string;
}

const PromotionManagement = () => {
  // Sample data for promotions
  const [promotions, setPromotions] = useState<PromotionItem[]>([
    {
      id: "1",
      title: "Weekend Getaway",
      description: "25% off on all weekend trips booked 7 days in advance",
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
      action: "View Offer",
    },
    {
      id: "2",
      title: "Student Discount",
      description: "Special 15% discount for students with valid ID",
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
      action: "View Offer",
    },
    {
      id: "3",
      title: "Group Travel",
      description: "Book for 4+ people and get 10% off each ticket",
      image:
        "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80",
      action: "View Offer",
    },
    {
      id: "4",
      title: "Early Bird Special",
      description: "Book 30 days in advance and save 20% on your ticket",
      image:
        "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800&q=80",
      action: "View Offer",
    },
    {
      id: "5",
      title: "Senior Citizen Discount",
      description: "10% off for travelers aged 65 and above",
      image:
        "https://milwaukeehomecare.com/wp-content/uploads/2022/04/5-Fun-Activities-to-Enjoy-this-National-Senior-Citizens-Day-1.png",
      action: "View Offer",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] =
    useState<PromotionItem | null>(null);
  const [newPromotion, setNewPromotion] = useState<PromotionItem>({
    id: "",
    title: "",
    description: "",
    image: "",
    action: "View Offer",
  });

  // Filter promotions based on search term
  const filteredPromotions = promotions.filter(
    (promo) =>
      promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddPromotion = () => {
    const id = `${promotions.length + 1}`;
    setPromotions([...promotions, { ...newPromotion, id }]);
    setNewPromotion({
      id: "",
      title: "",
      description: "",
      image: "",
      action: "View Offer",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditPromotion = () => {
    if (!currentPromotion) return;
    setPromotions(
      promotions.map((promo) =>
        promo.id === currentPromotion.id ? currentPromotion : promo,
      ),
    );
    setIsEditDialogOpen(false);
  };

  const handleDeletePromotion = (id: string) => {
    setPromotions(promotions.filter((promo) => promo.id !== id));
  };

  const openEditDialog = (promotion: PromotionItem) => {
    setCurrentPromotion({ ...promotion });
    setIsEditDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Special Offers Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Offer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Special Offer</DialogTitle>
              <DialogDescription>
                Enter the details for the new special offer to display on the
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
                  value={newPromotion.title}
                  onChange={(e) =>
                    setNewPromotion({ ...newPromotion, title: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="e.g. Weekend Getaway"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newPromotion.description}
                  onChange={(e) =>
                    setNewPromotion({
                      ...newPromotion,
                      description: e.target.value,
                    })
                  }
                  className="col-span-3"
                  placeholder="e.g. 25% off on all weekend trips booked 7 days in advance"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="image"
                  value={newPromotion.image}
                  onChange={(e) =>
                    setNewPromotion({ ...newPromotion, image: e.target.value })
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
                  value={newPromotion.action}
                  onChange={(e) =>
                    setNewPromotion({ ...newPromotion, action: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="e.g. View Offer"
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
              <Button onClick={handleAddPromotion}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search offers by title or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Promotions Table */}
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
            {filteredPromotions.length > 0 ? (
              filteredPromotions.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell>{promo.id}</TableCell>
                  <TableCell>
                    <div className="h-12 w-20 relative rounded overflow-hidden">
                      <img
                        src={promo.image}
                        alt={promo.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{promo.title}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {promo.description}
                  </TableCell>
                  <TableCell>{promo.action}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(promo)}
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
                              Are you sure you want to delete this offer?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the special offer from the
                              promotions section.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePromotion(promo.id)}
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
                  No special offers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      {currentPromotion && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Special Offer</DialogTitle>
              <DialogDescription>
                Update the details for this special offer.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={currentPromotion.title}
                  onChange={(e) =>
                    setCurrentPromotion({
                      ...currentPromotion,
                      title: e.target.value,
                    })
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
                  value={currentPromotion.description}
                  onChange={(e) =>
                    setCurrentPromotion({
                      ...currentPromotion,
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
                    value={currentPromotion.image}
                    onChange={(e) =>
                      setCurrentPromotion({
                        ...currentPromotion,
                        image: e.target.value,
                      })
                    }
                  />
                  {currentPromotion.image && (
                    <div className="h-24 w-40 relative rounded overflow-hidden">
                      <img
                        src={currentPromotion.image}
                        alt={currentPromotion.title}
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
                  value={currentPromotion.action}
                  onChange={(e) =>
                    setCurrentPromotion({
                      ...currentPromotion,
                      action: e.target.value,
                    })
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
              <Button onClick={handleEditPromotion}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PromotionManagement;
