"use client";

import { useState } from "react";
import { ClassificatorTable } from "@/components/classificators/classificator-table";
import { ClassificatorModal } from "@/components/classificators/classificator-modal";
import { ConfirmationDialog } from "@/ui/confirmation-dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { classificatorService } from "@/api/services/classificator.service";
import {
  useBulkDeleteClassificators,
  useCreateClassificator,
  useDeleteClassificator,
  useEditClassificator,
  useGetClassificators,
} from "@/api/hooks/use-classificator";
import {
  ClassificatorCreateParams,
  Classificator,
} from "@/api/types/classificator";
import { queryKeys } from "@/api/querykey";
import { useSnackbar } from "@/providers/snackbar-provider";

export default function ClassificatorsPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const queryClient = useQueryClient();

  const { showSuccess, showError } = useSnackbar();

  const [editingClassificator, setEditingClassificator] = useState<
    Classificator | undefined
  >();
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    classificatorId?: string;
    isBulk?: boolean;
  }>({ isOpen: false });

  const {
    data: classificatorsData,
    isLoading,
    isError,
  } = useGetClassificators({
    page: 1,
  });

  const { mutate: createClassificator, isPending: isCreating } =
    useCreateClassificator();
  const { mutate: editClassificator, isPending: isEditing } =
    useEditClassificator();
  const { mutate: deleteClassificator, isPending: isDeleting } =
    useDeleteClassificator();
  const { mutate: bulkDeleteClassificators, isPending: isBulkDeleting } =
    useBulkDeleteClassificators();

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setEditingClassificator(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (classificator: Classificator) => {
    setModalMode("edit");
    setEditingClassificator(classificator);
    setIsModalOpen(true);
  };

  const handleSaveClassificator = (
    classificatorData: ClassificatorCreateParams
  ) => {
    if (modalMode === "create") {
      createClassificator(classificatorData, {
        onSuccess: () => {
          setIsModalOpen(false);
          showSuccess("Klassifikator muvaffaqiyatli yaratildi");
        },
        onError: () => {
          showError("Klassifikator yaratishda xatolik yuz berdi");
        },
      });
    } else if (editingClassificator) {
      editClassificator(
        {
          id: editingClassificator.id,
          data: classificatorData,
        },
        {
          onSuccess: (data) => {
            queryClient.setQueryData(
              [queryKeys.classificators.list],
              (oldData: Classificator[]) => {
                return oldData.map((classificator: Classificator) => {
                  if (classificator.id === data.id) {
                    return data;
                  }
                  return classificator;
                });
              }
            );
            showSuccess("Klassifikator muvaffaqiyatli tahrirlandi");
          },
          onError: () => {
            showError("Klassifikator tahrirlashda xatolik yuz berdi");
          },
        }
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
      bulkDeleteClassificators(selectedIds, {
        onSuccess: () => {
          showSuccess("Klassifikatorlar muvaffaqiyatli o'chirildi");
        },
        onError: () => {
          showError("Klassifikatorlar o'chirishda xatolik yuz berdi");
        },
      });
      setSelectedIds([]);
    } else if (deleteConfirmation.classificatorId) {
      deleteClassificator(deleteConfirmation.classificatorId);
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
        classificators={classificatorsData?.results || []}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteClassificator}
        onBulkDelete={handleBulkDelete}
        onCreateNew={handleOpenCreateModal}
        isLoading={isLoading}
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
        isDoingAction={isDeleting || isBulkDeleting}
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
