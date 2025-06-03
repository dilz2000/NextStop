
import React, { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Edit, 
  Bus as BusIcon,
  User,
  Hash,
  Activity
} from "lucide-react";
import { updateBus, BusUpdateRequest, Bus } from "../../../api/busApi";

interface EditBusModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentBus: Bus | null;
  setCurrentBus: React.Dispatch<React.SetStateAction<Bus | null>>;
  onEditBus: () => void;
}

interface FormData {
  busNumber: string;
  type: 'AC' | 'Non-AC';
  totalSeats: string;
  operatorName: string;
  status: 'active' | 'inactive';
}

interface FormErrors {
  busNumber?: string;
  type?: string;
  totalSeats?: string;
  operatorName?: string;
}

const EditBusModal: React.FC<EditBusModalProps> = ({
  isOpen,
  onOpenChange,
  currentBus,
  setCurrentBus,
  onEditBus,
}) => {
  const [formData, setFormData] = useState<FormData>({
    busNumber: '',
    type: 'AC',
    totalSeats: '',
    operatorName: '',
    status: 'active',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Initialize form data when currentBus changes
  useEffect(() => {
    if (currentBus) {
      setFormData({
        busNumber: currentBus.busNumber,
        type: currentBus.type as 'AC' | 'Non-AC',
        totalSeats: currentBus.totalSeats.toString(),
        operatorName: currentBus.operatorName,
        status: currentBus.status,
      });
      setErrors({});
      setSubmitError(null);
      setSubmitSuccess(false);
    }
  }, [currentBus]);

  // Validation functions
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Bus Number validation
    if (!formData.busNumber.trim()) {
      newErrors.busNumber = 'Bus number is required';
    } else if (formData.busNumber.trim().length < 3) {
      newErrors.busNumber = 'Bus number must be at least 3 characters';
    }

    // Type validation
    if (!formData.type) {
      newErrors.type = 'Bus type is required';
    }

    // Total Seats validation
    if (!formData.totalSeats.trim()) {
      newErrors.totalSeats = 'Total seats is required';
    } else {
      const seats = parseInt(formData.totalSeats);
      if (isNaN(seats)) {
        newErrors.totalSeats = 'Total seats must be a valid number';
      } else if (seats <= 0) {
        newErrors.totalSeats = 'Total seats must be greater than 0';
      } else if (seats > 100) {
        newErrors.totalSeats = 'Total seats cannot exceed 100';
      } else if (!Number.isInteger(seats)) {
        newErrors.totalSeats = 'Total seats must be a whole number';
      }
    }

    // Operator Name validation
    if (!formData.operatorName.trim()) {
      newErrors.operatorName = 'Operator name is required';
    } else if (formData.operatorName.trim().length < 2) {
      newErrors.operatorName = 'Operator name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async () => {
    if (!currentBus || !validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const updateData: BusUpdateRequest = {
        busNumber: formData.busNumber.trim(),
        type: formData.type,
        totalSeats: parseInt(formData.totalSeats),
        operatorName: formData.operatorName.trim(),
        status: formData.status,
      };

      await updateBus(parseInt(currentBus.id), updateData);
      
      setSubmitSuccess(true);
      
      // Update the current bus state with new data
      setCurrentBus({
        ...currentBus,
        ...updateData,
      });

      // Call parent's onEditBus to refresh the list
      setTimeout(() => {
        onEditBus();
        onOpenChange(false);
      }, 1500);

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to update bus');
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

  if (!currentBus) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Edit className="h-5 w-5 text-blue-600" />
            Edit Bus Details
          </DialogTitle>
          <DialogDescription>
            Update the information for bus <strong>{currentBus.busNumber}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Success Message */}
          {submitSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Bus details updated successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {submitError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {submitError}
              </AlertDescription>
            </Alert>
          )}

          {/* Bus Number */}
          <div className="space-y-2">
            <Label htmlFor="edit-busNumber" className="flex items-center gap-2">
              <BusIcon className="h-4 w-4" />
              Bus Number
            </Label>
            <Input
              id="edit-busNumber"
              value={formData.busNumber}
              onChange={(e) => handleInputChange('busNumber', e.target.value)}
              className={errors.busNumber ? 'border-red-500 focus:border-red-500' : ''}
              placeholder="Enter bus number"
              disabled={loading}
            />
            {errors.busNumber && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.busNumber}
              </p>
            )}
          </div>

          {/* Bus Type */}
          <div className="space-y-2">
            <Label htmlFor="edit-type" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Bus Type
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'AC' | 'Non-AC') => handleInputChange('type', value)}
              disabled={loading}
            >
              <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select bus type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AC">
                  <div className="flex items-center gap-2">
                    <span>❄️</span>
                    AC
                  </div>
                </SelectItem>
                <SelectItem value="Non-AC">
                  <div className="flex items-center gap-2">
                    <span>🌡️</span>
                    Non-AC
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.type}
              </p>
            )}
          </div>

          {/* Total Seats */}
          <div className="space-y-2">
            <Label htmlFor="edit-totalSeats" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Total Seats
            </Label>
            <Input
              id="edit-totalSeats"
              type="number"
              value={formData.totalSeats}
              onChange={(e) => handleInputChange('totalSeats', e.target.value)}
              className={errors.totalSeats ? 'border-red-500 focus:border-red-500' : ''}
              placeholder="Enter total seats"
              min="1"
              max="100"
              disabled={loading}
            />
            {errors.totalSeats && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.totalSeats}
              </p>
            )}
          </div>

          {/* Operator Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-operatorName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Operator Name
            </Label>
            <Input
              id="edit-operatorName"
              value={formData.operatorName}
              onChange={(e) => handleInputChange('operatorName', e.target.value)}
              className={errors.operatorName ? 'border-red-500 focus:border-red-500' : ''}
              placeholder="Enter operator name"
              disabled={loading}
            />
            {errors.operatorName && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.operatorName}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Status
            </Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-status"
                checked={formData.status === 'active'}
                onCheckedChange={(checked) => 
                  handleInputChange('status', checked ? 'active' : 'inactive')
                }
                disabled={loading}
              />
              <Label 
                htmlFor="edit-status" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Active (Bus is operational and available for booking)
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || submitSuccess}
            className="min-w-[100px]"
          >
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
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBusModal;
