"use client";

import { useState } from "react";
import { Edit, Trash2, Eye, UserCheck, BarChart3 } from "lucide-react";
import { Badge } from "@/ui/badge";
import { Checkbox } from "@/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { BulletinFilters } from "./bulletin-filters";
import { Pagination } from "@/ui/pagination";
import Link from "next/link";
import { Bulletin } from "@/api/types/bulleten";
import { Organization } from "@/api/types/organizations";
import { TableSkeleton } from "@/ui/table-skeleton";
import { PermissionGuard } from "../permission-guard";
import { format } from "date-fns";

interface BulletinTableProps {
  bulletins: Bulletin[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (bulletin: Bulletin) => void;
  onDelete: (bulletin: Bulletin) => void;
  onBulkDelete: (ids: string[]) => void;
  onCreateNew: () => void;
  isLoading: boolean;
  isDeleting: boolean;
  organizations: Organization[];
  isLoadingOrganizations?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  organizationFilter: string;
  onOrganizationChange: (value: string) => void;
  periodTypeFilter: string;
  onPeriodTypeChange: (value: string) => void;
  onClearFilters: () => void;
  totalItems?: number;
}

// Deadline type mapping to Uzbek labels
const deadlineLabels: { [key: string]: string } = {
  weekly: "Haftalik",
  monthly: "Oylik",
  quarterly: "Choraklik",
  every_n_months: "Har N oyda",
  daily: "Kunlik",
  yearly: "Yillik",
};

const getDeadlineLabel = (periodType: string | undefined): string => {
  if (!periodType) return "N/A";
  return deadlineLabels[periodType] || periodType;
};

export function BulletinTable({
  bulletins,
  selectedIds = [],
  isLoading,
  isDeleting,
  organizations,
  isLoadingOrganizations = false,
  currentPage,
  totalPages,
  searchTerm,
  organizationFilter,
  periodTypeFilter,
  onSelectionChange,
  onEdit,
  onDelete,
  onBulkDelete,
  onCreateNew,
  onPageChange,
  onSearchChange,
  onOrganizationChange,
  onPeriodTypeChange,
  onClearFilters,
  totalItems,
}: BulletinTableProps) {
  const filteredBulletins = bulletins.filter((bulletin) => {
    const matchesSearch = bulletin.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesOrganization =
      organizationFilter === "all" ||
      (bulletin.main_organizations_list &&
        bulletin.main_organizations_list.some(
          (org) => org.id === organizationFilter
        ));

    const matchesPeriodType =
      periodTypeFilter === "all" ||
      bulletin.deadline?.period_type === periodTypeFilter;

    return matchesSearch && matchesOrganization && matchesPeriodType;
  });

  const hasActiveFilters =
    searchTerm !== "" ||
    organizationFilter !== "all" ||
    periodTypeFilter !== "all";

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(filteredBulletins.map((b) => b.id));
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

  const handleDeleteClick = (bulletin: Bulletin) => {
    onDelete(bulletin);
  };

  return (
    <Card className="rounded-xl">
      <BulletinFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        selectedCount={selectedIds.length}
        onBulkDelete={handleBulkDelete}
        organizationFilter={organizationFilter}
        onOrganizationChange={onOrganizationChange}
        periodTypeFilter={periodTypeFilter}
        onPeriodTypeChange={onPeriodTypeChange}
        onAdd={onCreateNew}
        organizations={organizations}
        isLoadingOrganizations={isLoadingOrganizations}
        onClearFilters={onClearFilters}
        hasActiveFilters={hasActiveFilters}
      />
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 text-[var(--table-header-fg)] ">
              <PermissionGuard permission="delete_journal">
                <TableHead className="w-4 p-3 ">
                  <Checkbox
                    checked={
                      selectedIds.length === filteredBulletins.length &&
                      filteredBulletins.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              </PermissionGuard>
              <TableHead className="w-8 p-3 ">№</TableHead>
              <TableHead className="p-3">Byulleten nomi</TableHead>
              <TableHead className="p-3">Byulleten tavsifi</TableHead>
              <PermissionGuard permission="view_bulletin_main_info">
                <TableHead className="p-3">Tashkilotlar</TableHead>
              </PermissionGuard>
              <TableHead className="p-3">Mas'ul shaxslar</TableHead>
              <TableHead className="p-3">Yaratilgan sana</TableHead>
              <TableHead className="p-3">Muddat turi</TableHead>
              <TableHead className="p-3">Muddati</TableHead>
              <TableHead className="w-32 p-3">Amallar </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton rows={10} columns={10} />
            ) : filteredBulletins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  <div className="text-sm whitespace-nowrap text-[var(--muted-foreground)]">
                    {hasActiveFilters
                      ? "Filtrlar bo'yicha byulletenlar topilmadi."
                      : "Byulletenlar topilmadi."}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredBulletins.map((bulletin, index) => (
                <TableRow
                  key={bulletin.id}
                  className={` transition-colors hover:bg-muted/50 `}
                >
                  <PermissionGuard permission="delete_journal">
                    <TableCell className="p-3">
                      <Checkbox
                        checked={selectedIds.includes(bulletin.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOne(bulletin.id, !!checked)
                        }
                      />
                    </TableCell>
                  </PermissionGuard>

                  <TableCell className="font-semibold text-[var(--primary)] p-3">
                    {(currentPage - 1) * 10 + index + 1}
                  </TableCell>
                  <TableCell className="font-medium p-3 max-w-lg">
                    <div className="truncate" title={bulletin.name}>
                      {bulletin.name}
                    </div>
                  </TableCell>
                  <TableCell className="p-3 max-w-md">
                    <div className="truncate" title={bulletin.description}>
                      {bulletin.description}
                    </div>
                  </TableCell>
                  <PermissionGuard permission="view_bulletin_main_info">
                    <TableCell className="p-3 max-w-md">
                      <div className="space-y-2">
                        {(bulletin.main_organizations_list || []).map(
                          (mainOrg) => (
                            <div
                              key={mainOrg.id}
                              className="border border-[var(--border)] rounded-lg p-2 bg-[var(--muted)]/10"
                            >
                              <div className="text-xs font-medium text-[var(--foreground)] mb-1">
                                <div className="break-words leading-tight">
                                  {mainOrg.name}:
                                </div>
                                {mainOrg.secondary_organizations &&
                                mainOrg.secondary_organizations.length > 0 ? (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {mainOrg.secondary_organizations.map(
                                      (secOrg) => (
                                        <Badge
                                          key={secOrg.id}
                                          variant="secondary"
                                          className="text-xs px-2 py-1 border-[var(--border)] break-words whitespace-normal"
                                        >
                                          <span className="break-words">
                                            {secOrg.name}
                                          </span>
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-xs text-[var(--muted-foreground)] italic mt-1">
                                    Ikkinchi darajali tashkilotlar yo'q
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        )}
                        {(!bulletin.main_organizations_list ||
                          bulletin.main_organizations_list.length === 0) && (
                          <div className="text-sm text-[var(--muted-foreground)] italic">
                            Tashkilotlar tanlanmagan
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </PermissionGuard>
                  <TableCell className="p-3 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {(bulletin.employees_list || []).map((emp) => (
                        <Badge
                          key={emp.id}
                          variant="outline"
                          className="text-xs px-2 py-1 border-[var(--border)] bg-[var(--primary)]/10 text-[var(--primary)] break-words"
                        >
                          <span className="break-words">
                            {emp.first_name} {emp.last_name}
                          </span>
                        </Badge>
                      ))}
                      {(!bulletin.employees_list ||
                        bulletin.employees_list.length === 0) && (
                        <div className="text-sm whitespace-nowrap text-[var(--muted-foreground)] italic">
                          Mas'ul shaxslar tanlanmagan
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="p-3 text-[var(--muted-foreground)]">
                    {format(bulletin.created, "dd.MM.yyyy")}
                  </TableCell>
                  <TableCell className="p-3">
                    <Badge
                      variant="secondary"
                      className="bg-[var(--muted)]/50 text-[var(--foreground)] border-none"
                    >
                      {getDeadlineLabel(bulletin.deadline?.period_type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-3 text-[var(--muted-foreground)]">
                    {format(bulletin.deadline?.current_deadline, "dd.MM.yyyy")}
                  </TableCell>

                  <TableCell className="p-3">
                    <div className="flex items-center gap-2">
                      <PermissionGuard permission="edit_journal">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(bulletin)}
                          className="h-8 w-8 p-0 border border-[var(--border)] hover:bg-[var(--primary)]/10"
                          aria-label="Tahrirlash"
                        >
                          <Edit className="h-4 w-4 text-[var(--primary)]" />
                        </Button>
                      </PermissionGuard>
                      <PermissionGuard permission="delete_journal">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteClick(bulletin)}
                          className="h-8 w-8 p-0 border border-[var(--border)] hover:bg-[var(--destructive)]/10"
                          aria-label="O'chirish"
                        >
                          <Trash2 className="h-4 w-4 text-[var(--destructive)]" />
                        </Button>
                      </PermissionGuard>
                      <PermissionGuard permission="view_journal_detail">
                        <Link
                          href={`/bulletins/${bulletin.id}/detail`}
                          className="inline-flex items-center justify-center h-8 w-8 p-0 border border-[var(--border)] rounded-md hover:bg-[var(--primary)]/10 transition-colors"
                          aria-label="Ma'lumotlar"
                        >
                          <Eye className="h-4 w-4 text-[var(--primary)]" />
                        </Link>
                      </PermissionGuard>
                      <PermissionGuard permission="view_journal_structure">
                        <Link
                          href={`/bulletins/${bulletin.id}/structure`}
                          className="inline-flex items-center justify-center h-8 w-8 p-0 border border-[var(--border)] rounded-md hover:bg-[var(--primary)]/10 transition-colors"
                          aria-label="Struktura"
                        >
                          <BarChart3 className="h-4 w-4 text-[var(--primary)]" />
                        </Link>
                      </PermissionGuard>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-[var(--border)]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={totalItems}
          />
        </div>
      )}
    </Card>
  );
}
