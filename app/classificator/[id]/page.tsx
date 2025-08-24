"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ClassificatorElementModal } from "@/components/classificator-element/classificator-element-modal";
import { ConfirmationDialog } from "@/ui/confirmation-dialog";
import { ClassificatorTable } from "@/components/classificator-element/classificator-table";

interface ClassificatorElement {
  id: string;
  name: string;
  type: string;
  createdDate: string;
}

const mockElements: ClassificatorElement[] = [
  {
    id: "1",
    name: "Elektron",
    type: "individual",
    createdDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Qog'oz",
    type: "template",
    createdDate: "2024-01-16",
  },
  {
    id: "3",
    name: "Raqamli",
    type: "term-control",
    createdDate: "2024-01-17",
  },
];

export default function ClassificatorDetailPage() {
  const params = useParams();
  const classificatorId = params.id as string;

  const [elements, setElements] =
    useState<ClassificatorElement[]>(mockElements);

  // Modal states
  const [isElementModalOpen, setIsElementModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedElement, setSelectedElement] = useState<
    ClassificatorElement | undefined
  >();
  const [elementToDelete, setElementToDelete] = useState<string | null>(null);

  const classificatorName = "Hujjat turi";

  const handleCreateElement = () => {
    setModalMode("create");
    setSelectedElement(undefined);
    setIsElementModalOpen(true);
  };

  const handleEditElement = (element: ClassificatorElement) => {
    setModalMode("edit");
    setSelectedElement(element);
    setIsElementModalOpen(true);
  };

  const handleDeleteElement = (element: ClassificatorElement) => {
    setElementToDelete(element.id);
    setIsDeleteDialogOpen(true);
  };

  const handleBulkDelete = (elementIds: string[]) => {
    setElements(elements.filter((el) => !elementIds.includes(el.id)));
  };

  const handleSaveElement = (
    data: Omit<ClassificatorElement, "id"> | Omit<ClassificatorElement, "id">[]
  ) => {
    if (modalMode === "create") {
      // Handle bulk creation
      if (Array.isArray(data)) {
        const newElements: ClassificatorElement[] = data.map(
          (elementData, index) => ({
            id: (Date.now() + index).toString(),
            ...elementData,
          })
        );
        setElements([...elements, ...newElements]);
      } else {
        // Handle single element creation
        const newElement: ClassificatorElement = {
          id: Date.now().toString(),
          ...data,
        };
        setElements([...elements, newElement]);
      }
    } else if (selectedElement) {
      // Handle edit (single element)
      if (!Array.isArray(data)) {
        setElements(
          elements.map((el) =>
            el.id === selectedElement.id ? { ...el, ...data } : el
          )
        );
      }
    }
  };

  const confirmDelete = () => {
    if (elementToDelete) {
      setElements(elements.filter((el) => el.id !== elementToDelete));
      setElementToDelete(null);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <nav className="flex items-center space-x-2 text-sm text-[#6b7280] mb-2">
            <span>Asosiy</span>
            <span>›</span>
            <span>Klassifikator</span>
            <span>›</span>
            <span className="text-[#1f2937]">{classificatorName}</span>
          </nav>
          <h1 className="text-2xl font-bold text-[#1f2937]">
            {classificatorName}
          </h1>
        </div>
      </div>

      <ClassificatorTable
        elements={elements}
        onEdit={handleEditElement}
        onDelete={handleDeleteElement}
        onBulkDelete={handleBulkDelete}
        onCreateNew={handleCreateElement}
      />

      <ClassificatorElementModal
        isOpen={isElementModalOpen}
        onClose={() => setIsElementModalOpen(false)}
        onSave={handleSaveElement}
        element={selectedElement}
        mode={modalMode}
      />

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Elementni o'chirish"
        message="Haqiqatan ham bu elementni o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi."
      />
    </div>
  );
}
