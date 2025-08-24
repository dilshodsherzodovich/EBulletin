"use client";

import { useState } from "react";
import { BulletinTable } from "@/components/bulletins/bulletin-table";
import { BulletinModal } from "@/components/bulletins/bulletin-modal";
import { ConfirmationDialog } from "@/ui/confirmation-dialog";

interface Bulletin {
  id: string;
  name: string;
  category: string;
  createdDate: string;
  responsibleAssigned: boolean;
  responsible: string;
  status: "active" | "inactive" | "completed";
  responsibleDepartment: string;
  receivingOrganizations: string[];
  responsiblePersons: string[];
  periodType: string;
}

export default function BulletinsPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedBulletin, setSelectedBulletin] = useState<
    Bulletin | undefined
  >(undefined);

  const [bulletins, setBulletins] = useState<Bulletin[]>([
    {
      id: "1",
      name: "Qashqadaryo viloyatining 2025 yil 1-yarim yilligi hisoboti",
      category: "Qishloq xo'jaligi",
      createdDate: "01.06.2025",
      responsibleAssigned: true,
      responsible: "Umarov A.P.",
      status: "active",
      responsibleDepartment: "Qishloq xo'jaligi bo'limi",
      receivingOrganizations: ["org1", "org2"],
      responsiblePersons: ["person1", "person2"],
      periodType: "Yarim yillik",
    },
    {
      id: "2",
      name: "San'at va madaniyat sohasidagi faoliyat hisoboti",
      category: "San'at",
      createdDate: "15.06.2025",
      responsibleAssigned: true,
      responsible: "Siddiqov M.R.",
      status: "completed",
      responsibleDepartment: "San'at bo'limi",
      receivingOrganizations: ["org3", "org4"],
      responsiblePersons: ["person3", "person4"],
      periodType: "Oylik",
    },
    {
      id: "3",
      name: "Tibbiyot xizmatlari sifatini oshirish bo'yicha hisoboti",
      category: "Tibbiyot",
      createdDate: "20.06.2025",
      responsibleAssigned: true,
      responsible: "Karimov Sh.T.",
      status: "active",
      responsibleDepartment: "Tibbiyot bo'limi",
      receivingOrganizations: ["org5"],
      responsiblePersons: ["person5"],
      periodType: "Haftalik",
    },
    {
      id: "4",
      name: "Ta'lim sohasidagi yangiliklar va rejalar",
      category: "Ta'lim",
      createdDate: "25.06.2025",
      responsibleAssigned: false,
      responsible: "",
      status: "inactive",
      responsibleDepartment: "Ta'lim bo'limi",
      receivingOrganizations: ["org6", "org7"],
      responsiblePersons: ["person6"],
      periodType: "Kunlik",
    },
    {
      id: "5",
      name: "Iqtisodiy rivojlanish va investitsiyalar hisoboti",
      category: "Iqtisodiyot",
      createdDate: "30.06.2025",
      responsibleAssigned: true,
      responsible: "Yusupov D.A.",
      status: "active",
      responsibleDepartment: "Iqtisodiyot bo'limi",
      receivingOrganizations: ["org8"],
      responsiblePersons: ["person7", "person8"],
      periodType: "Yillik",
    },
    {
      id: "6",
      name: "Qishloq xo'jaligi mahsulotlari eksporti hisoboti",
      category: "Qishloq xo'jaligi",
      createdDate: "05.07.2025",
      responsibleAssigned: true,
      responsible: "Rahimov T.S.",
      status: "active",
      responsibleDepartment: "Qishloq xo'jaligi bo'limi",
      receivingOrganizations: ["org1", "org3", "org5"],
      responsiblePersons: ["person1", "person3"],
      periodType: "Yarim yillik",
    },
    {
      id: "7",
      name: "Madaniy meros va tarixiy yodgorliklar hisoboti",
      category: "San'at",
      createdDate: "10.07.2025",
      responsibleAssigned: true,
      responsible: "Mirzaev K.X.",
      status: "completed",
      responsibleDepartment: "San'at bo'limi",
      receivingOrganizations: ["org2", "org4"],
      responsiblePersons: ["person2", "person4"],
      periodType: "Oylik",
    },
    {
      id: "8",
      name: "Xalq sog'lig'ini saqlash va tibbiyot xizmatlari",
      category: "Tibbiyot",
      createdDate: "15.07.2025",
      responsibleAssigned: false,
      responsible: "",
      status: "inactive",
      responsibleDepartment: "Tibbiyot bo'limi",
      receivingOrganizations: ["org6"],
      responsiblePersons: ["person6"],
      periodType: "Haftalik",
    },
  ]);

  const handleSelectionChange = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const handleEdit = (bulletin: Bulletin) => {
    setSelectedBulletin(bulletin);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleDelete = (bulletin: Bulletin) => {
    setBulletins(bulletins.filter((b) => b.id !== bulletin.id));
  };

  const handleBulkDelete = (ids: string[]) => {
    setShowDeleteConfirmation(true);
  };

  const handleBulkDeleteConfirm = (ids: string[]) => {
    setBulletins(bulletins.filter((b) => !ids.includes(b.id)));
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

  const handleModalSubmit = (data: any) => {
    if (modalMode === "create") {
      const newBulletin: Bulletin = {
        id: Date.now().toString(),
        name: data.name,
        category: data.responsibleDepartment, // Use department as category for display
        createdDate: new Date().toLocaleDateString("uz-UZ"),
        responsibleAssigned: data.responsiblePersons.length > 0,
        responsible:
          data.responsiblePersons.length > 0 ? data.responsiblePersons[0] : "",
        status: "active",
        responsibleDepartment: data.responsibleDepartment,
        receivingOrganizations: data.receivingOrganizations,
        responsiblePersons: data.responsiblePersons,
        periodType: data.periodType,
      };
      setBulletins([...bulletins, newBulletin]);
    } else if (modalMode === "edit" && selectedBulletin) {
      const updatedBulletins = bulletins.map((b) =>
        b.id === selectedBulletin.id
          ? {
              ...b,
              name: data.name,
              category: data.responsibleDepartment, // Update category to match department
              responsibleDepartment: data.responsibleDepartment,
              receivingOrganizations: data.receivingOrganizations,
              responsiblePersons: data.responsiblePersons,
              periodType: data.periodType,
              responsibleAssigned: data.responsiblePersons.length > 0,
              responsible:
                data.responsiblePersons.length > 0
                  ? data.responsiblePersons[0]
                  : "",
            }
          : b
      );
      setBulletins(updatedBulletins);
    }
    setShowModal(false);
  };

  const confirmBulkDelete = () => {
    handleBulkDeleteConfirm(selectedIds);
    setShowDeleteConfirmation(false);
  };

  const cancelBulkDelete = () => {
    setShowDeleteConfirmation(false);
  };

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
        bulletins={bulletins}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onCreateNew={handleCreateNew}
        onAssignResponsible={handleAssignResponsible}
      />

      <BulletinModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        mode={modalMode}
        bulletin={selectedBulletin}
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
