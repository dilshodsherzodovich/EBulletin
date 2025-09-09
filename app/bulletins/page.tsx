"use client";

import { useState } from "react";
import { BulletinTable } from "@/components/bulletins/bulletin-table";
import { BulletinModal } from "@/components/bulletins/bulletin-modal";
import { ConfirmationDialog } from "@/ui/confirmation-dialog";
import {
  useBulletin,
  useCreateBulletin,
  useUpdateBulletin,
  useDeleteBulletin,
} from "@/api/hooks/use-bulletin";
import {
  Bulletin,
  BulletinCreateBody,
  BulletinDeadline,
  BulletinColumn,
} from "@/api/types/bulleten";
import { useSnackbar } from "@/providers/snackbar-provider";
import { ErrorCard } from "@/ui/error-card";

export default function BulletinsPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedBulletin, setSelectedBulletin] = useState<
    Bulletin | undefined
  >(undefined);

  const { data: bulletins, isPending, isError } = useBulletin({ page: 1 });
  const { mutate: createBulletin, isPending: isCreating } = useCreateBulletin();
  const { mutate: updateBulletin, isPending: isUpdating } = useUpdateBulletin();
  const { mutate: deleteBulletin, isPending: isDeleting } = useDeleteBulletin();

  const { showSuccess, showError } = useSnackbar();

  const handleSelectionChange = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const handleEdit = (bulletin: Bulletin) => {
    setSelectedBulletin(bulletin);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleDelete = (bulletin: Bulletin) => {
    deleteBulletin(bulletin.id, {
      onSuccess: () => {
        showSuccess("Byulleten muvaffaqiyatli o'chirildi");
        setShowDeleteConfirmation(false);
      },
      onError: () => {
        showError("Byulleten o'chirishda xatolik yuz berdi");
      },
    });
  };

  const handleBulkDelete = (ids: string[]) => {
    setShowDeleteConfirmation(true);
  };

  const handleBulkDeleteConfirm = (ids: string[]) => {
    // Delete each bulletin individually since the API doesn't support bulk delete
    ids.forEach((id) => deleteBulletin(id));
    setSelectedIds([]);
  };

  const handleCreateNew = () => {
    setSelectedBulletin(undefined);
    setModalMode("create");
    setShowModal(true);
  };

  const handleAssignResponsible = (bulletin: Bulletin) => {
    console.log("Assign responsible for bulletin:", bulletin);
    // TODO: Implement assign responsible functionality
  };

  const handleModalSubmit = (data: BulletinCreateBody) => {
    if (modalMode === "create") {
      createBulletin(data, {
        onSuccess: () => {
          setShowModal(false);
          showSuccess("Byulleten muvaffaqiyatli yaratildi");
        },
        onError: () => {
          showError("Byulleten yaratishda xatolik yuz berdi");
        },
      });
    } else if (modalMode === "edit" && selectedBulletin) {
      updateBulletin(
        { id: selectedBulletin.id, data: data },
        {
          onSuccess: () => {
            setShowModal(false);
            showSuccess("Byulleten muvaffaqiyatli tahrirlandi");
          },
          onError: () => {
            showError("Byulleten tahrirlashda xatolik yuz berdi");
          },
        }
      );
    }
  };

  const confirmBulkDelete = () => {
    handleBulkDeleteConfirm(selectedIds);
  };

  const cancelBulkDelete = () => {
    setShowDeleteConfirmation(false);
  };

  if (isError) {
    return (
      <ErrorCard
        title="Xatolik"
        message="Byulletenlar yuklanmadi"
        onRetry={() => {
          window.location.reload();
        }}
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Byulletenlar
          </h1>
          <p className="text-[var(--muted-foreground)] mt-2">
            Byulletenlar ro'yxatini boshqarish
          </p>
        </div>
      </div>

      <BulletinTable
        bulletins={bulletins?.results || []}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onCreateNew={handleCreateNew}
        onAssignResponsible={handleAssignResponsible}
        isLoading={isPending}
        isDeleting={isDeleting}
      />

      <BulletinModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        mode={modalMode}
        bulletin={selectedBulletin}
        isLoading={isCreating || isUpdating}
      />

      <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={cancelBulkDelete}
        onConfirm={confirmBulkDelete}
        title="Byulletenlarni o'chirish"
        message={`${selectedIds.length} ta byulletenni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.`}
        confirmText="O'chirish"
        cancelText="Bekor qilish"
        variant="danger"
      />
    </div>
  );
}
