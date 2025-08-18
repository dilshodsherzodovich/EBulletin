"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye } from "lucide-react";
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
import { ClassificatorsFilters } from "@/components/classificators/classificators-filters";

interface Classificator {
  id: string;
  name: string;
  createdDate: string;
  status: "active" | "inactive";
}

interface ClassificatorTableProps {
  classificators: Classificator[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (classificator: Classificator) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onCreateNew: () => void;
}

export function ClassificatorTable({
  classificators,
  selectedIds = [],
  onSelectionChange,
  onEdit,
  onDelete,
  onBulkDelete,
  onCreateNew,
}: ClassificatorTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  const filteredClassificators = classificators.filter((classificator) => {
    const matchesSearch = classificator.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || classificator.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(filteredClassificators.map((c) => c.id));
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

  const handleViewDetail = (id: string) => {
    router.push(`/classificator/${id}`);
  };

  return (
    <Card className="rounded-xl">
      <ClassificatorsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCount={selectedIds.length}
        onBulkDelete={handleBulkDelete}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onAdd={onCreateNew}
      />
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 text-[var(--table-header-fg)] ">
              <TableHead className="w-12 p-3 ">
                <Checkbox
                  checked={
                    selectedIds.length === filteredClassificators.length &&
                    filteredClassificators.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-16 p-3 ">№</TableHead>
              <TableHead className="p-3">Klassifikator nomi</TableHead>
              <TableHead className="p-3">Yaratilgan sana</TableHead>
              <TableHead className="p-3">Holat</TableHead>
              <TableHead className="w-32 p-3">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClassificators.map((classificator, index) => (
              <TableRow
                key={classificator.id}
                className={` transition-colors hover:bg-muted/50 `}
              >
                <TableCell className="p-3">
                  <Checkbox
                    checked={selectedIds.includes(classificator.id)}
                    onCheckedChange={(checked) =>
                      handleSelectOne(classificator.id, !!checked)
                    }
                  />
                </TableCell>
                <TableCell className="font-semibold text-[var(--primary)] p-3">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium p-3">
                  {classificator.name}
                </TableCell>
                <TableCell className="p-3 text-[var(--muted-foreground)]">
                  {classificator.createdDate}
                </TableCell>
                <TableCell className="p-3">
                  <Badge
                    variant={
                      classificator.status === "active"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      classificator.status === "active"
                        ? "bg-green-100 text-green-800 border-none"
                        : "bg-gray-100 text-gray-800 border-none"
                    }
                  >
                    {classificator.status === "active" ? "Faol" : "Nofaol"}
                  </Badge>
                </TableCell>
                <TableCell className="p-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(classificator)}
                      className="h-8 w-8 p-0 border border-[var(--border)] hover:bg-[var(--primary)]/10"
                      aria-label="Tahrirlash"
                    >
                      <Edit className="h-4 w-4 text-[var(--primary)]" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(classificator.id)}
                      className="h-8 w-8 p-0 border border-[var(--border)] hover:bg-[var(--destructive)]/10"
                      aria-label="O'chirish"
                    >
                      <Trash2 className="h-4 w-4 text-[var(--destructive)]" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleViewDetail(classificator.id)}
                      className="h-8 w-8 p-0 border border-[var(--border)] hover:bg-gray-100"
                      aria-label="Ko'rish"
                    >
                      <Eye className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filteredClassificators.length === 0 && (
        <div className="text-center py-8 text-[var(--muted-foreground)]">
          Klassifikatorlar topilmadi.
        </div>
      )}
    </Card>
  );
}
