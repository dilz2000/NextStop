// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
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

// interface EditRouteModalProps {
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
//   currentRoute: Route | null;
//   setCurrentRoute: React.Dispatch<React.SetStateAction<Route | null>>;
//   onEditRoute: () => void;
// }

// const EditRouteModal: React.FC<EditRouteModalProps> = ({
//   isOpen,
//   onOpenChange,
//   currentRoute,
//   setCurrentRoute,
//   onEditRoute,
// }) => {
//   if (!currentRoute) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Edit Route</DialogTitle>
//           <DialogDescription>
//             Update the details for this route.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="edit-origin" className="text-right">
//               Origin
//             </Label>
//             <Input
//               id="edit-origin"
//               value={currentRoute.origin}
//               onChange={(e) =>
//                 setCurrentRoute({ ...currentRoute, origin: e.target.value })
//               }
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="edit-destination" className="text-right">
//               Destination
//             </Label>
//             <Input
//               id="edit-destination"
//               value={currentRoute.destination}
//               onChange={(e) =>
//                 setCurrentRoute({
//                   ...currentRoute,
//                   destination: e.target.value,
//                 })
//               }
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="edit-distance" className="text-right">
//               Distance (miles)
//             </Label>
//             <Input
//               id="edit-distance"
//               type="number"
//               value={currentRoute.distance}
//               onChange={(e) =>
//                 setCurrentRoute({
//                   ...currentRoute,
//                   distance: parseInt(e.target.value) || 0,
//                 })
//               }
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="edit-duration" className="text-right">
//               Duration (minutes)
//             </Label>
//             <Input
//               id="edit-duration"
//               type="number"
//               value={currentRoute.duration}
//               onChange={(e) =>
//                 setCurrentRoute({
//                   ...currentRoute,
//                   duration: parseInt(e.target.value) || 0,
//                 })
//               }
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="edit-fare" className="text-right">
//               Fare ($)
//             </Label>
//             <Input
//               id="edit-fare"
//               type="number"
//               value={currentRoute.fare}
//               onChange={(e) =>
//                 setCurrentRoute({
//                   ...currentRoute,
//                   fare: parseFloat(e.target.value) || 0,
//                 })
//               }
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="edit-isActive" className="text-right">
//               Active
//             </Label>
//             <div className="col-span-3">
//               <Checkbox
//                 id="edit-isActive"
//                 checked={currentRoute.isActive}
//                 onCheckedChange={(checked) =>
//                   setCurrentRoute({ ...currentRoute, isActive: !!checked })
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
//           <Button onClick={onEditRoute}>Save Changes</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default EditRouteModal;


///////////////////

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle, MapPin, ArrowRight, Timer, Ruler, Activity } from "lucide-react";
import { updateRoute, RouteUpdateRequest, Route } from "../../../api/routeApi";

interface EditRouteModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentRoute: Route | null;
  setCurrentRoute: React.Dispatch<React.SetStateAction<Route | null>>;
  onEditRoute: () => void;
}

interface FormData {
  sourceCity: string;
  destinationCity: string;
  distanceKm: string;
  duration: string;
  status: 'active' | 'inactive';
}

interface FormErrors {
  sourceCity?: string;
  destinationCity?: string;
  distanceKm?: string;
  duration?: string;
}

const EditRouteModal: React.FC<EditRouteModalProps> = ({
  isOpen,
  onOpenChange,
  currentRoute,
  setCurrentRoute,
  onEditRoute,
}) => {
  const [formData, setFormData] = useState<FormData>({
    sourceCity: "",
    destinationCity: "",
    distanceKm: "",
    duration: "",
    status: "active",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (currentRoute) {
      setFormData({
        sourceCity: currentRoute.sourceCity,
        destinationCity: currentRoute.destinationCity,
        distanceKm: currentRoute.distanceKm.toString(),
        duration: currentRoute.duration,
        status: currentRoute.status,
      });
      setErrors({});
      setSubmitError(null);
      setSubmitSuccess(false);
    }
  }, [currentRoute]);

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

  const handleSubmit = async () => {
    if (!currentRoute || !validateForm()) return;
    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const updateData: RouteUpdateRequest = {
        sourceCity: formData.sourceCity.trim(),
        destinationCity: formData.destinationCity.trim(),
        distanceKm: Number(formData.distanceKm),
        duration: formData.duration.length === 5 ? formData.duration + ":00" : formData.duration,
        status: formData.status,
      };
      await updateRoute(currentRoute.id, updateData);
      setSubmitSuccess(true);
      setCurrentRoute({ ...currentRoute, ...updateData });
      setTimeout(() => {
        onEditRoute();
        onOpenChange(false);
      }, 1200);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to update route");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setErrors({});
      setSubmitError(null);
      setSubmitSuccess(false);
      onOpenChange(false);
    }
  };

  if (!currentRoute) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Activity className="h-5 w-5 text-blue-600" />
            Edit Route
          </DialogTitle>
          <DialogDescription>
            Update the details for route <strong>{currentRoute.sourceCity} → {currentRoute.destinationCity}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {submitSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Route updated successfully!
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
            <Label htmlFor="edit-sourceCity" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Source City *
            </Label>
            <Input
              id="edit-sourceCity"
              value={formData.sourceCity}
              onChange={(e) => handleInputChange("sourceCity", e.target.value)}
              className={errors.sourceCity ? "border-red-500" : ""}
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
            <Label htmlFor="edit-destinationCity" className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Destination City *
            </Label>
            <Input
              id="edit-destinationCity"
              value={formData.destinationCity}
              onChange={(e) => handleInputChange("destinationCity", e.target.value)}
              className={errors.destinationCity ? "border-red-500" : ""}
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
            <Label htmlFor="edit-distanceKm" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Distance (km) *
            </Label>
            <Input
              id="edit-distanceKm"
              type="number"
              value={formData.distanceKm}
              onChange={(e) => handleInputChange("distanceKm", e.target.value)}
              className={errors.distanceKm ? "border-red-500" : ""}
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
            <Label htmlFor="edit-duration" className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Duration (HH:MM or HH:MM:SS) *
            </Label>
            <Input
              id="edit-duration"
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              className={errors.duration ? "border-red-500" : ""}
              disabled={loading}
            />
            {errors.duration && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.duration}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Status
            </Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-status"
                checked={formData.status === "active"}
                onChange={(e) => handleInputChange("status", e.target.checked ? "active" : "inactive")}
                disabled={loading}
                className="accent-green-600"
              />
              <Label
                htmlFor="edit-status"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Active (Route is operational)
              </Label>
            </div>
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
                Updating...
              </>
            ) : submitSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Updated
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRouteModal;
