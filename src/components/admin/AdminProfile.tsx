import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, LogOut, Settings } from "lucide-react";

const AdminProfile = () => {
  // Sample admin data
  const admin = {
    name: "Admin User",
    email: "admin@quickbus.com",
    role: "System Administrator",
    joinedDate: "Jan 15, 2023",
    lastLogin: "Today at 9:30 AM",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Profile</h1>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" /> Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-bold">{admin.name}</h2>
                <p className="text-sm text-gray-500">{admin.email}</p>
                <div className="mt-2 inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                  {admin.role}
                </div>
              </div>
              <div className="flex space-x-2 w-full">
                <Button className="flex-1" size="sm">
                  <Settings className="h-4 w-4 mr-2" /> Settings
                </Button>
                <Button variant="outline" className="flex-1" size="sm">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Full Name
                  </h3>
                  <p>{admin.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Email Address
                  </h3>
                  <p>{admin.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  <p>{admin.role}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Joined Date
                  </h3>
                  <p>{admin.joinedDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Last Login
                  </h3>
                  <p>{admin.lastLogin}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Change Password</h3>
                  <p className="text-sm text-gray-500">
                    Update your password regularly to keep your account secure
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Login History</h3>
                  <p className="text-sm text-gray-500">
                    View your recent login activity
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfile;
