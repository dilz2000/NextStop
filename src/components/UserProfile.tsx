import React, { useRef, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { User, Mail, Shield, Key, X, Edit2, Check, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  fetchCurrentUserProfile, 
  updateUserProfile, 
  updateLocalStorageUser, 
  UpdateProfileRequest,
  UserProfileData 
} from "../api/userProfileApi";

interface UserData {
  id: number;
  token: string;
  role: string;
  fullName: string;
  email: string;
  refreshToken: string;
}

interface UserProfileProps {
  userData: UserData;
  onClose: () => void;
  onProfileUpdate?: (updatedData: Partial<UserData>) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userData, onClose, onProfileUpdate }) => {
  const profileRef = useRef<HTMLDivElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userData.fullName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<UserProfileData | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  // Fetch current user data from API on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setInitialLoading(true);
        const profileData = await fetchCurrentUserProfile();
        setCurrentUserData(profileData);
        setEditedName(profileData.fullName);
      } catch (err) {
        console.error('Failed to load user profile:', err);
        // Fallback to localStorage data
        setCurrentUserData({
          id: userData.id,
          fullName: userData.fullName,
          email: userData.email,
          emailVerified: false,
          active: true,
          roles: [userData.role]
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadUserProfile();
  }, [userData]);

  const handleResetPassword = () => {
    window.location.href = '/reset-password';
    onClose();
  };

  const handleEditName = () => {
    setIsEditingName(true);
    setError(null);
    setSuccess(false);
  };

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      setError('Name cannot be empty');
      return;
    }

    if (editedName.trim() === currentUserData?.fullName) {
      setIsEditingName(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updateData: UpdateProfileRequest = {
        fullName: editedName.trim(),
        email: currentUserData?.email || userData.email,
      };

      await updateUserProfile(updateData);
      
      // Update local state
      if (currentUserData) {
        const updatedUserData = { ...currentUserData, fullName: editedName.trim() };
        setCurrentUserData(updatedUserData);
      }

      // Update localStorage
      updateLocalStorageUser({ fullName: editedName.trim() });

      // Notify parent component of the update
      if (onProfileUpdate) {
        onProfileUpdate({ fullName: editedName.trim() });
      }

      setSuccess(true);
      setIsEditingName(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update name');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(currentUserData?.fullName || userData.fullName);
    setIsEditingName(false);
    setError(null);
  };

  const getInitials = (fullName: string): string => {
    if (!fullName) return 'U';
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getRoleColor = (role: string): string => {
    const roleStr = role.toLowerCase();
    if (roleStr.includes('admin')) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (roleStr.includes('moderator')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else {
      return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const formatRole = (role: string): string => {
    if (role === 'ROLE_ADMIN') return 'Administrator';
    if (role === 'ROLE_CUSTOMER') return 'Customer';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  const displayName = currentUserData?.fullName || userData.fullName;
  const displayEmail = currentUserData?.email || userData.email;

  if (initialLoading) {
    return (
      <div
        ref={profileRef}
        className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200"
      >
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={profileRef}
      className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Content */}
      <div className="p-4">
        {/* Success Message */}
        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Profile updated successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Picture and Name */}
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full font-semibold text-xl mr-4 shadow-md">
            {getInitials(displayName)}
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900">{displayName}</h4>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(userData.role)}`}>
              <Shield className="w-3 h-3 mr-1" />
              {formatRole(userData.role)}
            </span>
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-4">
          {/* Full Name - Editable */}
          <div className="flex items-start text-sm">
            <User className="w-4 h-4 text-gray-400 mr-3 mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-gray-500">Full Name</p>
                {!isEditingName && (
                  <button
                    onClick={handleEditName}
                    className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-md hover:bg-blue-50"
                    title="Edit name"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              {isEditingName ? (
                <div className="space-y-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-sm"
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSaveName}
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Check className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      disabled={loading}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-900 font-medium">{displayName}</p>
              )}
            </div>
          </div>

          {/* Email - Read Only */}
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 text-gray-400 mr-3" />
            <div>
              <p className="text-gray-500">Email</p>
              <p className="text-gray-900 font-medium break-all">{displayEmail}</p>
            </div>
          </div>

          {/* Role - Read Only */}
          <div className="flex items-center text-sm">
            <Shield className="w-4 h-4 text-gray-400 mr-3" />
            <div>
              <p className="text-gray-500">Role</p>
              <p className="text-gray-900 font-medium">{formatRole(userData.role)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Button
            onClick={handleResetPassword}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 text-sm hover:bg-gray-50"
          >
            <Key className="w-4 h-4" />
            <span>Reset Password</span>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Last login: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
