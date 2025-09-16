"use client";

import { useState } from "react";
import { Card } from "@/ui/card";
import { UserTable } from "@/components/users/user-table";
import { UserModal } from "@/components/users/user-modal";
import { ConfirmationDialog } from "@/ui/confirmation-dialog";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "@/api/hooks/use-user";
import { useSnackbar } from "@/providers/snackbar-provider";
import { CreateUserRequest } from "@/api/types/user";
import { UserData } from "@/api/types/auth";
import { canAccessSection } from "@/lib/permissions";
import { redirect } from "next/navigation";

// Keep the mock data for now

export default function UsersPage() {
  const user = JSON.parse(localStorage.getItem("user")!);

  if (!user || !canAccessSection(user, "users")) {
    redirect("/");
  }

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = useState<UserData | undefined>();
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    userId?: string;
    isBulk?: boolean;
  }>({ isOpen: false });
  const [page, setPage] = useState(1);

  // Use snackbar for notifications
  const { showSuccess, showError, showInfo } = useSnackbar();

  const { data: usersList, isPending } = useUsers({ page });
  const { mutate: createUser, isPending: isCreatingUser } = useCreateUser();
  const { mutate: editUser, isPending: isEditingUser } = useUpdateUser();
  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteUser();

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setEditingUser(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserData) => {
    setModalMode("edit");
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (userData: CreateUserRequest) => {
    if (modalMode === "create") {
      createUser(userData, {
        onSuccess: () => {
          setIsModalOpen(false);
          showSuccess("Foydalanuvchi muvaffaqiyatli yaratildi!");
        },
        onError: (error) => {
          showError(`Xatolik yuz berdi: ${error.message}`);
        },
      });
    } else if (editingUser) {
      editUser(
        { id: editingUser.id, userData },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingUser(undefined);
            showSuccess("Foydalanuvchi muvaffaqiyatli yaratildi!");
          },
          onError: (error) => {
            showError(`Xatolik yuz berdi: ${error.message}`);
          },
        }
      );
    }
  };

  const handleOpenDeleteModal = (userId: string) => {
    setDeleteConfirmation({
      isOpen: true,
      userId,
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
      showInfo("Bu funksiya tez orada qo'shiladi!");
    } else if (deleteConfirmation.userId) {
      deleteUser(deleteConfirmation.userId, {
        onSuccess: () => {
          showSuccess("Foydalanuvchi muvaffaqiyatli o'chirildi");
          setDeleteConfirmation({ isOpen: false });
        },
        onError: (error) => {
          showError(`Xatolik yuz berdi: ${error.message}`);
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
            <span className="text-[#1f2937]">Foydalanuvchilar</span>
          </nav>
          <h1 className="text-2xl font-bold text-[#1f2937]">
            Foydalanuvchilar
          </h1>
        </div>
      </div>

      <UserTable
        users={usersList!}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
        onBulkDelete={handleBulkDelete}
        onCreateNew={handleOpenCreateModal}
        isLoading={isPending}
        totalPages={usersList?.count || 1}
        currentPage={page}
        onPageChange={setPage}
        totalItems={usersList?.count || 0}
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveUser}
        user={editingUser}
        mode={modalMode}
        isLoading={isCreatingUser || isEditingUser}
      />

      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false })}
        onConfirm={handleDelete}
        title={
          deleteConfirmation.isBulk
            ? "Foydalanuvchilarni o'chirish"
            : "Foydalanuvchini o'chirish"
        }
        message={
          deleteConfirmation.isBulk
            ? `Haqiqatan ham ${selectedIds.length} ta tanlangan foydalanuvchini o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.`
            : "Haqiqatan ham bu foydalanuvchini o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi."
        }
        isDoingAction={isDeletingUser}
        isDoingActionText="O'chirilmoqda"
      />
    </div>
  );
}
