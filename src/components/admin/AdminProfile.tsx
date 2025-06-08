// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Edit, LogOut, Settings } from "lucide-react";

// const AdminProfile = () => {
//   // Sample admin data
//   const admin = {
//     name: "Admin User",
//     email: "admin@quickbus.com",
//     role: "System Administrator",
//     joinedDate: "Jan 15, 2023",
//     lastLogin: "Today at 9:30 AM",
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Admin Profile</h1>
//         <Button variant="outline" size="sm">
//           <Edit className="h-4 w-4 mr-2" /> Edit Profile
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Profile Card */}
//         <Card className="md:col-span-1">
//           <CardContent className="pt-6">
//             <div className="flex flex-col items-center space-y-4">
//               <Avatar className="h-24 w-24">
//                 <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
//                 <AvatarFallback>AD</AvatarFallback>
//               </Avatar>
//               <div className="text-center">
//                 <h2 className="text-xl font-bold">{admin.name}</h2>
//                 <p className="text-sm text-gray-500">{admin.email}</p>
//                 <div className="mt-2 inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
//                   {admin.role}
//                 </div>
//               </div>
//               <div className="flex space-x-2 w-full">
//                 <Button className="flex-1" size="sm">
//                   <Settings className="h-4 w-4 mr-2" /> Settings
//                 </Button>
//                 <Button variant="outline" className="flex-1" size="sm">
//                   <LogOut className="h-4 w-4 mr-2" /> Logout
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Details Card */}
//         <Card className="md:col-span-2">
//           <CardHeader>
//             <CardTitle>Account Details</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">
//                     Full Name
//                   </h3>
//                   <p>{admin.name}</p>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">
//                     Email Address
//                   </h3>
//                   <p>{admin.email}</p>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Role</h3>
//                   <p>{admin.role}</p>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">
//                     Joined Date
//                   </h3>
//                   <p>{admin.joinedDate}</p>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">
//                     Last Login
//                   </h3>
//                   <p>{admin.lastLogin}</p>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Security Card */}
//         <Card className="md:col-span-3">
//           <CardHeader>
//             <CardTitle>Security Settings</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="font-medium">Change Password</h3>
//                   <p className="text-sm text-gray-500">
//                     Update your password regularly to keep your account secure
//                   </p>
//                 </div>
//                 <Button variant="outline" size="sm">
//                   Change Password
//                 </Button>
//               </div>
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="font-medium">Two-Factor Authentication</h3>
//                   <p className="text-sm text-gray-500">
//                     Add an extra layer of security to your account
//                   </p>
//                 </div>
//                 <Button variant="outline" size="sm">
//                   Enable
//                 </Button>
//               </div>
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="font-medium">Login History</h3>
//                   <p className="text-sm text-gray-500">
//                     View your recent login activity
//                   </p>
//                 </div>
//                 <Button variant="outline" size="sm">
//                   View History
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default AdminProfile;



/////////////////


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
  AlertTriangle
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

const AdminProfile = () => {
  const [admin, setAdmin] = useState<any>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setAdmin({
          name: user.fullName || "Admin User",
          email: user.email || "admin@quickbus.com",
          role: user.role === "ROLE_ADMIN" ? "System Administrator" : user.role,
          id: user.id,
          joinedDate: "Jan 15, 2023", // You can add this to user data later
          lastLogin: new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit'
          }),
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Redirect to home if data is corrupted
        window.location.href = '/';
      }
    } else {
      // Redirect to home if no user data
      window.location.href = '/';
    }
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

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
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
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Edit className="h-4 w-4" /> 
          Edit Profile
        </Button>
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
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">{admin.name}</h2>
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
                  <Mail className="h-3 w-3" />
                  {admin.email}
                </p>
                <div className="mt-3 inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                  <Shield className="h-3 w-3" />
                  {admin.role}
                </div>
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
                  <p className="text-lg font-medium">{admin.email}</p>
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
                    <h3 className="text-sm font-medium text-gray-500">Joined Date</h3>
                  </div>
                  <p className="text-lg font-medium">{admin.joinedDate}</p>
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
