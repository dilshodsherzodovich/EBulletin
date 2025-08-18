"use client";

import { useState } from "react";
import { ClassificatorTable } from "@/components/classificators/classificator-table";
import { ClassificatorModal } from "@/components/classificators/classificator-modal";
import { ConfirmationDialog } from "@/ui/confirmation-dialog";

interface Classificator {
  id: string;
  name: string;
  createdDate: string;
  status: "active" | "inactive";
}

const mockClassificators: Classificator[] = [
  {
    id: "1",
    name: "Shahar rejalashtirish klassifikatoru",
    createdDate: "01.06.2025",
    status: "active",
  },
  {
    id: "2",
    name: "Iqtisodiy faoliyat klassifikatoru",
    createdDate: "01.06.2025",
    status: "active",
  },
  {
    id: "3",
    name: "Statistik ma'lumotlar klassifikatoru",
    createdDate: "01.06.2025",
    status: "active",
  },
  {
    id: "4",
    name: "Ma'muriy bo'linish klassifikatoru",
    createdDate: "01.06.2025",
    status: "active",
  },
  {
    id: "5",
    name: "Hududiy rivojlanish klassifikatoru",
    createdDate: "01.06.2025",
    status: "inactive",
  },
];

export default function ClassificatorsPage() {
  const [classificators, setClassificators] =
    useState<Classificator[]>(mockClassificators);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingClassificator, setEditingClassificator] = useState<
    Classificator | undefined
  >();
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    classificatorId?: string;
    isBulk?: boolean;
  }>({ isOpen: false });

  const handleCreateClassificator = () => {
    setModalMode("create");
    setEditingClassificator(undefined);
    setIsModalOpen(true);
  };

  const handleEditClassificator = (classificator: Classificator) => {
    setModalMode("edit");
    setEditingClassificator(classificator);
    setIsModalOpen(true);
  };

  const handleSaveClassificator = (
    classificatorData: Omit<Classificator, "id" | "createdDate">
  ) => {
    if (modalMode === "create") {
      const newClassificator: Classificator = {
        ...classificatorData,
        id: Date.now().toString(),
        createdDate: new Date().toLocaleDateString("en-GB"),
      };
      setClassificators((prev) => [newClassificator, ...prev]);
    } else if (editingClassificator) {
      setClassificators((prev) =>
        prev.map((cls) =>
          cls.id === editingClassificator.id
            ? { ...cls, ...classificatorData }
            : cls
        )
      );
    }
    setSelectedIds([]);
  };

  const handleDeleteClassificator = (classificatorId: string) => {
    setDeleteConfirmation({
      isOpen: true,
      classificatorId,
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
      setClassificators((prev) =>
        prev.filter((cls) => !selectedIds.includes(cls.id))
      );
      setSelectedIds([]);
    } else if (deleteConfirmation.classificatorId) {
      setClassificators((prev) =>
        prev.filter((cls) => cls.id !== deleteConfirmation.classificatorId)
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
            <span className="text-[#1f2937]">Klassifikatorlar</span>
          </nav>
          <h1 className="text-2xl font-bold text-[#1f2937]">
            Klassifikatorlar
          </h1>
        </div>
      </div>

      <ClassificatorTable
        classificators={classificators}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onEdit={handleEditClassificator}
        onDelete={handleDeleteClassificator}
        onBulkDelete={handleBulkDelete}
        onCreateNew={handleCreateClassificator}
      />

      <ClassificatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveClassificator}
        classificator={editingClassificator}
        mode={modalMode}
      />

      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false })}
        onConfirm={confirmDelete}
        title={
          deleteConfirmation.isBulk
            ? "Klassifikatorlarni o'chirish"
            : "Klassifikatorni o'chirish"
        }
        message={
          deleteConfirmation.isBulk
            ? `Haqiqatan ham ${selectedIds.length} ta tanlangan klassifikatorni o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.`
            : "Haqiqatan ham bu klassifikatorni o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi."
        }
      />
    </div>
  );
}
