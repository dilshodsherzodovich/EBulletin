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
import { PaginatedData } from "@/api/types/general";
import { UserData, UserRole } from "@/api/types/user";
import { getRoleName } from "@/lib/utils";
import { TableSkeleton } from "@/ui/table-skeleton";

interface UserTableProps {
  users: PaginatedData<UserData>;
  selectedIds: string[];
  onSelectionChange: (selected: string[]) => void;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
  onBulkDelete: (ids: string[]) => void;
  onCreateNew: () => void;
  isLoading: boolean;
}

export function UserTable({
  users,
  selectedIds = [],
  onSelectionChange,
  onEdit,
  onDelete,
  onBulkDelete,
  onCreateNew,
  isLoading,
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(users?.results?.map((user) => user.id));
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
                      selectedIds.length === users?.results?.length &&
                      users?.results?.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-16 p-3 ">#</TableHead>
                <TableHead className="p-3">Foydalanuvchi</TableHead>
                <TableHead className="p-3">Rol</TableHead>
                <TableHead className="p-3">Quyi tashkilot</TableHead>
                <TableHead className="p-3">Yaratilgan sana</TableHead>
                <TableHead className="p-3">Holat</TableHead>
                <TableHead className="w-32 p-3">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton rows={10} columns={8} />
              ) : users?.results?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="p-3">
                    <div className="text-center py-8 text-[var(--muted-foreground)]">
                      Foydalanuvchilar topilmadi.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users?.results?.map((user, index) => (
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
                            {user.first_name + " " + user.last_name}
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            {user.username}
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
                          {getRoleName(user.role as UserRole).toUpperCase()}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="p-3">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-[var(--primary)]" />
                        <span className="text-[var(--muted-foreground)]">
                          {user?.profile?.secondary_organization?.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[var(--muted-foreground)] p-3">
                      {user.createdAt}
                    </TableCell>
                    <TableCell className="p-3">
                      <Badge
                        variant={user.is_active ? "default" : "secondary"}
                        className={
                          user.is_active
                            ? "bg-green-100 text-green-800 border-none"
                            : "bg-gray-100 text-gray-800 border-none"
                        }
                      >
                        {user.is_active ? "Faol" : "Nofaol"}
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
                          onClick={() => onDelete(user.id)}
                          className="h-8 w-8 p-0 border-1 border-[var(--border)] hover:bg-[var(--destructive)]/10 shadow-none"
                          aria-label="O'chirish"
                        >
                          <Trash2 className="h-4 w-4 text-[var(--destructive)]" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
