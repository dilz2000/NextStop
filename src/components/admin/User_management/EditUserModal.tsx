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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Edit, 
  User as UserIcon,
  Mail,
  Shield,
  Activity
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { updateUser, updateUserRole, UserUpdateRequest, UserRoleUpdateRequest, User } from "../../../api/userApi";

interface EditUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  onEditUser: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  active: boolean;
  role: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onOpenChange,
  currentUser,
  setCurrentUser,
  onEditUser,
}) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    active: true,
    role: 'ROLE_CUSTOMER',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName,
        email: currentUser.email,
        active: currentUser.active,
        role: currentUser.roles[0] || 'ROLE_CUSTOMER',
      });
      setErrors({});
      setSubmitError(null);
      setSubmitSuccess(false);
    }
  }, [currentUser]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async () => {
    if (!currentUser || !validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Update user basic info
      const updateData: UserUpdateRequest = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        emailVerified: currentUser.emailVerified, // Keep existing value
        active: formData.active,
      };

      await updateUser(currentUser.id, updateData);

      // Update user role if changed
      if (formData.role !== currentUser.roles[0]) {
        const roleUpdateData: UserRoleUpdateRequest = {
          roles: [formData.role],
        };
        await updateUserRole(currentUser.id, roleUpdateData);
      }
      
      setSubmitSuccess(true);
      
      // Update the current user state with new data
      setCurrentUser({
        ...currentUser,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        active: formData.active,
        roles: [formData.role],
      });

      setTimeout(() => {
        onEditUser();
        onOpenChange(false);
      }, 1500);

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to update user');
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

  if (!currentUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Edit className="h-5 w-5 text-blue-600" />
            Edit User Details
          </DialogTitle>
          <DialogDescription>
            Update the information for user <strong>{currentUser.fullName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Success Message */}
          {submitSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                User details updated successfully!
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

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-fullName" className="flex items-center gap-2">
              <UserIcon  className="h-4 w-4" />
              Full Name
            </Label>
            <Input
              id="edit-fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={errors.fullName ? 'border-red-500 focus:border-red-500' : ''}
              placeholder="Enter full name"
              disabled={loading}
            />
            {errors.fullName && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="edit-email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
              placeholder="Enter email address"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              User Role
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange('role', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ROLE_CUSTOMER">
                  <div className="flex items-center gap-2">
                    <UserIcon  className="h-4 w-4 text-blue-600" />
                    <span>Customer</span>
                  </div>
                </SelectItem>
                <SelectItem value="ROLE_ADMIN">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-600" />
                    <span>Administrator</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Status */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Account Status
            </Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-active"
                checked={formData.active}
                onCheckedChange={(checked) => handleInputChange('active', !!checked)}
                disabled={loading}
              />
              <Label 
                htmlFor="edit-active" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Active (User can log in and access the system)
              </Label>
            </div>
          </div>

          {/* Email Verification Status (Read-only) */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Verification
            </Label>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
              <div className={`w-2 h-2 rounded-full ${currentUser.emailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-sm text-gray-700">
                {currentUser.emailVerified ? 'Email Verified' : 'Email Not Verified'}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Email verification status is managed automatically by the system
            </p>
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

export default EditUserModal;
