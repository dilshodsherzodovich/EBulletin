"use client";

import { useState } from "react";
import { Card } from "@/ui/card";
import { UserTable } from "@/components/users/user-table";
import { UserModal } from "@/components/users/user-modal";
import { ConfirmationDialog } from "@/ui/confirmation-dialog";

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

  const handleCreateUser = () => {
    setModalMode("create");
    setEditingUser(undefined);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setModalMode("edit");
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (userData: Omit<User, "id" | "createdDate">) => {
    if (modalMode === "create") {
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdDate: new Date().toLocaleDateString("en-GB"),
      };
      setUsers((prev) => [newUser, ...prev]);
    } else if (editingUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id ? { ...user, ...userData } : user
        )
      );
    }
    setSelectedIds([]);
  };

  const handleDeleteUser = (userId: string) => {
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

  const confirmDelete = () => {
    if (deleteConfirmation.isBulk) {
      setUsers((prev) => prev.filter((user) => !selectedIds.includes(user.id)));
      setSelectedIds([]);
    } else if (deleteConfirmation.userId) {
      setUsers((prev) =>
        prev.filter((user) => user.id !== deleteConfirmation.userId)
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
            <span className="text-[#1f2937]">Foydalanuvchilar</span>
          </nav>
          <h1 className="text-2xl font-bold text-[#1f2937]">
            Foydalanuvchilar
          </h1>
        </div>
      </div>

      <UserTable
        users={users}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onBulkDelete={handleBulkDelete}
        onCreateNew={handleCreateUser}
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveUser}
        user={editingUser}
        mode={modalMode}
      />

      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false })}
        onConfirm={confirmDelete}
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
      />
    </div>
  );
}
