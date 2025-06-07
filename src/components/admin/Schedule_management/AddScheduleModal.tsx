
import React, { useState } from 'react';
import { Plus, Loader2, CheckCircle, AlertCircle, Bus as BusIcon, MapPin, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createSchedule, ScheduleCreateRequest, Bus, Route } from '../../../api/ScheduleManageApi';

interface AddScheduleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSchedule: () => void;
  buses: Bus[];
  routes: Route[];
}

interface FormData {
  busId: number | null;
  routeId: number | null;
  departureTime: string;
  arrivalTime: string;
  fare: string;
}

interface FormErrors {
  busId?: string;
  routeId?: string;
  departureTime?: string;
  arrivalTime?: string;
  fare?: string;
}

const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  isOpen,
  onOpenChange,
  onAddSchedule,
  buses,
  routes,
}) => {
  const [formData, setFormData] = useState<FormData>({
    busId: null,
    routeId: null,
    departureTime: '',
    arrivalTime: '',
    fare: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.busId) {
      newErrors.busId = 'Bus selection is required';
    }
    
    if (!formData.routeId) {
      newErrors.routeId = 'Route selection is required';
    }
    
    if (!formData.departureTime) {
      newErrors.departureTime = 'Departure time is required';
    }
    
    if (!formData.arrivalTime) {
      newErrors.arrivalTime = 'Arrival time is required';
    } else if (formData.departureTime && new Date(formData.arrivalTime) <= new Date(formData.departureTime)) {
      newErrors.arrivalTime = 'Arrival time must be after departure time';
    }
    
    if (!formData.fare) {
      newErrors.fare = 'Fare is required';
    } else if (isNaN(Number(formData.fare)) || Number(formData.fare) <= 0) {
      newErrors.fare = 'Fare must be a positive number';
    } else if (Number(formData.fare) > 10000) {
      newErrors.fare = 'Fare cannot exceed $10,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const resetForm = () => {
    setFormData({
      busId: null,
      routeId: null,
      departureTime: '',
      arrivalTime: '',
      fare: '',
    });
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
      const createData: ScheduleCreateRequest = {
        bus: { id: formData.busId! },
        route: { id: formData.routeId! },
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        fare: Number(formData.fare),
      };
      
      await createSchedule(createData);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        onAddSchedule();
        resetForm();
        onOpenChange(false);
      }, 1500);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create schedule');
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
          Add New Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plus className="h-5 w-5 text-green-600" />
            Add New Schedule
          </DialogTitle>
          <DialogDescription>
            Create a new bus schedule with departure and arrival times.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {submitSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Schedule created successfully!
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

          {/* Bus Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <BusIcon className="h-4 w-4" />
              Bus Operator *
            </Label>
            <Select
              value={formData.busId?.toString() || ''}
              onValueChange={(value) => handleInputChange('busId', Number(value))}
              disabled={loading}
            >
              <SelectTrigger className={errors.busId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a bus operator" />
              </SelectTrigger>
              <SelectContent>
                {buses.filter(bus => bus.status === 'active').map((bus) => (
                  <SelectItem key={bus.id} value={bus.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{bus.operatorName}</span>
                      <span className="text-sm text-gray-500">({bus.busNumber})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.busId && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.busId}
              </p>
            )}
          </div>

          {/* Route Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Route *
            </Label>
            <Select
              value={formData.routeId?.toString() || ''}
              onValueChange={(value) => handleInputChange('routeId', Number(value))}
              disabled={loading}
            >
              <SelectTrigger className={errors.routeId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a route" />
              </SelectTrigger>
              <SelectContent>
                {routes.filter(route => route.status === 'active').map((route) => (
                  <SelectItem key={route.id} value={route.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{route.sourceCity}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium">{route.destinationCity}</span>
                      <span className="text-sm text-gray-500">({route.distanceKm}km)</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.routeId && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.routeId}
              </p>
            )}
          </div>

          {/* Departure Time */}
          <div className="space-y-2">
            <Label htmlFor="departureTime" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Departure Time *
            </Label>
            <Input
              id="departureTime"
              type="datetime-local"
              value={formData.departureTime}
              onChange={(e) => handleInputChange('departureTime', e.target.value)}
              className={errors.departureTime ? 'border-red-500' : ''}
              disabled={loading}
            />
            {errors.departureTime && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.departureTime}
              </p>
            )}
          </div>

          {/* Arrival Time */}
          <div className="space-y-2">
            <Label htmlFor="arrivalTime" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Arrival Time *
            </Label>
            <Input
              id="arrivalTime"
              type="datetime-local"
              value={formData.arrivalTime}
              onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
              className={errors.arrivalTime ? 'border-red-500' : ''}
              disabled={loading}
            />
            {errors.arrivalTime && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.arrivalTime}
              </p>
            )}
          </div>

          {/* Fare */}
          <div className="space-y-2">
            <Label htmlFor="fare" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Fare ($) *
            </Label>
            <Input
              id="fare"
              type="number"
              value={formData.fare}
              onChange={(e) => handleInputChange('fare', e.target.value)}
              className={errors.fare ? 'border-red-500' : ''}
              placeholder="Enter fare amount"
              min="0"
              max="10000"
              step="0.01"
              disabled={loading}
            />
            {errors.fare && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.fare}
              </p>
            )}
          </div>

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
                Create Schedule
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddScheduleModal;
