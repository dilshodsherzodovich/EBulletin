"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Button } from "@/ui/button";
import { Checkbox } from "@/ui/checkbox";
import { Badge } from "@/ui/badge";

import { Edit, Trash2, User, Shield, Building } from "lucide-react";

import { UserFilters } from "@/components/users/user-filters";
import { Card } from "@/ui/card";

interface UserTableProps {
  users: any[];
  selectedIds: string[];
  onSelectionChange: (selected: string[]) => void;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
  onBulkDelete: (ids: string[]) => void;
  onCreateNew: () => void;
}

export function UserTable({
  users,
  selectedIds = [],
  onSelectionChange,
  onEdit,
  onDelete,
  onBulkDelete,
  onCreateNew,
}: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState(""); // Added search state
  const [roleFilter, setRoleFilter] = useState("all");
  const [orgFilter, setOrgFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Example options (replace with real data as needed)
  const roleOptions = ["", "Administrator", "Operator", "Tahlilchi"];
  const orgOptions = ["", "Statistika", "Analitika", "Rejalashtirish"];
  const deptOptions = ["", "Statistika", "Analitika", "Rejalashtirish"];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.login.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesOrg = orgFilter === "all" || user.department === orgFilter;
    const matchesDept = deptFilter === "all" || user.department === deptFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return (
      matchesSearch && matchesRole && matchesOrg && matchesDept && matchesStatus
    );
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(filteredUsers.map((user) => user.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, userId]);
    } else {
      onSelectionChange(selectedIds.filter((id) => id !== userId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      onBulkDelete(selectedIds);
    }
  };

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Foydalanuvchilar topilmadi
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="rounded-xl">
        <UserFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCount={selectedIds.length}
          onBulkDelete={handleBulkDelete}
          roleFilter={roleFilter}
          onRoleChange={setRoleFilter}
          orgFilter={orgFilter}
          onOrgChange={setOrgFilter}
          deptFilter={deptFilter}
          onDeptChange={setDeptFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          roleOptions={roleOptions}
          orgOptions={orgOptions}
          deptOptions={deptOptions}
          onAdd={onCreateNew}
        />

        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 text-[var(--table-header-fg)] ">
                <TableHead className="w-12 p-3 ">
                  <Checkbox
                    checked={
                      selectedIds.length === filteredUsers.length &&
                      filteredUsers.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-16 p-3 ">#</TableHead>
                <TableHead className="p-3">Foydalanuvchi</TableHead>
                <TableHead className="p-3">Rol</TableHead>
                <TableHead className="p-3">Bo'lim</TableHead>
                <TableHead className="p-3">Yaratilgan sana</TableHead>
                <TableHead className="p-3">Holat</TableHead>
                <TableHead className="w-32 p-3">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={` transition-colors hover:bg-muted/50 `}
                >
                  <TableCell className="p-3">
                    <Checkbox
                      checked={selectedIds.includes(user.id)}
                      onCheckedChange={(checked) =>
                        handleSelectUser(user.id, !!checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-[var(--primary)] p-3">
                    {index + 1}
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[var(--primary)]/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-[var(--primary)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--foreground)]">
                          {user.name}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {user.login}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[var(--primary)]" />
                      <Badge
                        variant="secondary"
                        className="bg-[var(--muted)] text-[var(--foreground)] border-none"
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-[var(--primary)]" />
                      <span className="text-[var(--muted-foreground)]">
                        {user.department}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[var(--muted-foreground)] p-3">
                    {user.createdDate}
                  </TableCell>
                  <TableCell className="p-3">
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "secondary"
                      }
                      className={
                        user.status === "active"
                          ? "bg-green-100 text-green-800 border-none"
                          : user.status === "reserve"
                          ? "bg-blue-100 text-blue-800 border-none"
                          : user.status === "repair"
                          ? "bg-red-100 text-red-800 border-none"
                          : "bg-gray-100 text-gray-800 border-none"
                      }
                    >
                      {user.status === "active"
                        ? "Faol"
                        : user.status === "reserve"
                        ? "Zaxirada"
                        : user.status === "repair"
                        ? "Ta'mirda"
                        : "Nofaol"}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(user)}
                        className="h-8 w-8 p-0 border-1 border-[var(--border)] hover:bg-[var(--primary)]/10 shadow-none"
                        aria-label="Tahrirlash"
                      >
                        <Edit className="h-4 w-4 text-[var(--primary)]" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(user)}
                        className="h-8 w-8 p-0 border-1 border-[var(--border)] hover:bg-[var(--destructive)]/10 shadow-none"
                        aria-label="O'chirish"
                      >
                        <Trash2 className="h-4 w-4 text-[var(--destructive)]" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
