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
import { Checkbox } from "@/ui/checkbox";
import { Card } from "@/ui/card";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  user?: any;
  onSubmit: (formData: any) => void;
}

const departments = [
  { value: "statistics", label: "Statistika" },
  { value: "analytics", label: "Analitika" },
  { value: "planning", label: "Rejalashtirish" },
  { value: "monitoring", label: "Monitoring" },
];

const roles = [
  { value: "admin", label: "Administrator" },
  { value: "operator", label: "Operator" },
  { value: "analyst", label: "Tahlilchi" },
  { value: "viewer", label: "Kuzatuvchi" },
];

export function UserModal({
  isOpen,
  onClose,
  mode,
  user,
  onSubmit,
}: UserModalProps) {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    department: "",
    organization: "Milliy statistika qo'mitasi",
    login: "",
    password: "",
    role: "",
    status: "active",
  });

  useEffect(() => {
    if (mode === "edit" && user) {
      setFormData({
        lastName: user.name.split(" ")[0] || "",
        firstName: user.name.split(" ")[1] || "",
        middleName: user.name.split(" ")[2] || "",
        department: user.department,
        organization: "Milliy statistika qo'mitasi",
        login: user.login,
        password: "",
        role: user.role,
        status: user.status,
      });
    } else {
      setFormData({
        lastName: "",
        firstName: "",
        middleName: "",
        department: "",
        organization: "Milliy statistika qo'mitasi",
        login: "",
        password: "",
        role: "",
        status: "active",
      });
    }
  }, [mode, user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const title =
    mode === "create"
      ? "Yangi foydalanuvchi yaratish"
      : "Foydalanuvchi ma'lumotlarini tahrirlash";
  const submitText = mode === "create" ? "Saqlash" : "Yangilash";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <Card className="border-none p-0 mt-4">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Familiyasi
              </Label>
              <Input
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Ismi
              </Label>
              <Input
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Sharifi
              </Label>
              <Input
                value={formData.middleName}
                onChange={(e) =>
                  setFormData({ ...formData, middleName: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Boshqarma/bo'lim
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  setFormData({ ...formData, department: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Bo'lim tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Tashkilot
              </Label>
              <Input value={formData.organization} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Login
              </Label>
              <Input
                value={formData.login}
                onChange={(e) =>
                  setFormData({ ...formData, login: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Parol
              </Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={mode === "create"}
                placeholder={
                  mode === "edit"
                    ? "Yangi parol (bo'sh qoldirilsa o'zgarmaydi)"
                    : ""
                }
              />
            </div>
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Rol
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rol tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((opt) => (
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
                    setFormData({ ...formData, status: e.target.value })
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
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-4 h-4 text-[var(--primary)] border-gray-300 focus:ring-[var(--primary)]"
                />
                <span className="text-[var(--foreground)] text-sm">Nofaol</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
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
