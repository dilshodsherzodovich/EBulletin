"use client";
import { Input } from "@/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/ui/select";
import { Button } from "@/ui/button";
import { Trash2 } from "lucide-react";

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  onBulkDelete: () => void;
  roleFilter: string;
  onRoleChange: (value: string) => void;
  orgFilter: string;
  onOrgChange: (value: string) => void;
  deptFilter: string;
  onDeptChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  roleOptions: string[];
  orgOptions: string[];
  deptOptions: string[];
  onAdd: () => void;
}

export function UserFilters({
  searchTerm,
  onSearchChange,
  selectedCount,
  onBulkDelete,
  roleFilter,
  onRoleChange,
  orgFilter,
  onOrgChange,
  deptFilter,
  onDeptChange,
  statusFilter,
  onStatusChange,
  roleOptions,
  orgOptions,
  deptOptions,
  onAdd,
}: UserFiltersProps) {
  return (
    <div className="flex gap-2 mb-4 items-center justify-between">
      <Input
        placeholder="Foydalanuvchi nomi yoki login..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="min-w-[180px] h-10 mb-0"
      />
      <Select value={roleFilter} onValueChange={onRoleChange}>
        <SelectTrigger className="min-w-[160px] h-10 mb-0">
          <SelectValue placeholder="Barcha rollar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Barcha rollar</SelectItem>
          {roleOptions.slice(1).map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={orgFilter} onValueChange={onOrgChange}>
        <SelectTrigger className="min-w-[160px] h-10 mb-0">
          <SelectValue placeholder="Barcha tashkilotlar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Barcha tashkilotlar</SelectItem>
          {orgOptions.slice(1).map((org) => (
            <SelectItem key={org} value={org}>
              {org}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={deptFilter} onValueChange={onDeptChange}>
        <SelectTrigger className="min-w-[160px] h-10 mb-0">
          <SelectValue placeholder="Barcha bo'limlar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Barcha bo'limlar</SelectItem>
          {deptOptions.slice(1).map((dept) => (
            <SelectItem key={dept} value={dept}>
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="min-w-[140px] h-10 mb-0">
          <SelectValue placeholder="Barcha holatlar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Barcha holatlar</SelectItem>
          <SelectItem value="active">Faol</SelectItem>
          <SelectItem value="reserve">Zaxirada</SelectItem>
          <SelectItem value="repair">Ta'mirda</SelectItem>
          <SelectItem value="inactive">Nofaol</SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={onAdd}
        className="h-10 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white whitespace-nowrap"
      >
        <span className="flex items-center">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Yangi foydalanuvchi
        </span>
      </Button>
      {selectedCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#6b7280]">
            {selectedCount} ta tanlangan
          </span>
          <Button
            variant="outline"
            size="sm"
            className="text-[#dc2626] border-[#dc2626] hover:bg-[#dc2626] hover:text-white bg-transparent"
            onClick={onBulkDelete}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            O'chirish
          </Button>
        </div>
      )}
    </div>
  );
}
