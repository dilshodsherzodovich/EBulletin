"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { MultiSelect } from "@/ui/multi-select";
import React from "react";

interface BulletinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BulletinFormData) => void;
  mode: "create" | "edit";
  bulletin?: Bulletin;
}

interface Bulletin {
  id: string;
  name: string;
  responsibleDepartment: string;
  receivingOrganizations: string[];
  responsiblePersons: string[];
  periodType: string;
}

interface BulletinFormData {
  name: string;
  responsibleDepartment: string;
  receivingOrganizations: string[];
  responsiblePersons: string[];
  periodType: string;
}

export function BulletinModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  bulletin,
}: BulletinModalProps) {
  const [formData, setFormData] = useState<BulletinFormData>({
    name: "",
    responsibleDepartment: "",
    receivingOrganizations: [],
    responsiblePersons: [],
    periodType: "",
  });

  // Reset form when modal opens/closes or mode changes
  React.useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && bulletin) {
        setFormData({
          name: bulletin.name || "",
          responsibleDepartment: bulletin.responsibleDepartment || "",
          receivingOrganizations: bulletin.receivingOrganizations || [],
          responsiblePersons: bulletin.responsiblePersons || [],
          periodType: bulletin.periodType || "",
        });
      } else {
        setFormData({
          name: "",
          responsibleDepartment: "",
          receivingOrganizations: [],
          responsiblePersons: [],
          periodType: "",
        });
      }
    }
  }, [isOpen, mode, bulletin]);

  // Mock data for dropdowns
  const departmentOptions = [
    "Qishloq xo'jaligi bo'limi",
    "San'at bo'limi",
    "Tibbiyot bo'limi",
    "Ta'lim bo'limi",
    "Iqtisodiyot bo'limi",
  ];

  const organizationOptions = [
    { value: "org1", label: "Byulletenni qabul qiluvchi davlat idorasi 1" },
    { value: "org2", label: "Byulletenni qabul qiluvchi davlat idorasi 2" },
    { value: "org3", label: "Byulletenni qabul qiluvchi davlat idorasi 3" },
    { value: "org4", label: "Byulletenni qabul qiluvchi davlat idorasi 4" },
    { value: "org5", label: "Byulletenni qabul qiluvchi davlat idorasi 5" },
    { value: "org6", label: "Byulletenni qabul qiluvchi davlat idorasi 6" },
    { value: "org7", label: "Byulletenni qabul qiluvchi davlat idorasi 7" },
    { value: "org8", label: "Byulletenni qabul qiluvchi davlat idorasi 8" },
  ];

  const personOptions = [
    { value: "person1", label: "Umarov A.P." },
    { value: "person2", label: "Siddiqov M.R." },
    { value: "person3", label: "Karimov Sh.T." },
    { value: "person4", label: "Axmedov N.K." },
    { value: "person5", label: "Yusupov D.A." },
    { value: "person6", label: "Rahimov T.S." },
    { value: "person7", label: "Mirzaev K.X." },
    { value: "person8", label: "Safarov A.M." },
  ];

  const periodTypeOptions = [
    "Kunlik",
    "Haftalik",
    "Oylik",
    "Yarim yillik",
    "Yillik",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert("Byulleten nomini kiriting");
      return;
    }

    if (!formData.responsibleDepartment) {
      alert("Mas'ul bo'limni tanlang");
      return;
    }

    if (formData.receivingOrganizations.length === 0) {
      alert("Kamida bitta tashkilotni tanlang");
      return;
    }

    if (formData.responsiblePersons.length === 0) {
      alert("Kamida bitta mas'ul shaxsni tanlang");
      return;
    }

    if (!formData.periodType) {
      alert("Muddat turini tanlang");
      return;
    }

    onSubmit(formData);
    onClose();
  };

  const handleOrganizationChange = (values: string[]) => {
    setFormData({
      ...formData,
      receivingOrganizations: values,
    });
  };

  const handlePersonChange = (values: string[]) => {
    setFormData({
      ...formData,
      responsiblePersons: values,
    });
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.responsibleDepartment &&
      formData.receivingOrganizations.length > 0 &&
      formData.responsiblePersons.length > 0 &&
      formData.periodType
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[var(--foreground)]">
            {mode === "create"
              ? "Yangi byulletenni qo'shish"
              : "Byulletenni tahrirlash"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Bulletin Name */}
          <div className="space-y-3">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              Byulletenni nomini kiriting
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Byulletenni nomini kiriting"
              className="w-full border-[var(--border)]"
              required
            />
          </div>

          {/* Responsible Department */}
          <div className="space-y-3">
            <Label
              htmlFor="department"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              Byulletengacha masul bo'limni tanlang
            </Label>
            <Select
              value={formData.responsibleDepartment}
              onValueChange={(value) =>
                setFormData({ ...formData, responsibleDepartment: value })
              }
            >
              <SelectTrigger className="w-full border-[var(--border)]">
                <SelectValue placeholder="Bolimni tanlang" />
              </SelectTrigger>
              <SelectContent>
                {departmentOptions.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Receiving Organizations */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[var(--foreground)]">
              Byulletenni qabul qiluvchi tashkilotlarni tanlang
            </Label>

            <MultiSelect
              options={organizationOptions}
              selectedValues={formData.receivingOrganizations}
              onSelectionChange={handleOrganizationChange}
              placeholder="Tashkilotlarni tanlang"
              searchPlaceholder="Tashkilotlarni qidirish..."
              emptyMessage="Tashkilot topilmadi"
            />
          </div>

          {/* Responsible Persons */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[var(--foreground)]">
              Masul shaxslarni tanlang
            </Label>

            <MultiSelect
              options={personOptions}
              selectedValues={formData.responsiblePersons}
              onSelectionChange={handlePersonChange}
              placeholder="Masul shaxslarni tanlang"
              searchPlaceholder="Masul shaxslarni qidirish..."
              emptyMessage="Masul shaxs topilmadi"
            />
          </div>

          {/* Period Type */}
          <div className="space-y-3">
            <Label
              htmlFor="periodType"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              Muddat turini tanlang
            </Label>
            <Select
              value={formData.periodType}
              onValueChange={(value) =>
                setFormData({ ...formData, periodType: value })
              }
            >
              <SelectTrigger className="w-full border-[var(--border)]">
                <SelectValue placeholder="Muddat turini tanlang" />
              </SelectTrigger>
              <SelectContent>
                {periodTypeOptions.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[var(--border)]"
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-6"
              disabled={!isFormValid()}
            >
              {mode === "create" ? "Saqlash" : "O'zgarishlarni saqlash"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
