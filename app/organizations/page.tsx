"use client";

import { useState } from "react";
import { OrganizationTable } from "@/components/organizations/organization-table";
import { OrganizationModal } from "@/components/organizations/organization-modal";
import { ConfirmationDialog } from "@/ui/confirmation-dialog";
import {
  useCreateOrganization,
  useDeleteOrganization,
  useEditOrganization,
  useOrganizations,
} from "@/api/hooks/use-organizations";
import {
  Organization,
  OrganizationCreateParams,
} from "@/api/types/organizations";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/api/querykey";

export default function OrganizationsPage() {
  const queryClient = useQueryClient();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingOrganization, setEditingOrganization] = useState<
    Organization | undefined
  >();
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    organizationId?: string;
    isBulk?: boolean;
  }>({ isOpen: false });

  const {
    data: organizationsList,
    isPending,
    isFetching,
  } = useOrganizations({ page: 1 });

  const { mutate: createOrganization, isPending: isCreatingOrg } =
    useCreateOrganization();
  const { mutate: editOrganization, isPending: isEditingOrg } =
    useEditOrganization();
  const { mutate: deleteOrganization, isPending: isDeletingOrg } =
    useDeleteOrganization();

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setEditingOrganization(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (organization: Organization) => {
    setModalMode("edit");
    setEditingOrganization(organization);
    setIsModalOpen(true);
  };

  const handleSaveOrganization = (
    organizationData: OrganizationCreateParams
  ) => {
    if (modalMode === "create") {
      createOrganization(organizationData, {
        onSuccess: () => {
          toast.success("Tashkilot muvaffaqiyatli qo'shildi!");
        },
        onError: (error) => {
          toast.error(`Xatolik yuz berdi: ${error.message}`);
        },
        onSettled: () => {
          setIsModalOpen(false);
          queryClient.invalidateQueries({
            queryKey: [queryKeys.organizations.list],
          });
        },
      });
    } else if (editingOrganization) {
      editOrganization(
        { id: editingOrganization.id, ...organizationData },
        {
          onSuccess: () => {
            toast.success("Tashkilot ma'lumotlari muvaffaqiyatli tahrirlandi!");
          },
          onError: (error) => {
            toast.error(`Xatolik yuz berdi: ${error.message}`);
          },
          onSettled: () => {
            setIsModalOpen(false);
            setEditingOrganization(undefined);
            queryClient.invalidateQueries({
              queryKey: [queryKeys.organizations.list],
            });
          },
        }
      );
    }
    setSelectedIds([]);
  };

  const handelOpenDeleteModal = (organizationId: string) => {
    setDeleteConfirmation({
      isOpen: true,
      organizationId,
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
    } else if (deleteConfirmation.organizationId) {
      deleteOrganization(deleteConfirmation.organizationId, {
        onSuccess: () => {
          toast.success("Tashkilot muvaffaqiyatli o'chirildi!");
        },
        onError: (error) => {
          toast.error(`Xatolik yuz berdi: ${error.message}`);
        },
        onSettled: () => {
          setDeleteConfirmation({ isOpen: false });
          queryClient.invalidateQueries({
            queryKey: [queryKeys.organizations.list],
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
            <span className="text-[#1f2937]">Tashkilotlar</span>
          </nav>
          <h1 className="text-2xl font-bold text-[#1f2937]">Tashkilotlar</h1>
        </div>
      </div>

      <OrganizationTable
        organizations={organizationsList!}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onEdit={handleOpenEditModal}
        onDelete={handelOpenDeleteModal}
        onBulkDelete={handleBulkDelete}
        onCreateNew={handleOpenCreateModal}
      />

      <OrganizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveOrganization}
        organization={editingOrganization}
        mode={modalMode}
        isDoingAction={isCreatingOrg || isEditingOrg}
      />

      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false })}
        onConfirm={handleDelete}
        title={
          deleteConfirmation.isBulk
            ? "Tashkilotlarni o'chirish"
            : "Tashkilotni o'chirish"
        }
        message={
          deleteConfirmation.isBulk
            ? `Haqiqatan ham ${selectedIds.length} ta tanlangan tashkilotni o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.`
            : "Haqiqatan ham bu tashkilotni o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi."
        }
        isDoingAction={isDeletingOrg}
      />
    </div>
  );
}
