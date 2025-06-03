
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Search, Shield, User, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
  
import { Badge } from "@/components/ui/badge";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";

interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "operator" | "user";
  isActive: boolean;
  lastLogin: Date | null;
}

interface NewUser {
  username: string;
  email: string;
  password: string;
  role: "admin" | "operator" | "user";
  isActive: boolean;
}

const UserManagement = () => {
  // Sample data for users
  const [users, setUsers] = useState<User[]>([
    {
      id: "U001",
      username: "admin",
      email: "admin@nextstop.com",
      role: "admin",
      isActive: true,
      lastLogin: new Date("2023-10-15T14:30:00"),
    },
    {
      id: "U002",
      username: "operator1",
      email: "operator1@nextstop.com",
      role: "operator",
      isActive: true,
      lastLogin: new Date("2023-10-14T09:15:00"),
    },
    {
      id: "U003",
      username: "user123",
      email: "user123@example.com",
      role: "user",
      isActive: false,
      lastLogin: null,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [newUser, setNewUser] = useState<NewUser>({
    username: "",
    email: "",
    password: "",
    role: "user",
    isActive: true,
  });

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddUser = () => {
    const id = `U${String(users.length + 1).padStart(3, "0")}`;
    setUsers([
      ...users,
      {
        ...newUser,
        id,
        lastLogin: null,
      },
    ]);
    setNewUser({
      username: "",
      email: "",
      password: "",
      role: "user",
      isActive: true,
    });
    setIsAddDialogOpen(false);
  };

  const handleEditUser = () => {
    if (!currentUser) return;
    setUsers(
      users.map((user) =>
        user.id === currentUser.id ? currentUser : user,
      ),
    );
    setNewPassword("");
    setIsEditDialogOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const openEditDialog = (user: User) => {
    setCurrentUser({ ...user });
    setNewPassword("");
    setIsEditDialogOpen(true);
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "operator":
        return <UserCheck className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "operator":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format last login
  const formatLastLogin = (lastLogin: Date | null) => {
    if (!lastLogin) return "Never";
    return lastLogin.toLocaleDateString() + " " + lastLogin.toLocaleTimeString();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <AddUserModal
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          newUser={newUser}
          setNewUser={setNewUser}
          onAddUser={handleAddUser}
        />
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users by username, email, or role"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <User className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Administrators</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.role === "admin").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Operators</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.role === "operator").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getRoleColor(user.role)} flex items-center gap-1 w-fit`}
                    >
                      {getRoleIcon(user.role)}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${user.isActive ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20" : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"}`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatLastLogin(user.lastLogin)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to delete this user?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently
                              delete the user account "{user.username}" and remove
                              all associated data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete User
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <EditUserModal
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onEditUser={handleEditUser}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
      />
    </div>
  );
};

export default UserManagement;
