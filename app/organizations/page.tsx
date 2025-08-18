"use client";

import { useState } from "react";
import { OrganizationTable } from "@/components/organizations/organization-table";
import { OrganizationModal } from "@/components/organizations/organization-modal";
import { ConfirmationDialog } from "@/ui/confirmation-dialog";

interface Organization {
  id: string;
  name: string;
  type: string;
  parentOrganization?: string;
  createdDate: string;
  status: "active" | "inactive";
}

const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "Milliy statistika qo'mitasi",
    type: "qo'mita",
    createdDate: "12.05.2025",
    status: "active",
  },
  {
    id: "2",
    name: "Iqtisodiyot va moliya vazirligi",
    type: "vazirlik",
    parentOrganization: "Vazirlar mahkamasi",
    createdDate: "12.05.2025",
    status: "active",
  },
  {
    id: "3",
    name: "Davlat soliq qo'mitasi",
    type: "qo'mita",
    parentOrganization: "Iqtisodiyot va moliya vazirligi",
    createdDate: "12.05.2025",
    status: "active",
  },
  {
    id: "4",
    name: "Toshkent shahar statistika bo'limi",
    type: "bo'lim",
    parentOrganization: "Milliy statistika qo'mitasi",
    createdDate: "12.05.2025",
    status: "active",
  },
  {
    id: "5",
    name: "Hududlarni rivojlantirish agentligi",
    type: "agentlik",
    parentOrganization: "Iqtisodiyot va moliya vazirligi",
    createdDate: "12.05.2025",
    status: "inactive",
  },
];

export default function OrganizationsPage() {
  const [organizations, setOrganizations] =
    useState<Organization[]>(mockOrganizations);
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

  const handleCreateOrganization = () => {
    setModalMode("create");
    setEditingOrganization(undefined);
    setIsModalOpen(true);
  };

  const handleEditOrganization = (organization: Organization) => {
    setModalMode("edit");
    setEditingOrganization(organization);
    setIsModalOpen(true);
  };

  const handleSaveOrganization = (
    organizationData: Omit<Organization, "id" | "createdDate">
  ) => {
    if (modalMode === "create") {
      const newOrganization: Organization = {
        ...organizationData,
        id: Date.now().toString(),
        createdDate: new Date().toLocaleDateString("en-GB"),
      };
      setOrganizations((prev) => [newOrganization, ...prev]);
    } else if (editingOrganization) {
      setOrganizations((prev) =>
        prev.map((org) =>
          org.id === editingOrganization.id
            ? { ...org, ...organizationData }
            : org
        )
      );
    }
    setSelectedIds([]);
  };

  const handleDeleteOrganization = (organizationId: string) => {
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

  const confirmDelete = () => {
    if (deleteConfirmation.isBulk) {
      setOrganizations((prev) =>
        prev.filter((org) => !selectedIds.includes(org.id))
      );
      setSelectedIds([]);
    } else if (deleteConfirmation.organizationId) {
      setOrganizations((prev) =>
        prev.filter((org) => org.id !== deleteConfirmation.organizationId)
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
            <span className="text-[#1f2937]">Tashkilotlar</span>
          </nav>
          <h1 className="text-2xl font-bold text-[#1f2937]">Tashkilotlar</h1>
        </div>
      </div>

      <OrganizationTable
        organizations={organizations}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onEdit={handleEditOrganization}
        onDelete={handleDeleteOrganization}
        onBulkDelete={handleBulkDelete}
        onCreateNew={handleCreateOrganization}
      />

      <OrganizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveOrganization}
        organization={editingOrganization}
        mode={modalMode}
      />

      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false })}
        onConfirm={confirmDelete}
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
      />
    </div>
  );
}
