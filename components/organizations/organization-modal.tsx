"use client";

import { useState, useEffect, useMemo } from "react";
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
import {
  Organization,
  OrganizationCreateParams,
  OrganizationType,
} from "@/api/types/organizations";
import { useOrganizations } from "@/api/hooks/use-organizations";
import { LoadingButton } from "@/ui/loading-button";

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (organization: OrganizationCreateParams) => void;
  organization?: Organization;
  mode: "create" | "edit";
  isDoingAction: boolean;
}

const organizationTypes = [
  { value: "hukumat", label: "Hukumat" },
  { value: "vazirlik", label: "Vazirlik" },
  { value: "qo'mita", label: "Qo'mita" },
  { value: "bo'lim", label: "Bo'lim" },
  { value: "agentlik", label: "Agentlik" },
  { value: "byuro", label: "Byuro" },
];

export function OrganizationModal({
  isOpen,
  onClose,
  onSave,
  organization,
  mode,
  isDoingAction,
}: OrganizationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "hukumat",
    parentOrganization: "none",
    status: "active" as "active" | "inactive",
  });
  const { data: organizationsList, isPending: isLoadingOrganizations } =
    useOrganizations({ page: 1 });

  const parentOrganizations = useMemo(() => {
    if (organizationsList?.results?.length) {
      return organizationsList.results.map((org) => ({
        value: org.id,
        label: org.name,
      }));
    } else return [];
  }, [organizationsList]);

  useEffect(() => {
    if (organization && mode === "edit") {
      setFormData({
        name: organization.name,
        type: organization.type!,
        parentOrganization: organization.parent?.id || "none",
        status: organization.is_active ? "active" : "inactive",
      });
    } else {
      setFormData({
        name: "",
        type: "hukumat",
        parentOrganization: "none",
        status: "active",
      });
    }
  }, [organization, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name.trim(),
      type: formData.type as OrganizationType,
      parent_id:
        formData.parentOrganization === "none"
          ? undefined
          : formData.parentOrganization,
      is_active: formData.status === "active",
    });
  };

  const title =
    mode === "create" ? "Tashkilot yaratish" : "Tashkilotni tahrirlash";
  const submitText =
    mode === "create" ? "Tashkilot yaratish" : "Tashkilotni yangilash";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <Card className="border-none p-0 mt-4">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label
                className="text-sm text-[var(--muted-foreground)]"
                aria-required
                htmlFor="name"
              >
                Tashkilot nomi
              </Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Tashkilot nomini kiriting"
                id="name"
                required
              />
            </div>
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Tashkilot turi
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tashkilot turi tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label className="text-sm text-[var(--muted-foreground)]">
                Yuqori tashkilot
              </Label>
              <Select
                value={formData.parentOrganization}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    parentOrganization: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Yuqori tashkilot tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Yo'q</SelectItem>
                  {parentOrganizations.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button type="button" variant="outline" onClick={onClose}>
              Bekor qilish
            </Button>
            <LoadingButton type="submit" isPending={isDoingAction}>
              {submitText}
            </LoadingButton>
          </div>
        </form>
      </Card>
    </Modal>
  );
}
