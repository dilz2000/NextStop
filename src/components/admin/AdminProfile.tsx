
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Edit, 
  LogOut, 
  Settings, 
  User, 
  Mail, 
  Shield, 
  Calendar,
  Clock,
  Key,
  Eye,
  AlertTriangle,
  Loader2,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  fetchCurrentAdminProfile, 
  getCurrentUserFromStorage, 
  isAuthenticated,
  AdminProfile as AdminProfileType 
} from "../../api/adminApi";
import EditUserModal from "./User_management/EditUserModal";

interface AdminData {
  name: string;
  email: string;
  role: string;
  id: number;
  emailVerified: boolean;
  active: boolean;
  roles: string[];
  joinedDate: string;
  lastLogin: string;
}

const AdminProfile = () => {
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const loadAdminData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check authentication first
        if (!isAuthenticated()) {
          window.location.href = '/';
          return;
        }

        // Get user data from localStorage
        const localUser = getCurrentUserFromStorage();
        if (!localUser) {
          window.location.href = '/';
          return;
        }
        
        // Check if user is admin
        if (localUser.role !== "ROLE_ADMIN") {
          window.location.href = '/';
          return;
        }

        try {
          // Try to fetch fresh data from API
          const apiUserData: AdminProfileType = await fetchCurrentAdminProfile(localUser.id);
          
          // Combine API data with localStorage data (API takes priority)
          setAdmin({
            name: apiUserData.fullName || localUser.fullName || "Admin User",
            email: apiUserData.email || localUser.email || "admin@quickbus.com",
            role: apiUserData.roles && apiUserData.roles.includes("ROLE_ADMIN") 
              ? "System Administrator" 
              : (localUser.role === "ROLE_ADMIN" ? "System Administrator" : localUser.role),
            id: apiUserData.id || localUser.id,
            emailVerified: apiUserData.emailVerified || false,
            active: apiUserData.active !== undefined ? apiUserData.active : true,
            roles: apiUserData.roles || [localUser.role],
            // Fallback to localStorage or default values for data not in API
            joinedDate: localUser.joinedDate || "Jan 15, 2023",
            lastLogin: new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              hour: '2-digit',
              minute: '2-digit'
            }),
          });
        } catch (apiError) {
          // If API fails, use localStorage data
          console.warn('API fetch failed, using localStorage data:', apiError);
          setAdmin({
            name: localUser.fullName || "Admin User",
            email: localUser.email || "admin@quickbus.com",
            role: localUser.role === "ROLE_ADMIN" ? "System Administrator" : localUser.role,
            id: localUser.id,
            emailVerified: false, // Default since not available
            active: true, // Default since not available
            roles: [localUser.role],
            joinedDate: "Jan 15, 2023",
            lastLogin: new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              hour: '2-digit',
              minute: '2-digit'
            }),
          });
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
        setError('Failed to load profile data');
        // Redirect to home if data is corrupted
        window.location.href = '/';
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    
    // Reset state and redirect
    setShowLogoutConfirm(false);
    window.location.href = '/';
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleEditProfile = async () => {
    // Reload the profile data after editing
    window.location.reload(); // refresh data
    setIsEditModalOpen(false);
  };

  const getEditableUserData = () => {
    if (!admin) return null;
    
    return {
      id: admin.id,
      fullName: admin.name,
      email: admin.email,
      emailVerified: admin.emailVerified,
      active: admin.active,
      roles: admin.roles,
    };
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Profile</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleRefresh} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">Profile Not Found</h3>
          <p className="text-gray-600 mb-4">Unable to load admin profile</p>
          <Button onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <User className="h-8 w-8 text-blue-600" />
            Admin Profile
          </h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4" /> 
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1 border-2 border-blue-100">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-blue-200">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                    {getInitials(admin.name)}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 border-2 border-white rounded-full flex items-center justify-center ${
                  admin.active ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">{admin.name}</h2>
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
                  <Mail className="h-3 w-3" />
                  {admin.email}
                  {admin.emailVerified && (
                    <span className="ml-1 text-green-600" title="Email Verified">✓</span>
                  )}
                </p>
                <div className="mt-3 inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                  <Shield className="h-3 w-3" />
                  {admin.role}
                </div>
                {!admin.active && (
                  <div className="mt-2 inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">
                    <AlertCircle className="h-3 w-3" />
                    Account Inactive
                  </div>
                )}
              </div>
              <div className="flex space-x-2 w-full">
                <Button className="flex-1" size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-2" /> 
                  Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50" 
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" /> 
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="md:col-span-2">
          <CardHeader className="bg-gray-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  </div>
                  <p className="text-lg font-medium">{admin.name}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-medium">{admin.email}</p>
                    {/* {admin.emailVerified ? (
                      <span className="text-green-600 text-sm bg-green-100 px-2 py-1 rounded-full">
                        Verified
                      </span>
                    ) : (
                      <span className="text-yellow-600 text-sm bg-yellow-100 px-2 py-1 rounded-full">
                        Unverified
                      </span>
                    )} */}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  </div>
                  <p className="text-lg font-medium">{admin.role}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                  </div>
                  <p className="text-lg font-medium">#{admin.id}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-medium text-gray-500">Account Status</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${admin.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <p className="text-lg font-medium">{admin.active ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-medium text-gray-500">Last Login</h3>
                  </div>
                  <p className="text-lg font-medium">{admin.lastLogin}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="md:col-span-3">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Key className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Change Password</h3>
                    <p className="text-sm text-gray-500">
                      Update your password regularly to keep your account secure
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300">
                  Change Password
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-300">
                  Enable
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Eye className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Login History</h3>
                    <p className="text-sm text-gray-500">
                      View your recent login activity and sessions
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:border-purple-300">
                  View History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {admin && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          currentUser={getEditableUserData()}
          setCurrentUser={() => {}} // Not used since we refresh after edit
          onEditUser={handleEditProfile}
        />
      )}

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Confirm Logout
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You will need to sign in again to access the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLogout}
              className="bg-red-500 hover:bg-red-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProfile;
