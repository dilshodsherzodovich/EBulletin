"use client";

import { useState } from "react";
import { EnhancedCard } from "@/ui/enhanced-card";
import { DepartmentTable } from "@/components/departments/department-table";
import { DepartmentModal } from "@/components/departments/department-modal";
import { ConfirmationDialog } from "@/ui/confirmation-dialog";
import { Card } from "@/ui/card";

interface Department {
  id: string;
  name: string;
  organization: string;
  createdDate: string;
  status: "active" | "inactive";
}

const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Makroiqtisodiy ko'rsatkichlar va milliy hisoblar bo'limi",
    organization: "Milliy statistika qo'mitasi",
    createdDate: "12.05.2025",
    status: "active",
  },
  {
    id: "2",
    name: "Aholi va ijtimoiy statistika bo'limi",
    organization: "Milliy statistika qo'mitasi",
    createdDate: "12.05.2025",
    status: "active",
  },
  {
    id: "3",
    name: "Hududiy statistika bo'limi",
    organization: "Milliy statistika qo'mitasi",
    createdDate: "12.05.2025",
    status: "inactive",
  },
];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingDepartment, setEditingDepartment] = useState<
    Department | undefined
  >();
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    departmentId?: string;
    isBulk?: boolean;
  }>({ isOpen: false });

  const handleCreateDepartment = () => {
    setModalMode("create");
    setEditingDepartment(undefined);
    setIsModalOpen(true);
  };

  const handleEditDepartment = (department: Department) => {
    setModalMode("edit");
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  const handleSaveDepartment = (
    departmentData: Omit<Department, "id" | "createdDate">
  ) => {
    if (modalMode === "create") {
      const newDepartment: Department = {
        ...departmentData,
        id: Date.now().toString(),
        createdDate: new Date().toLocaleDateString("en-GB"),
      };
      setDepartments((prev) => [newDepartment, ...prev]);
    } else if (editingDepartment) {
      setDepartments((prev) =>
        prev.map((dept) =>
          dept.id === editingDepartment.id
            ? { ...dept, ...departmentData }
            : dept
        )
      );
    }
    setSelectedIds([]);
  };

  const handleDeleteDepartment = (department: Department) => {
    setDeleteConfirmation({
      isOpen: true,
      departmentId: department.id,
      isBulk: false,
    });
  };

  const handleBulkDelete = (ids: string[]) => {
    setSelectedIds(ids);
    setDeleteConfirmation({
      isOpen: true,
      isBulk: true,
    });
  };

  const confirmDelete = () => {
    if (deleteConfirmation.isBulk) {
      setDepartments((prev) =>
        prev.filter((dept) => !selectedIds.includes(dept.id))
      );
      setSelectedIds([]);
    } else if (deleteConfirmation.departmentId) {
      setDepartments((prev) =>
        prev.filter((dept) => dept.id !== deleteConfirmation.departmentId)
      );
    }
    setDeleteConfirmation({ isOpen: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <nav className="flex items-center space-x-2 text-sm text-[#6b7280] mb-2">
            <span>Asosiy</span>
            <span>›</span>
            <span className="text-[#1f2937]">Bo'limlar</span>
          </nav>
          <h1 className="text-2xl font-bold text-[#1f2937]">Bo'limlar</h1>
        </div>
      </div>

      <Card className="border-none p-0">
        <DepartmentTable
          departments={departments}
          onEdit={handleEditDepartment}
          onDelete={handleDeleteDepartment}
          onBulkDelete={handleBulkDelete}
          onCreateNew={handleCreateDepartment}
        />
      </Card>

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDepartment}
        department={editingDepartment}
        mode={modalMode}
      />

      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false })}
        onConfirm={confirmDelete}
        title={
          deleteConfirmation.isBulk
            ? "Bo'limlarni o'chirish"
            : "Bo'limni o'chirish"
        }
        message={
          deleteConfirmation.isBulk
            ? `Haqiqatan ham ${selectedIds.length} ta tanlangan bo'limni o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.`
            : "Haqiqatan ham bu bo'limni o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi."
        }
      />
    </div>
  );
}
