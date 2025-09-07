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
import { toast } from "sonner";

// Keep the mock data for now
interface User {
  id: string;
  name: string;
  role: string;
  department: string;
  createdDate: string;
  status: "active" | "inactive";
  login: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Umarov A.Kh.",
    role: "Administrator",
    department: "Statistika",
    createdDate: "12.05.2025",
    status: "active",
    login: "a.umarov",
  },
  {
    id: "2",
    name: "Karimov B.S.",
    role: "Operator",
    department: "Analitika",
    createdDate: "10.05.2025",
    status: "active",
    login: "b.karimov",
  },
  {
    id: "3",
    name: "Akhmedova S.N.",
    role: "Tahlilchi",
    department: "Rejalashtirish",
    createdDate: "08.05.2025",
    status: "inactive",
    login: "s.ahmedova",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    userId?: string;
    isBulk?: boolean;
  }>({ isOpen: false });

  // Use snackbar for notifications
  const { showSuccess, showError } = useSnackbar();

  const { data: usersList, isPending, isFetching } = useUsers();
  const { mutate: createUser, isPending: isCreatingUser } = useCreateUser();
  const { mutate: editUser, isPending: isEditingUser } = useUpdateUser();
  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteUser();

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setEditingUser(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setModalMode("edit");
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (userData: CreateUserRequest) => {
    if (modalMode === "create") {
      createUser(userData, {
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success("Foydalanuvchi muvaffaqiyatli yaratildi!");
        },
        onError: (error) => {
          toast.error(`Xatolik yuz berdi: ${error.message}`);
        },
      });
    } else if (editingUser) {
      editUser(
        { id: editingUser.id, userData },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingUser(undefined);
            toast.success("Foydalanuvchi muvaffaqiyatli yaratildi!");
          },
          onError: (error) => {
            toast.error(`Xatolik yuz berdi: ${error.message}`);
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
      toast.info("Bu funksiya tez orada qo'shiladi!");
    } else if (deleteConfirmation.userId) {
      deleteUser(deleteConfirmation.userId, {
        onSuccess: () => {
          toast.success("Foydalanuvchi muvaffaqiyatli o'chirildi");
          setDeleteConfirmation({ isOpen: false });
        },
        onError: (error) => {
          toast.error(`Xatolik yuz berdi: ${error.message}`);
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
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveUser}
        user={editingUser}
        mode={modalMode}
        isLoading={isCreatingUser || isDeletingUser}
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
