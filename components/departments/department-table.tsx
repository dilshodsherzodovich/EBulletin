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
import { Edit, Trash2 } from "lucide-react";
import { DepartmentsFilters } from "@/components/departments/department-filters";
import { Card } from "@/ui/card";

interface Department {
  id: string;
  name: string;
  organization: string;
  createdDate: string;
  status: "active" | "inactive";
}

interface DepartmentTableProps {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
  onBulkDelete: (departmentIds: string[]) => void;
  onCreateNew: () => void;
}

export function DepartmentTable({
  departments,
  onEdit,
  onDelete,
  onBulkDelete,
  onCreateNew,
}: DepartmentTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orgFilter, setOrgFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Example options (replace with real data as needed)
  const orgOptions = [
    "",
    "Milliy statistika qo'mitasi",
    "Iqtisodiyot vazirligi",
    "Moliya vazirligi",
  ];
  const statusOptions = ["", "active", "inactive"];

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrg = orgFilter === "all" || dept.organization === orgFilter;
    const matchesStatus =
      statusFilter === "all" || dept.status === statusFilter;
    return matchesSearch && matchesOrg && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredDepartments.map((dept) => dept.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectDepartment = (departmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, departmentId]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== departmentId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      onBulkDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <DepartmentsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCount={selectedIds.length}
          onBulkDelete={handleBulkDelete}
          orgFilter={orgFilter}
          onOrgChange={setOrgFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          orgOptions={orgOptions}
          onAdd={onCreateNew}
        />
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 text-[var(--table-header-fg)] sticky top-0 z-10 ">
                <TableHead className="w-12 p-3 ">
                  <Checkbox
                    checked={
                      selectedIds.length === filteredDepartments.length &&
                      filteredDepartments.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-16 p-3 ">#</TableHead>
                <TableHead className="p-3">Bo'lim</TableHead>
                <TableHead className="p-3">Tashkilot</TableHead>
                <TableHead className="p-3">Yaratilgan sana</TableHead>
                <TableHead className="p-3">Holat</TableHead>
                <TableHead className="w-32 p-3">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((department, index) => (
                <TableRow
                  key={department.id}
                  className={" transition-colors hover:bg-muted/50 "}
                >
                  <TableCell className="p-3">
                    <Checkbox
                      checked={selectedIds.includes(department.id)}
                      onCheckedChange={(checked) =>
                        handleSelectDepartment(department.id, !!checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-[var(--primary)] p-3">
                    {index + 1}
                  </TableCell>
                  <TableCell className="p-3">
                    <span className="font-medium">{department.name}</span>
                  </TableCell>
                  <TableCell className="p-3 text-[var(--muted-foreground)]">
                    {department.organization}
                  </TableCell>
                  <TableCell className="p-3 text-[var(--muted-foreground)]">
                    {department.createdDate}
                  </TableCell>
                  <TableCell className="p-3">
                    <Badge
                      variant={
                        department.status === "active" ? "default" : "secondary"
                      }
                      className={
                        department.status === "active"
                          ? "bg-green-100 text-green-800 border-none"
                          : "bg-gray-100 text-gray-800 border-none"
                      }
                    >
                      {department.status === "active" ? "Faol" : "Nofaol"}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(department)}
                        className="h-8 w-8 p-0 border border-[var(--border)] hover:bg-[var(--primary)]/10"
                        aria-label="Tahrirlash"
                      >
                        <Edit className="h-4 w-4 text-[var(--primary)]" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(department)}
                        className="h-8 w-8 p-0 border border-[var(--border)] hover:bg-[var(--destructive)]/10"
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
