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

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  user?: any;
  onSubmit: (formData: any) => void;
  isLoading?: boolean;
}

const departments = [
  { value: "Moliya", label: "Moliya" },
  { value: "Analitika", label: "Analitika" },
  { value: "Rejalashtirish", label: "Rejalashtirish" },
  { value: "Monitoring", label: "Monitoring" },
];

const roles = [
  { value: "ADMIN", label: "Admin" },
  { value: "MODERATOR", label: "Moderator" },
  { value: "OBSERVER", label: "Kuzatuvchi" },
  { value: "Moderator", label: "Moderator" },
];

export function UserModal({
  isOpen,
  onClose,
  mode,
  user,
  onSubmit,
  isLoading = false,
}: UserModalProps) {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    department: "",
    organization: "Milliy statistika qo'mitasi",
    login: "",
    password: "",
    role: "",
    status: "active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === "edit" && user) {
      setFormData({
        lastName: user.name.split(" ")[0] || "",
        firstName: user.name.split(" ")[1] || "",
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
        department: "",
        organization: "Milliy statistika qo'mitasi",
        login: "",
        password: "",
        role: "",
        status: "active",
      });
    }
    setErrors({});
  }, [mode, user, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Familiya kiritilishi shart";
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Ism kiritilishi shart";
    }
    if (!formData.login.trim()) {
      newErrors.login = "Login kiritilishi shart";
    }
    if (mode === "create" && !formData.password.trim()) {
      newErrors.password = "Parol kiritilishi shart";
    }
    if (!formData.role) {
      newErrors.role = "Rol tanlanishi shart";
    }
    if (!formData.department) {
      newErrors.department = "Bo'lim tanlanishi shart";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Familiyasi *
              </Label>
              <Input
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Ismi *
              </Label>
              <Input
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Boshqarma/bo'lim *
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  setFormData({ ...formData, department: value })
                }
              >
                <SelectTrigger
                  className={errors.department ? "border-red-500" : ""}
                >
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
              {errors.department && (
                <p className="text-red-500 text-xs mt-1">{errors.department}</p>
              )}
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
                Login *
              </Label>
              <Input
                value={formData.login}
                onChange={(e) =>
                  setFormData({ ...formData, login: e.target.value })
                }
                className={errors.login ? "border-red-500" : ""}
              />
              {errors.login && (
                <p className="text-red-500 text-xs mt-1">{errors.login}</p>
              )}
            </div>
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Parol {mode === "create" && "*"}
              </Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={errors.password ? "border-red-500" : ""}
                placeholder={
                  mode === "edit"
                    ? "Yangi parol (bo'sh qoldirilsa o'zgarmaydi)"
                    : ""
                }
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Rol *
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger className={errors.role ? "border-red-500" : ""}>
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
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">{errors.role}</p>
              )}
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
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-8"
              disabled={isLoading}
            >
              {isLoading ? "Saqlanmoqda..." : submitText}
            </Button>
          </div>
        </form>
      </Card>
    </Modal>
  );
}
