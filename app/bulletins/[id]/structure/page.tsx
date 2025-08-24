"use client";

import { useState } from "react";
import { use } from "react";
import { BulletinStructureTable } from "@/components/bulletin-structure/bulletin-structure-table";
import { BulletinStructureModal } from "@/components/bulletin-structure/bulletin-structure-modal";
import { ConfirmationDialog } from "@/ui/confirmation-dialog";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";

interface BulletinField {
  id: string;
  order: number;
  name: string;
  type: "number" | "text" | "date" | "classificator" | "file";
  classificatorId?: string;
  classificatorName?: string;
}

interface Bulletin {
  id: string;
  name: string;
  category: string;
  createdDate: string;
  responsibleDepartment: string;
  receivingOrganizations: string[];
  responsiblePersons: string[];
  periodType: string;
}

export default function BulletinStructurePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [fields, setFields] = useState<BulletinField[]>([
    {
      id: "1",
      order: 1,
      name: "Tartib raqami",
      type: "number",
    },
    {
      id: "2",
      order: 2,
      name: "Joylashish muddati (klassifikator)",
      type: "classificator",
      classificatorId: "class1",
      classificatorName: "Muddatiy klassifikator",
    },
    {
      id: "3",
      order: 3,
      name: "Tashkilotning identifikatsion xos raqami (STIR)",
      type: "text",
    },
    {
      id: "4",
      order: 4,
      name: "Tashkilotning nomi",
      type: "text",
    },
    {
      id: "5",
      order: 5,
      name: "Tashkilotning idoraviy mansubligi (DBIBT)",
      type: "text",
    },
    {
      id: "6",
      order: 6,
      name: "Tashkilotni reestrga kiritish uchun asos bo'ladigan hujjat nomi",
      type: "text",
    },
    {
      id: "7",
      order: 7,
      name: "Tashkilotni reestrga kiritish uchun asos bo'ladigan hujjat sanasi",
      type: "date",
    },
    {
      id: "8",
      order: 8,
      name: "Tashkilotni reestrga kiritish uchun asos bo'ladigan hujjat tartib raqami",
      type: "number",
    },
    {
      id: "9",
      order: 9,
      name: "Majburiy tarqatmaning xos raqami (klassifikator - jadval, statistik byulleten va h.k.)",
      type: "classificator",
      classificatorId: "class2",
      classificatorName: "Tarqatma turlari",
    },
    {
      id: "10",
      order: 10,
      name: "Rasmiy statistika ma'lumotlarini tarqatish shaklining xos raqami (klassifikator - qog'oz, elektron)",
      type: "classificator",
      classificatorId: "class3",
      classificatorName: "Tarqatish shakllari",
    },
    {
      id: "11",
      order: 11,
      name: "Reestrni Statistika dasturining ma'lumotlar bazasi xos raqamlari bilan o'zaro bog'lanish uchun yordamchi xos raqamlar",
      type: "text",
    },
    {
      id: "12",
      order: 12,
      name: "Qo'shimcha ma'lumotlar",
      type: "text",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedField, setSelectedField] = useState<BulletinField | undefined>(
    undefined
  );
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<BulletinField | null>(
    null
  );

  // Mock bulletin data - in real app this would come from API
  const bulletin: Bulletin = {
    id: id,
    name: "Qashqadaryo viloyatining 2025 yil 1-yarim yilligi hisoboti",
    category: "Qishloq xo'jaligi",
    createdDate: "01.06.2025",
    responsibleDepartment: "Qishloq xo'jaligi bo'limi",
    receivingOrganizations: ["org1", "org2"],
    responsiblePersons: ["person1", "person2"],
    periodType: "Yarim yillik",
  };

  const handleReorderFields = (reorderedFields: BulletinField[]) => {
    setFields(reorderedFields);
  };

  const handleEditField = (field: BulletinField) => {
    setSelectedField(field);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleDeleteField = (field: BulletinField) => {
    setFieldToDelete(field);
    setShowDeleteConfirmation(true);
  };

  const handleCreateNew = () => {
    setSelectedField(undefined);
    setModalMode("create");
    setShowModal(true);
  };

  const handleModalSubmit = (data: any) => {
    if (modalMode === "create") {
      const newField: BulletinField = {
        id: Date.now().toString(),
        order: fields.length + 1,
        name: data.name,
        type: data.type,
        classificatorId:
          data.type === "classificator" ? data.classificatorId : undefined,
        classificatorName:
          data.type === "classificator" ? data.classificatorName : undefined,
      };
      setFields([...fields, newField]);
    } else if (modalMode === "edit" && selectedField) {
      const updatedFields = fields.map((f) =>
        f.id === selectedField.id
          ? {
              ...f,
              name: data.name,
              type: data.type,
              classificatorId:
                data.type === "classificator"
                  ? data.classificatorId
                  : undefined,
              classificatorName:
                data.type === "classificator"
                  ? data.classificatorName
                  : undefined,
            }
          : f
      );
      setFields(updatedFields);
    }
    setShowModal(false);
  };

  const confirmDelete = () => {
    if (fieldToDelete) {
      setFields(fields.filter((f) => f.id !== fieldToDelete.id));
      setFieldToDelete(null);
      setShowDeleteConfirmation(false);
    }
  };

  const cancelDelete = () => {
    setFieldToDelete(null);
    setShowDeleteConfirmation(false);
  };

  const handleSaveStructure = () => {
    // In real app, this would save to backend
    console.log("Saving bulletin structure:", fields);
    alert("Byulleten struktura saqlandi!");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-[var(--muted-foreground)]">
        <Link
          href="/bulletins"
          className="hover:text-[var(--foreground)] transition-colors"
        >
          Byulletenlar
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          href={`/bulletins/${id}`}
          className="hover:text-[var(--foreground)] transition-colors"
        >
          {bulletin.name}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[var(--foreground)]">Struktura</span>
      </nav>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/bulletins`}
            className="p-2 hover:bg-[var(--muted)]/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--muted-foreground)]" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">
              Byulleten struktura
            </h1>
            <p className="text-[var(--muted-foreground)] mt-2">
              {bulletin.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-[var(--muted-foreground)]">
            {fields.length} ta maydon
          </div>
          <button
            onClick={handleSaveStructure}
            className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-6 py-2 rounded-lg font-medium"
          >
            Saqlash
          </button>
        </div>
      </div>

      <BulletinStructureTable
        fields={fields}
        onReorder={handleReorderFields}
        onEdit={handleEditField}
        onDelete={handleDeleteField}
        onCreateNew={handleCreateNew}
      />

      <BulletinStructureModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        mode={modalMode}
        field={selectedField}
      />

      <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Maydonni o'chirish"
        message={`"${fieldToDelete?.name}" maydonni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.`}
        confirmText="O'chirish"
        cancelText="Bekor qilish"
        variant="danger"
      />
    </div>
  );
}
