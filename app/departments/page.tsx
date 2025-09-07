"use client";

import { useState } from "react";
import { EnhancedCard } from "@/ui/enhanced-card";
import { DepartmentTable } from "@/components/departments/department-table";
import { DepartmentModal } from "@/components/departments/department-modal";
import { ConfirmationDialog } from "@/ui/confirmation-dialog";
import { Card } from "@/ui/card";
import {
  useCreateDepartment,
  useDeleteDepartment,
  useDepartments,
  useEditDepartment,
} from "@/api/hooks/use-departmants";
import { Department, DepartmentCreateParams } from "@/api/types/deparments";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/api/querykey";

export default function DepartmentsPage() {
  const queryClient = useQueryClient();

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

  const {
    data: departmentsList,
    isPending,
    isFetching,
  } = useDepartments({ page: 1 });
  const { mutate: createDepartment, isPending: isCreatingDep } =
    useCreateDepartment();
  const { mutate: editDepartment, isPending: isEditingDep } =
    useEditDepartment();
  const { mutate: deleteDepartment, isPending: isDeletingDep } =
    useDeleteDepartment();

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setEditingDepartment(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (department: Department) => {
    setModalMode("edit");
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  const handleSaveDepartment = (departmentData: DepartmentCreateParams) => {
    if (modalMode === "create") {
      createDepartment(departmentData, {
        onSuccess: () => {
          toast.success("Bo'lim muvaffaqiyatli qo'shildi!");
        },
        onError: (error) => {
          toast.error(`Xatolik yuz berdi: ${error.message}`);
        },
        onSettled: () => {
          setIsModalOpen(false);
          queryClient.invalidateQueries({
            queryKey: [queryKeys.departments.list],
          });
        },
      });
    } else if (editingDepartment) {
      editDepartment(
        { id: editingDepartment.id, ...departmentData },
        {
          onSuccess: () => {
            toast.success("Bo'lim ma'lumotlari muvaffaqiyatli tahrirlandi!");
          },
          onError: (error) => {
            toast.error(`Xatolik yuz berdi: ${error.message}`);
          },
          onSettled: () => {
            setIsModalOpen(false);
            setEditingDepartment(undefined);
            queryClient.invalidateQueries({
              queryKey: [queryKeys.departments.list],
            });
          },
        }
      );
    }
    setSelectedIds([]);
  };

  const handleOpenDeleteModal = (department: Department) => {
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

  const handleDelete = () => {
    if (deleteConfirmation.isBulk) {
      toast.info("Ushbu funksiya tez orada qo'shiladi!");
    } else if (deleteConfirmation.departmentId) {
      deleteDepartment(deleteConfirmation.departmentId, {
        onSuccess: () => {
          toast.success("Bo'lim muvaffaqiyatli o'chirildi!");
        },
        onError: (error) => {
          toast.error(`Xatolik yuz berdi: ${error.message}`);
        },
        onSettled: () => {
          setDeleteConfirmation({ isOpen: false });
          queryClient.invalidateQueries({
            queryKey: [queryKeys.departments.list],
          });
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <nav className="flex items-center space-x-2 text-sm text-[#6b7280] mb-2">
            <span>Asosiy</span>
            <span>›</span>
            <span className="text-[#1f2937]">Bo'lim va quyi tashkilotlar</span>
          </nav>
          <h1 className="text-2xl font-bold text-[#1f2937]">
            Bo'lim va quyi tashkilotlar
          </h1>
        </div>
      </div>

      <Card className="border-none p-0">
        <DepartmentTable
          departments={departmentsList!}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          onBulkDelete={handleBulkDelete}
          onCreateNew={handleOpenCreateModal}
        />
      </Card>

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDepartment}
        department={editingDepartment}
        mode={modalMode}
        isDoingAction={isCreatingDep || isEditingDep}
      />

      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false })}
        onConfirm={handleDelete}
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
        isDoingAction={isDeletingDep}
        isDoingActionText="O'chirilmoqda"
      />
    </div>
  );
}
