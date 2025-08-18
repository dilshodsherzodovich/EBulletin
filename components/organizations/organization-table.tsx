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
import { Edit, Trash2, Building2 } from "lucide-react";
import { OrganizationsFilters } from "@/components/organizations/organization-filters";
import { Card } from "@/ui/card";

interface Organization {
  id: string;
  name: string;
  type: string;
  parentOrganization?: string;
  createdDate: string;
  status: "active" | "inactive";
}

interface OrganizationTableProps {
  organizations: Organization[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (organization: Organization) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onCreateNew: () => void;
}

export function OrganizationTable({
  organizations,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  onBulkDelete,
  onCreateNew,
}: OrganizationTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Example options (replace with real data as needed)
  const typeOptions = [
    "",
    "hukumat",
    "vazirlik",
    "qo'mita",
    "bo'lim",
    "agentlik",
    "byuro",
  ];

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (org.parentOrganization &&
        org.parentOrganization
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "all" || org.type === typeFilter;
    const matchesStatus = statusFilter === "all" || org.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(filteredOrganizations.map((org) => org.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      onBulkDelete(selectedIds);
    }
  };

  return (
    <Card className="rounded-xl">
      <OrganizationsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCount={selectedIds.length}
        onBulkDelete={handleBulkDelete}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeOptions={typeOptions}
        onAdd={onCreateNew}
      />
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 text-[var(--table-header-fg)] ">
              <TableHead className="w-12 p-3 ">
                <Checkbox
                  checked={
                    selectedIds.length === filteredOrganizations.length &&
                    filteredOrganizations.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-16 p-3 ">#</TableHead>
              <TableHead className="p-3">Tashkilot</TableHead>
              <TableHead className="p-3">Turi</TableHead>
              <TableHead className="p-3">Yuqori tashkilot</TableHead>
              <TableHead className="p-3">Yaratilgan sana</TableHead>
              <TableHead className="p-3">Holat</TableHead>
              <TableHead className="w-32 p-3">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrganizations.map((organization, index) => (
              <TableRow
                key={organization.id}
                className={` transition-colors hover:bg-muted/50 `}
              >
                <TableCell className="p-3">
                  <Checkbox
                    checked={selectedIds.includes(organization.id)}
                    onCheckedChange={(checked) =>
                      handleSelectOne(organization.id, !!checked)
                    }
                  />
                </TableCell>
                <TableCell className="font-semibold text-[var(--primary)] p-3">
                  {index + 1}
                </TableCell>
                <TableCell className="p-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[var(--primary)]" />
                    <span className="font-medium">{organization.name}</span>
                  </div>
                </TableCell>
                <TableCell className="p-3">
                  <Badge
                    variant="secondary"
                    className="bg-[var(--muted)] text-[var(--foreground)] border-none"
                  >
                    {organization.type}
                  </Badge>
                </TableCell>
                <TableCell className="p-3 text-[var(--muted-foreground)]">
                  {organization.parentOrganization || "—"}
                </TableCell>
                <TableCell className="p-3 text-[var(--muted-foreground)]">
                  {organization.createdDate}
                </TableCell>
                <TableCell className="p-3">
                  <Badge
                    variant={
                      organization.status === "active" ? "default" : "secondary"
                    }
                    className={
                      organization.status === "active"
                        ? "bg-green-100 text-green-800 border-none"
                        : "bg-gray-100 text-gray-800 border-none"
                    }
                  >
                    {organization.status === "active" ? "Faol" : "Nofaol"}
                  </Badge>
                </TableCell>
                <TableCell className="p-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(organization)}
                      className="h-8 w-8 p-0 border border-[var(--border)] hover:bg-[var(--primary)]/10"
                      aria-label="Tahrirlash"
                    >
                      <Edit className="h-4 w-4 text-[var(--primary)]" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(organization.id)}
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
  );
}
