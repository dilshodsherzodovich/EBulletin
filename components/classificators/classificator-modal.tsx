"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/ui/modal";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Label } from "@/ui/label";
import { Card } from "@/ui/card";

interface Classificator {
  id: string;
  name: string;
  createdDate: string;
  status: "active" | "inactive";
}

interface ClassificatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Classificator, "id" | "createdDate">) => void;
  classificator?: Classificator;
  mode: "create" | "edit";
}

export function ClassificatorModal({
  isOpen,
  onClose,
  onSave,
  classificator,
  mode,
}: ClassificatorModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    if (mode === "edit" && classificator) {
      setFormData({
        name: classificator.name,
        status: classificator.status,
      });
    } else {
      setFormData({
        name: "",
        status: "active",
      });
    }
  }, [mode, classificator, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleClose = () => {
    onClose();
    setFormData({
      name: "",
      status: "active",
    });
  };

  const title =
    mode === "create" ? "Klassifikator yaratish" : "Klassifikatorni tahrirlash";
  const submitText = mode === "create" ? "Yaratish" : "O'zgarishlarni saqlash";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <Card className="border-none p-0 mt-4">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Klassifikator nomi
              </Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Klassifikator nomini kiriting"
                required
              />
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
                  <span className="text-[var(--foreground)] text-sm">
                    Nofaol
                  </span>
                </label>
              </div>
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
