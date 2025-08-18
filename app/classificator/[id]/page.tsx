"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/ui/breadcrumb";
import { EnhancedCard } from "@/ui/enhanced-card";
import { EnhancedInput } from "@/ui/enhanced-input";
import { EnhancedButton } from "@/ui/enhanced-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { ClassificatorElementModal } from "@/components/classificators/classificator-element-modal";
import { ConfirmationDialog } from "@/ui/confirmation-dialog";

interface ClassificatorElement {
  id: string;
  name: string;
}

const mockElements: ClassificatorElement[] = [
  { id: "1", name: "Elektron" },
  { id: "2", name: "Qog'oz" },
];

export default function ClassificatorDetailPage() {
  const params = useParams();
  const classificatorId = params.id as string;

  const [elements, setElements] =
    useState<ClassificatorElement[]>(mockElements);
  const [selectedType, setSelectedType] = useState("individual");
  const [information, setInformation] = useState("");

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

  const handleDeleteElement = (elementId: string) => {
    setElementToDelete(elementId);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveElement = (data: Omit<ClassificatorElement, "id">) => {
    if (modalMode === "create") {
      const newElement: ClassificatorElement = {
        id: Date.now().toString(),
        ...data,
      };
      setElements([...elements, newElement]);
    } else if (selectedElement) {
      setElements(
        elements.map((el) =>
          el.id === selectedElement.id ? { ...el, ...data } : el
        )
      );
    }
  };

  const confirmDelete = () => {
    if (elementToDelete) {
      setElements(elements.filter((el) => el.id !== elementToDelete));
      setElementToDelete(null);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleSave = () => {
    // Handle saving the classificator configuration
    console.log("Saving classificator configuration:", {
      type: selectedType,
      information,
      elements,
    });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Asosiy</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/classificators">
              Klassifikator
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Klassifikator yaratish</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-[#1f2937]">
        {classificatorName}
      </h1>

      {/* Main Content */}
      <EnhancedCard>
        <div className="space-y-6">
          {/* Type Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="classificator-type"
                  value="individual"
                  checked={selectedType === "individual"}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-4 h-4 text-[#2354bf] border-[#d1d5db] focus:ring-[#2354bf]"
                />
                <span className="text-[#374151]">Alohida</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="classificator-type"
                  value="template"
                  checked={selectedType === "template"}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-4 h-4 text-[#2354bf] border-[#d1d5db] focus:ring-[#2354bf]"
                />
                <span className="text-[#374151]">Shablon</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="classificator-type"
                  value="term-control"
                  checked={selectedType === "term-control"}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-4 h-4 text-[#2354bf] border-[#d1d5db] focus:ring-[#2354bf]"
                />
                <span className="text-[#374151]">Muddat nazorati</span>
              </label>
            </div>
          </div>

          {/* Information Input */}
          <div className="space-y-2">
            <EnhancedInput
              value={information}
              onChange={(e) => setInformation(e.target.value)}
              placeholder="Ma'lumot kiriting"
              className="max-w-md"
            />
          </div>

          {/* Add Button */}
          <div className="flex justify-end">
            <EnhancedButton
              onClick={handleCreateElement}
              className="bg-[#6b7280] hover:bg-[#4b5563] text-white"
            >
              Qo'shish +
            </EnhancedButton>
          </div>

          {/* Elements Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f9fafb]">
                  <TableHead className="w-16 text-center">#</TableHead>
                  <TableHead>Element nomi</TableHead>
                  <TableHead className="w-24 text-center">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {elements.map((element, index) => (
                  <TableRow key={element.id} className="hover:bg-[#f9fafb]">
                    <TableCell className="text-center font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell>{element.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditElement(element)}
                          className="p-1 text-[#6b7280] hover:text-[#2354bf] transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteElement(element.id)}
                          className="p-1 text-[#6b7280] hover:text-[#dc2626] transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <EnhancedButton
              onClick={handleSave}
              className="bg-[#2354bf] hover:bg-[#1148ae] text-white px-8"
            >
              Saqlash
            </EnhancedButton>
          </div>
        </div>
      </EnhancedCard>

      {/* Modals */}
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
        description="Haqiqatan ham bu elementni o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi."
      />
    </div>
  );
}
