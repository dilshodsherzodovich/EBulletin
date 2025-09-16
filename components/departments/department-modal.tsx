"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/ui/modal";
import { Input } from "@/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/ui/select";
import { Button } from "@/ui/button";
import { Label } from "@/ui/label";
import { Card } from "@/ui/card";
import { Department, DepartmentCreateParams } from "@/api/types/deparments";
import { useOrganizations } from "@/api/hooks/use-organizations";

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (department: DepartmentCreateParams) => void;
  department?: Department | null;
  mode: "create" | "edit";
  isDoingAction: boolean;
}

export function DepartmentModal({
  isOpen,
  onClose,
  onSave,
  department,
  mode,
  isDoingAction,
}: DepartmentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
  });

  const { data: organizationsData, isPending } = useOrganizations({
    no_page: true,
  });

  // Initialize form data when modal opens, department changes, or organizations load
  useEffect(() => {
    if (department && mode === "edit") {
      setFormData({
        name: department.name,
        organization: department.organization_id,
      });
    } else if (mode === "create") {
      setFormData({
        name: "",
        organization: "",
      });
    }
  }, [department, mode, isOpen, organizationsData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData?.name.trim()!,
      organization_id: formData.organization,
    });
  };

  const handleClose = () => {
    setFormData({
      name: "",
      organization: "",
    });
    onClose();
  };

  const title =
    mode === "create"
      ? "Quyi tashkilot yaratish"
      : "Quyi tashkilotni tahrirlash";
  const submitText = mode === "create" ? "Yaratish" : "O'zgarishlarni saqlash";
  const actionText = mode === "create" ? "Yaratilmmoqda" : "O'zgartirilmoqda";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="md">
      <Card className="border-none p-0 mt-4">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-2">
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Quyi tashkilot nomi
              </Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Quyi tashkilot nomini kiriting"
                required
              />
            </div>
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Quyi tashkilot tegishli tashkilot
              </Label>
              <Select
                value={formData.organization}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, organization: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tashkilot tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {organizationsData?.results?.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Bekor qilish
            </Button>
            <Button
              type="submit"
              className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-8"
              disabled={isDoingAction}
            >
              {isDoingAction ? actionText : submitText}
            </Button>
          </div>
        </form>
      </Card>
    </Modal>
  );
}
