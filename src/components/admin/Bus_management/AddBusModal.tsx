
import React, { useState } from "react";
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
  Bus as BusIcon,
  User,
  Hash,
  Activity
} from "lucide-react";
import { createBus, BusCreateRequest } from "../../../api/busApi";

interface NewBus {
  busNumber: string;
  type: 'AC' | 'Non-AC';
  totalSeats: number;
  operatorName: string;
  status: 'active' | 'inactive';
  amenities: string[];
}

interface AddBusModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newBus: NewBus;
  setNewBus: React.Dispatch<React.SetStateAction<NewBus>>;
  onAddBus: () => void;
}

interface FormData {
  busNumber: string;
  type: 'AC' | 'Non-AC' | '';
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

const AddBusModal: React.FC<AddBusModalProps> = ({
  isOpen,
  onOpenChange,
  newBus,
  setNewBus,
  onAddBus,
}) => {
  const [formData, setFormData] = useState<FormData>({
    busNumber: '',
    type: '',
    totalSeats: '',
    operatorName: '',
    status: 'active',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Validation functions
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Bus Number validation
    if (!formData.busNumber.trim()) {
      newErrors.busNumber = 'Bus number is required';
    } else if (formData.busNumber.trim().length < 3) {
      newErrors.busNumber = 'Bus number must be at least 3 characters';
    } else if (formData.busNumber.trim().length > 20) {
      newErrors.busNumber = 'Bus number cannot exceed 20 characters';
    } else if (!/^[A-Za-z0-9]+$/.test(formData.busNumber.trim())) {
      newErrors.busNumber = 'Bus number can only contain letters and numbers';
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
    } else if (formData.operatorName.trim().length > 50) {
      newErrors.operatorName = 'Operator name cannot exceed 50 characters';
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

  const resetForm = () => {
    setFormData({
      busNumber: '',
      type: '',
      totalSeats: '',
      operatorName: '',
      status: 'active',
    });
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const createData: BusCreateRequest = {
        busNumber: formData.busNumber.trim(),
        type: formData.type as 'AC' | 'Non-AC',
        totalSeats: parseInt(formData.totalSeats),
        operatorName: formData.operatorName.trim(),
        status: formData.status,
      };

      await createBus(createData);
      
      setSubmitSuccess(true);
      
      // Update the newBus state for parent component
      setNewBus({
        ...createData,
        totalSeats: parseInt(formData.totalSeats),
        amenities: formData.type === 'AC' ? ['AC', 'WiFi'] : ['WiFi'], // Default amenities
      });

      // Call parent's onAddBus to refresh the list
      setTimeout(() => {
        onAddBus();
        resetForm();
        onOpenChange(false);
      }, 1500);

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create bus');
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
    if (open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Bus
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plus className="h-5 w-5 text-green-600" />
            Add New Bus
          </DialogTitle>
          <DialogDescription>
            Enter the details for the new bus to add it to your fleet.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Success Message */}
          {submitSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Bus created successfully!
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
            <Label htmlFor="busNumber" className="flex items-center gap-2">
              <BusIcon className="h-4 w-4" />
              Bus Number *
            </Label>
            <Input
              id="busNumber"
              value={formData.busNumber}
              onChange={(e) => handleInputChange('busNumber', e.target.value)}
              className={errors.busNumber ? 'border-red-500 focus:border-red-500' : ''}
              placeholder="Enter bus number (e.g., XQ1111)"
              disabled={loading}
              maxLength={20}
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
            <Label htmlFor="type" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Bus Type *
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
            <Label htmlFor="totalSeats" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Total Seats *
            </Label>
            <Input
              id="totalSeats"
              type="number"
              value={formData.totalSeats}
              onChange={(e) => handleInputChange('totalSeats', e.target.value)}
              className={errors.totalSeats ? 'border-red-500 focus:border-red-500' : ''}
              placeholder="Enter total seats (1-100)"
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
            <Label htmlFor="operatorName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Operator Name *
            </Label>
            <Input
              id="operatorName"
              value={formData.operatorName}
              onChange={(e) => handleInputChange('operatorName', e.target.value)}
              className={errors.operatorName ? 'border-red-500 focus:border-red-500' : ''}
              placeholder="Enter operator name"
              disabled={loading}
              maxLength={50}
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
                id="status"
                checked={formData.status === 'active'}
                onCheckedChange={(checked) => 
                  handleInputChange('status', checked ? 'active' : 'inactive')
                }
                disabled={loading}
              />
              <Label 
                htmlFor="status" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Active (Bus is operational and available for booking)
              </Label>
            </div>
          </div>

          {/* Required Fields Note */}
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <span className="text-red-500">*</span> Required fields
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
            className="min-w-[120px]"
          >
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
                Create Bus
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBusModal;
