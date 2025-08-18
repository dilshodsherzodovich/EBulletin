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

interface Department {
  id: string;
  name: string;
  organization: string;
  createdDate: string;
  status: "active" | "inactive";
}

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (department: Omit<Department, "id" | "createdDate">) => void;
  department?: Department | null;
  mode: "create" | "edit";
}

const organizations = [
  {
    value: "Milliy statistika qo'mitasi",
    label: "Milliy statistika qo'mitasi",
  },
  { value: "Iqtisodiyot vazirligi", label: "Iqtisodiyot vazirligi" },
  { value: "Moliya vazirligi", label: "Moliya vazirligi" },
];

export function DepartmentModal({
  isOpen,
  onClose,
  onSave,
  department,
  mode,
}: DepartmentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    organization: "Milliy statistika qo'mitasi",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    if (department && mode === "edit") {
      setFormData({
        name: department.name,
        organization: department.organization,
        status: department.status,
      });
    } else {
      setFormData({
        name: "",
        organization: "Milliy statistika qo'mitasi",
        status: "active",
      });
    }
  }, [department, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      organization: "Milliy statistika qo'mitasi",
      status: "active",
    });
    onClose();
  };

  const title = mode === "create" ? "Bo'lim yaratish" : "Bo'limni tahrirlash";
  const submitText = mode === "create" ? "Yaratish" : "O'zgarishlarni saqlash";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="md">
      <Card className="border-none p-0 mt-4">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-2">
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Bo'lim nomi
              </Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Bo'lim nomini kiriting"
                required
              />
            </div>
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Yuqori tashkilot
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
                  {organizations.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-sm text-[var(--muted-foreground)]">
              Holati
            </Label>
            <div className="flex items-center gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`status-${mode}`}
                  value="active"
                  checked={formData.status === "active"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "active" | "inactive",
                    })
                  }
                  className="w-4 h-4 text-[var(--primary)] border-gray-300 focus:ring-[var(--primary)]"
                />
                <span className="text-[var(--foreground)] text-sm">Faol</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`status-${mode}`}
                  value="inactive"
                  checked={formData.status === "inactive"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "active" | "inactive",
                    })
                  }
                  className="w-4 h-4 text-[var(--primary)] border-gray-300 focus:ring-[var(--primary)]"
                />
                <span className="text-[var(--foreground)] text-sm">Nofaol</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Bekor qilish
            </Button>
            <Button
              type="submit"
              className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-8"
            >
              {submitText}
            </Button>
          </div>
        </form>
      </Card>
    </Modal>
  );
}
