"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/ui/modal";
import { Input } from "@/ui/input";

import { Button } from "@/ui/button";
import { Label } from "@/ui/label";
import { Card } from "@/ui/card";
import {
  Organization,
  OrganizationCreateParams,
} from "@/api/types/organizations";
import { LoadingButton } from "@/ui/loading-button";

interface OrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (organization: OrganizationCreateParams) => void;
  organization?: Organization;
  mode: "create" | "edit";
  isDoingAction: boolean;
}

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
  });

  useEffect(() => {
    if (organization && mode === "edit") {
      setFormData({
        name: organization.name,
      });
    } else {
      setFormData({
        name: "",
      });
    }
  }, [organization, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name.trim(),
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
