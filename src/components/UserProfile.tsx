import React, { useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { User, Mail, Shield, Key, X } from "lucide-react";

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
}

const UserProfile: React.FC<UserProfileProps> = ({ userData, onClose }) => {
  const profileRef = useRef<HTMLDivElement>(null);

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

  const handleResetPassword = () => {
    // Navigate to reset password page or open reset password modal
    window.location.href = '/reset-password';
    onClose();
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
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderator':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'user':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatRole = (role: string): string => {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  return (
    <div
      ref={profileRef}
      className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Content */}
      <div className="p-4">
        {/* Profile Picture and Name */}
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full font-semibold text-xl mr-4">
            {getInitials(userData.fullName)}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{userData.fullName}</h4>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(userData.role)}`}>
              <Shield className="w-3 h-3 mr-1" />
              {formatRole(userData.role)}
            </span>
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-3">
          {/* Full Name */}
          <div className="flex items-center text-sm">
            <User className="w-4 h-4 text-gray-400 mr-3" />
            <div>
              <p className="text-gray-500">Full Name</p>
              <p className="text-gray-900 font-medium">{userData.fullName}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 text-gray-400 mr-3" />
            <div>
              <p className="text-gray-500">Email</p>
              <p className="text-gray-900 font-medium break-all">{userData.email}</p>
            </div>
          </div>

          {/* Role */}
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
            className="w-full flex items-center justify-center space-x-2 text-sm"
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
