
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle, Edit, Bus as BusIcon, MapPin, Clock, DollarSign, Activity } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { updateSchedule, ScheduleUpdateRequest, Schedule, Bus, Route } from '../../../api/ScheduleMAnageApi';

interface EditScheduleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentSchedule: Schedule | null;
  setCurrentSchedule: React.Dispatch<React.SetStateAction<Schedule | null>>;
  onEditSchedule: () => void;
  buses: Bus[];
  routes: Route[];
}

interface FormData {
  busId: number | null;
  routeId: number | null;
  departureTime: string;
  arrivalTime: string;
  fare: string;
  status: 'active' | 'inactive';
}

interface FormErrors {
  busId?: string;
  routeId?: string;
  departureTime?: string;
  arrivalTime?: string;
  fare?: string;
}

const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
  isOpen,
  onOpenChange,
  currentSchedule,
  setCurrentSchedule,
  onEditSchedule,
  buses,
  routes,
}) => {
  const [formData, setFormData] = useState<FormData>({
    busId: null,
    routeId: null,
    departureTime: '',
    arrivalTime: '',
    fare: '',
    status: 'active',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (currentSchedule) {
      setFormData({
        busId: currentSchedule.bus.id,
        routeId: currentSchedule.route.id,
        departureTime: currentSchedule.departureTime.slice(0, 16),
        arrivalTime: currentSchedule.arrivalTime.slice(0, 16),
        fare: currentSchedule.fare.toString(),
        status: currentSchedule.status,
      });
      setErrors({});
      setSubmitError(null);
      setSubmitSuccess(false);
    }
  }, [currentSchedule]);

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

  const handleSubmit = async () => {
    if (!currentSchedule || !validateForm()) return;
    
    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      const updateData: ScheduleUpdateRequest = {
        bus: { id: formData.busId! },
        route: { id: formData.routeId! },
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        fare: Number(formData.fare),
        status: formData.status,
      };
      
      await updateSchedule(currentSchedule.id, updateData);
      setSubmitSuccess(true);
      
      const selectedBus = buses.find(b => b.id === formData.busId);
      const selectedRoute = routes.find(r => r.id === formData.routeId);
      
      setCurrentSchedule({
        ...currentSchedule,
        bus: selectedBus!,
        route: selectedRoute!,
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        fare: Number(formData.fare),
        status: formData.status,
      });
      
      setTimeout(() => {
        onEditSchedule();
        onOpenChange(false);
      }, 1500);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to update schedule');
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

  if (!currentSchedule) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Edit className="h-5 w-5 text-blue-600" />
            Edit Schedule
          </DialogTitle>
          <DialogDescription>
            Update the schedule details for ID #{currentSchedule.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {submitSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Schedule updated successfully!
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
                {buses.map((bus) => (
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
                {routes.map((route) => (
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
            <Label htmlFor="edit-departureTime" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Departure Time *
            </Label>
            <Input
              id="edit-departureTime"
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
            <Label htmlFor="edit-arrivalTime" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Arrival Time *
            </Label>
            <Input
              id="edit-arrivalTime"
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
            <Label htmlFor="edit-fare" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Fare ($) *
            </Label>
            <Input
              id="edit-fare"
              type="number"
              value={formData.fare}
              onChange={(e) => handleInputChange('fare', e.target.value)}
              className={errors.fare ? 'border-red-500' : ''}
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
                Active (Schedule is operational and bookable)
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
            className="min-w-[120px]"
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

export default EditScheduleModal;
