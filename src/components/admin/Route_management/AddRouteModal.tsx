// import React from "react";
// import { Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";

// interface Route {
//   id: string;
//   origin: string;
//   destination: string;
//   distance: number;
//   duration: number;
//   fare: number;
//   isActive: boolean;
// }

// interface NewRoute {
//   origin: string;
//   destination: string;
//   distance: number;
//   duration: number;
//   fare: number;
//   isActive: boolean;
// }

// interface AddRouteModalProps {
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
//   newRoute: NewRoute;
//   setNewRoute: React.Dispatch<React.SetStateAction<NewRoute>>;
//   onAddRoute: () => void;
// }

// const AddRouteModal: React.FC<AddRouteModalProps> = ({
//   isOpen,
//   onOpenChange,
//   newRoute,
//   setNewRoute,
//   onAddRoute,
// }) => {
//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogTrigger asChild>
//         <Button>
//           <Plus className="mr-2 h-4 w-4" /> Add New Route
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Add New Route</DialogTitle>
//           <DialogDescription>
//             Enter the details for the new route.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="origin" className="text-right">
//               Origin
//             </Label>
//             <Input
//               id="origin"
//               value={newRoute.origin}
//               onChange={(e) =>
//                 setNewRoute({ ...newRoute, origin: e.target.value })
//               }
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="destination" className="text-right">
//               Destination
//             </Label>
//             <Input
//               id="destination"
//               value={newRoute.destination}
//               onChange={(e) =>
//                 setNewRoute({ ...newRoute, destination: e.target.value })
//               }
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="distance" className="text-right">
//               Distance (miles)
//             </Label>
//             <Input
//               id="distance"
//               type="number"
//               value={newRoute.distance}
//               onChange={(e) =>
//                 setNewRoute({
//                   ...newRoute,
//                   distance: parseInt(e.target.value) || 0,
//                 })
//               }
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="duration" className="text-right">
//               Duration (minutes)
//             </Label>
//             <Input
//               id="duration"
//               type="number"
//               value={newRoute.duration}
//               onChange={(e) =>
//                 setNewRoute({
//                   ...newRoute,
//                   duration: parseInt(e.target.value) || 0,
//                 })
//               }
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="fare" className="text-right">
//               Fare ($)
//             </Label>
//             <Input
//               id="fare"
//               type="number"
//               value={newRoute.fare}
//               onChange={(e) =>
//                 setNewRoute({
//                   ...newRoute,
//                   fare: parseFloat(e.target.value) || 0,
//                 })
//               }
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="isActive" className="text-right">
//               Active
//             </Label>
//             <div className="col-span-3">
//               <Checkbox
//                 id="isActive"
//                 checked={newRoute.isActive}
//                 onCheckedChange={(checked) =>
//                   setNewRoute({ ...newRoute, isActive: !!checked })
//                 }
//               />
//             </div>
//           </div>
//         </div>
//         <DialogFooter>
//           <Button
//             variant="outline"
//             onClick={() => onOpenChange(false)}
//           >
//             Cancel
//           </Button>
//           <Button onClick={onAddRoute}>Save</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AddRouteModal;



////////////////

import React, { useState } from "react";
import { Plus, Loader2, CheckCircle, AlertCircle, MapPin, ArrowRight, Timer, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createRoute, RouteCreateRequest } from "../../../api/routeApi";

interface AddRouteModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRoute: () => void;
}

interface FormData {
  sourceCity: string;
  destinationCity: string;
  distanceKm: string;
  duration: string; // "HH:MM:SS" or "HH:MM"
}

interface FormErrors {
  sourceCity?: string;
  destinationCity?: string;
  distanceKm?: string;
  duration?: string;
}

const AddRouteModal: React.FC<AddRouteModalProps> = ({
  isOpen,
  onOpenChange,
  onAddRoute,
}) => {
  const [formData, setFormData] = useState<FormData>({
    sourceCity: "",
    destinationCity: "",
    distanceKm: "",
    duration: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.sourceCity.trim()) newErrors.sourceCity = "Source city is required";
    if (!formData.destinationCity.trim()) newErrors.destinationCity = "Destination city is required";
    if (!formData.distanceKm.trim()) newErrors.distanceKm = "Distance is required";
    else if (isNaN(Number(formData.distanceKm)) || Number(formData.distanceKm) <= 0)
      newErrors.distanceKm = "Distance must be a positive number";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required";
    else if (!/^([0-9]{2}):([0-5][0-9])(:[0-5][0-9])?$/.test(formData.duration.trim()))
      newErrors.duration = "Duration must be in HH:MM or HH:MM:SS format";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (submitError) setSubmitError(null);
  };

  const resetForm = () => {
    setFormData({ sourceCity: "", destinationCity: "", distanceKm: "", duration: "" });
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const createData: RouteCreateRequest = {
        sourceCity: formData.sourceCity.trim(),
        destinationCity: formData.destinationCity.trim(),
        distanceKm: Number(formData.distanceKm),
        duration: formData.duration.length === 5 ? formData.duration + ":00" : formData.duration,
      };
      await createRoute(createData);
      setSubmitSuccess(true);
      setTimeout(() => {
        onAddRoute();
        resetForm();
        onOpenChange(false);
      }, 1200);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to create route");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onOpenChange(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) resetForm();
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Route
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plus className="h-5 w-5 text-green-600" />
            Add New Route
          </DialogTitle>
          <DialogDescription>
            Enter the details for the new route.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {submitSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Route created successfully!
              </AlertDescription>
            </Alert>
          )}
          {submitError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {submitError}
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="sourceCity" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Source City *
            </Label>
            <Input
              id="sourceCity"
              value={formData.sourceCity}
              onChange={(e) => handleInputChange("sourceCity", e.target.value)}
              className={errors.sourceCity ? "border-red-500" : ""}
              placeholder="Enter source city"
              disabled={loading}
            />
            {errors.sourceCity && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.sourceCity}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="destinationCity" className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Destination City *
            </Label>
            <Input
              id="destinationCity"
              value={formData.destinationCity}
              onChange={(e) => handleInputChange("destinationCity", e.target.value)}
              className={errors.destinationCity ? "border-red-500" : ""}
              placeholder="Enter destination city"
              disabled={loading}
            />
            {errors.destinationCity && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.destinationCity}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="distanceKm" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Distance (km) *
            </Label>
            <Input
              id="distanceKm"
              type="number"
              value={formData.distanceKm}
              onChange={(e) => handleInputChange("distanceKm", e.target.value)}
              className={errors.distanceKm ? "border-red-500" : ""}
              placeholder="Enter distance in km"
              min="1"
              max="2000"
              disabled={loading}
            />
            {errors.distanceKm && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.distanceKm}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Duration (HH:MM or HH:MM:SS) *
            </Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              className={errors.duration ? "border-red-500" : ""}
              placeholder="e.g. 05:30 or 05:30:00"
              disabled={loading}
            />
            {errors.duration && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.duration}
              </p>
            )}
          </div>
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <span className="text-red-500">*</span> Required fields
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || submitSuccess}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : submitSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Created
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Route
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRouteModal;
