import React from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "operator" | "user";
  isActive: boolean;
  lastLogin: Date | null;
}

interface EditUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  onEditUser: () => void;
  newPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onOpenChange,
  currentUser,
  setCurrentUser,
  onEditUser,
  newPassword,
  setNewPassword,
}) => {
  if (!currentUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User - {currentUser.username}</DialogTitle>
          <DialogDescription>
            Update the user account details. Leave password field empty to keep current password.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-username" className="text-right">
              Username
            </Label>
            <Input
              id="edit-username"
              value={currentUser.username}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, username: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-email" className="text-right">
              Email
            </Label>
            <Input
              id="edit-email"
              type="email"
              value={currentUser.email}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, email: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-password" className="text-right">
              New Password
            </Label>
            <Input
              id="edit-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="col-span-3"
              placeholder="Leave empty to keep current password"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-role" className="text-right">
              Role
            </Label>
            <div className="col-span-3">
              <Select
                onValueChange={(value: "admin" | "operator" | "user") =>
                  setCurrentUser({ ...currentUser, role: value })
                }
                defaultValue={currentUser.role}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="operator">Operator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-isActive" className="text-right">
              Active
            </Label>
            <div className="col-span-3">
              <Checkbox
                id="edit-isActive"
                checked={currentUser.isActive}
                onCheckedChange={(checked) =>
                  setCurrentUser({ ...currentUser, isActive: !!checked })
                }
              />
              <span className="ml-2 text-sm text-gray-600">
                User can log in and access the system
              </span>
            </div>
          </div>
          {currentUser.lastLogin && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-sm text-gray-500">
                Last Login
              </Label>
              <div className="col-span-3 text-sm text-gray-600">
                {currentUser.lastLogin.toLocaleString()}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={onEditUser}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
