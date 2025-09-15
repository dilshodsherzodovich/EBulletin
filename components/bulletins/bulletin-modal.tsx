"use client";

import { useState, useEffect } from "react";
import { X, Plus, Check } from "lucide-react";
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
import {
  Bulletin,
  BulletinCreateBody,
  BulletinDeadline,
  BulletinColumn,
} from "@/api/types/bulleten";
import { useOrganizations } from "@/api/hooks/use-organizations";
import { useDepartments } from "@/api/hooks/use-departmants";
import { useUsers } from "@/api/hooks/use-user";
import { Badge } from "@/ui/badge";
import { LoadingButton } from "@/ui/loading-button";

interface BulletinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BulletinCreateBody) => void;
  mode: "create" | "edit";
  bulletin?: Bulletin;
  isLoading: boolean;
}

interface BulletinFormData {
  name: string;
  description: string;
  deadline: string;
  mainOrganizations: string[];
  secondaryOrganizations: string[];
  responsibleEmployees: string[];
}

interface SelectedMainOrg {
  mainOrgId: string;
  mainOrgName: string;
  secondaryOrgs: string[];
}

const deadlineOptions = [
  { value: "weekly", label: "Haftalik" },
  { value: "monthly", label: "Oylik" },
  { value: "quarterly", label: "Choraklik" },
  { value: "yearly", label: "Yillik" },
];

export function BulletinModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  bulletin,
  isLoading,
}: BulletinModalProps) {
  const [formData, setFormData] = useState<BulletinFormData>({
    name: "",
    description: "",
    deadline: "",
    mainOrganizations: [],
    secondaryOrganizations: [],
    responsibleEmployees: [],
  });

  const [selectedMainOrgs, setSelectedMainOrgs] = useState<SelectedMainOrg[]>(
    []
  );
  const [currentMainOrgId, setCurrentMainOrgId] = useState<string>("");
  const [currentSecondaryOrgs, setCurrentSecondaryOrgs] = useState<string[]>(
    []
  );

  const [mainOrgSearchTerm, setMainOrgSearchTerm] = useState("");

  // Add errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch data from API
  const { data: organizationsData, isLoading: orgsLoading } = useOrganizations({
    no_page: true,
  });
  const { data: departmentsData, isLoading: deptsLoading } = useDepartments({
    no_page: true,
  });
  const { data: usersData, isLoading: usersLoading } = useUsers({
    no_page: true,
  });

  const organizations = organizationsData?.results || [];
  const departments = departmentsData?.results || [];
  const users = usersData?.results || [];

  // Helper function to reconstruct selectedMainOrgs from bulletin data
  const reconstructSelectedMainOrgs = (bulletin: Bulletin) => {
    if (
      !bulletin.main_organizations_list ||
      !bulletin.main_organizations_list.length
    ) {
      return [];
    }

    const reconstructed: SelectedMainOrg[] = [];

    bulletin.main_organizations_list.forEach((mainOrg) => {
      const secondaryOrgIds = mainOrg.secondary_organizations.map(
        (dept) => dept.id
      );

      reconstructed.push({
        mainOrgId: mainOrg.id,
        mainOrgName: mainOrg.name,
        secondaryOrgs: secondaryOrgIds,
      });
    });

    return reconstructed;
  };

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && bulletin) {
        const reconstructedMainOrgs = reconstructSelectedMainOrgs(bulletin);

        setFormData({
          name: bulletin.name || "",
          description: bulletin.description || "",
          deadline: bulletin.deadline?.period_type || "",
          mainOrganizations:
            bulletin.main_organizations_list?.map((org) => org.id) || [],
          secondaryOrganizations: reconstructedMainOrgs.flatMap(
            (org) => org.secondaryOrgs
          ),
          responsibleEmployees:
            bulletin.employees_list?.map((emp) => emp.id) || [],
        });

        setSelectedMainOrgs(reconstructedMainOrgs);
      } else {
        setFormData({
          name: "",
          description: "",
          deadline: "",
          mainOrganizations: [],
          secondaryOrganizations: [],
          responsibleEmployees: [],
        });
        setSelectedMainOrgs([]);
        setCurrentMainOrgId("");
        setCurrentSecondaryOrgs([]);
      }
      // Clear errors when modal opens
      setErrors({});
    }
  }, [isOpen, mode, bulletin, departments]); // Added departments dependency

  const createBulletinData = (
    formData: BulletinFormData
  ): BulletinCreateBody => {
    const defaultDeadline: BulletinDeadline = {
      id: 0,
      period_type: formData.deadline,
      custom_deadline: null,
      day_of_month: null,
      day_of_week: null,
      month: null,
      interval: 1,
      period_start: new Date().toISOString(),
      current_deadline: new Date().toISOString(),
    };

    return {
      name: formData.name,
      description: formData.description,
      deadline: defaultDeadline,
      columns: [], // Empty array as requested
      organizations: formData.secondaryOrganizations, // Secondary organizations (departments)
      main_organizations: formData.mainOrganizations, // Main organizations
      responsible_employees: formData.responsibleEmployees,
    };
  };

  const handleAddMainOrganization = () => {
    if (currentMainOrgId && currentSecondaryOrgs.length > 0) {
      const mainOrg = organizations.find((org) => org.id === currentMainOrgId);
      if (mainOrg) {
        const newSelectedMainOrg: SelectedMainOrg = {
          mainOrgId: currentMainOrgId,
          mainOrgName: mainOrg.name,
          secondaryOrgs: [...currentSecondaryOrgs],
        };

        setSelectedMainOrgs([...selectedMainOrgs, newSelectedMainOrg]);

        // Update form data
        const allMainOrgs = [...selectedMainOrgs, newSelectedMainOrg].map(
          (org) => org.mainOrgId
        );
        const allSecondaryOrgs = [
          ...selectedMainOrgs,
          newSelectedMainOrg,
        ].flatMap((org) => org.secondaryOrgs);

        setFormData({
          ...formData,
          mainOrganizations: allMainOrgs,
          secondaryOrganizations: allSecondaryOrgs,
        });

        // Reset current selection
        setCurrentMainOrgId("");
        setCurrentSecondaryOrgs([]);
      }
    }
  };

  const handleRemoveMainOrganization = (mainOrgId: string) => {
    const updatedSelectedMainOrgs = selectedMainOrgs.filter(
      (org) => org.mainOrgId !== mainOrgId
    );
    setSelectedMainOrgs(updatedSelectedMainOrgs);

    // Update form data
    const allMainOrgs = updatedSelectedMainOrgs.map((org) => org.mainOrgId);
    const allSecondaryOrgs = updatedSelectedMainOrgs.flatMap(
      (org) => org.secondaryOrgs
    );

    setFormData({
      ...formData,
      mainOrganizations: allMainOrgs,
      secondaryOrganizations: allSecondaryOrgs,
    });
  };

  // Add validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Byulleten nomini kiriting";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Byulleten tavsifini kiriting";
    }
    if (!formData.deadline) {
      newErrors.deadline = "Muddat turini tanlang";
    }
    if (formData.mainOrganizations.length === 0) {
      newErrors.mainOrganizations = "Kamida bitta asosiy tashkilotni tanlang";
    }
    if (formData.secondaryOrganizations.length === 0) {
      newErrors.secondaryOrganizations =
        "Kamida bitta quyi tashkilotni tanlang";
    }
    if (formData.responsibleEmployees.length === 0) {
      newErrors.responsibleEmployees = "Kamida bitta mas'ul shaxsni tanlang";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const bulletinData = createBulletinData(formData);
    onSubmit(bulletinData);
  };

  const handleResponsibleEmployeeChange = (values: string[]) => {
    setFormData({
      ...formData,
      responsibleEmployees: values,
    });
    // Clear error when user makes selection
    if (values.length > 0 && errors.responsibleEmployees) {
      setErrors((prev) => ({ ...prev, responsibleEmployees: "" }));
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.description.trim() &&
      formData.deadline &&
      formData.mainOrganizations.length > 0 &&
      formData.secondaryOrganizations.length > 0 &&
      formData.responsibleEmployees.length > 0
    );
  };

  const getAvailableMainOrgs = () => {
    const selectedIds = selectedMainOrgs.map((org) => org.mainOrgId);
    return organizations?.filter((org) => !selectedIds.includes(org.id)) || [];
  };

  const getCurrentSecondaryOrgs = () => {
    if (!currentMainOrgId) return [];
    // Filter departments that belong to the selected main organization
    return departments.filter(
      (dept) => dept.organization_id === currentMainOrgId
    );
  };

  const getSecondaryOrgName = (secOrgId: string) => {
    const secOrg = departments.find((dept) => dept.id === secOrgId);
    return secOrg?.name || secOrgId;
  };

  if (orgsLoading || deptsLoading || usersLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[var(--foreground)]">
              {mode === "create"
                ? "Yangi byulletenni qo'shish"
                : "Byulletenni tahrirlash"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-[var(--muted-foreground)]">
              Ma'lumotlar yuklanmoqda...
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
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
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                // Clear error when user starts typing
                if (e.target.value.trim() && errors.name) {
                  setErrors((prev) => ({ ...prev, name: "" }));
                }
              }}
              placeholder="Byulletenni nomini kiriting"
              className={`w-full border-[var(--border)] ${
                errors.name ? "border-red-500" : ""
              }`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Bulletin Description */}
          <div className="space-y-3">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              Byulletenni tavsifini kiriting
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                // Clear error when user starts typing
                if (e.target.value.trim() && errors.description) {
                  setErrors((prev) => ({ ...prev, description: "" }));
                }
              }}
              placeholder="Byulletenni tavsifini kiriting"
              className={`w-full border-[var(--border)] ${
                errors.description ? "border-red-500" : ""
              }`}
              required
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Deadline Type */}
          <div className="space-y-3">
            <Label
              htmlFor="deadline"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              Muddat turini tanlang
            </Label>
            <Select
              value={formData.deadline}
              onValueChange={(value) => {
                setFormData({ ...formData, deadline: value });
                // Clear error when user makes selection
                if (value && errors.deadline) {
                  setErrors((prev) => ({ ...prev, deadline: "" }));
                }
              }}
            >
              <SelectTrigger
                className={`w-full border-[var(--border)] ${
                  errors.deadline ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Muddat turini tanlang" />
              </SelectTrigger>
              <SelectContent>
                {deadlineOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.deadline && (
              <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>
            )}
          </div>

          {/* Organization Selection */}
          <div className="space-y-4">
            {/* Selected Organizations Display */}
            {selectedMainOrgs.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-[var(--foreground)]">
                  Tanlangan tashkilotlar:
                </h4>
                {selectedMainOrgs.map((selectedOrg) => (
                  <div
                    key={selectedOrg.mainOrgId}
                    className="p-3 border border-[var(--border)] rounded-lg bg-[var(--muted)]/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-[var(--foreground)]">
                        {selectedOrg.mainOrgName}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleRemoveMainOrganization(selectedOrg.mainOrgId)
                        }
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedOrg.secondaryOrgs.map((secOrgId) => (
                        <Badge
                          key={secOrgId}
                          variant="secondary"
                          className="text-xs"
                        >
                          {getSecondaryOrgName(secOrgId)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Organization */}
            <div className="p-4 border border-[var(--border)] rounded-lg bg-[var(--muted)]/10">
              <h4 className="text-sm font-medium text-[var(--foreground)] mb-3">
                Yangi tashkilot qo'shish:
              </h4>

              {/* Step 1: Select Main Organization */}
              <div className="space-y-3 mb-4">
                <Label className="text-sm font-medium text-[var(--foreground)]">
                  1. Asosiy tashkilotni tanlang
                </Label>
                <Select
                  value={currentMainOrgId}
                  onValueChange={(value) => {
                    setCurrentMainOrgId(value);
                    setCurrentSecondaryOrgs([]); // Reset secondary orgs when main org changes
                    setMainOrgSearchTerm(""); // Clear search after selection
                  }}
                >
                  <SelectTrigger className="w-full border-[var(--border)]">
                    <SelectValue placeholder="Asosiy tashkilotni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="max-h-60 overflow-y-auto">
                      {getAvailableMainOrgs()
                        .filter((org) =>
                          org.name
                            .toLowerCase()
                            .includes(mainOrgSearchTerm.toLowerCase())
                        )
                        .map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      {getAvailableMainOrgs().filter((org) =>
                        org.name
                          .toLowerCase()
                          .includes(mainOrgSearchTerm.toLowerCase())
                      ).length === 0 && (
                        <div className="px-3 py-2 text-sm text-[var(--muted-foreground)]">
                          Tashkilot topilmadi
                        </div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              {/* Step 2: Select Secondary Organizations */}
              {currentMainOrgId && (
                <div className="space-y-3 mb-4">
                  <Label className="text-sm font-medium text-[var(--foreground)]">
                    2. Quyi tashkilotlarni tanlang
                  </Label>
                  {getCurrentSecondaryOrgs().length === 0 ? (
                    <div className="text-sm text-[var(--muted-foreground)] p-3 border border-[var(--border)] rounded-md">
                      Bu asosiy tashkilot uchun quyi tashkilotlar mavjud emas
                    </div>
                  ) : (
                    <MultiSelect
                      options={getCurrentSecondaryOrgs().map((org) => ({
                        value: org.id,
                        label: org.name,
                      }))}
                      selectedValues={currentSecondaryOrgs}
                      onSelectionChange={setCurrentSecondaryOrgs}
                      placeholder="Quyi tashkilotlarni tanlang"
                      searchPlaceholder="Quyi tashkilotlarni qidirish..."
                      emptyMessage="Quyi tashkilot topilmadi"
                    />
                  )}
                </div>
              )}

              {/* Add Button */}
              {currentMainOrgId && currentSecondaryOrgs.length > 0 && (
                <Button
                  type="button"
                  onClick={handleAddMainOrganization}
                  className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tashkilotni qo'shish
                </Button>
              )}
            </div>

            {/* Organization validation errors */}
            {errors.mainOrganizations && (
              <p className="text-red-500 text-xs mt-1">
                {errors.mainOrganizations}
              </p>
            )}
            {errors.secondaryOrganizations && (
              <p className="text-red-500 text-xs mt-1">
                {errors.secondaryOrganizations}
              </p>
            )}
          </div>

          {/* Responsible Employees */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[var(--foreground)]">
              Mas'ul shaxslarni tanlang
            </Label>
            <MultiSelect
              options={users.map((user) => ({
                value: user.id,
                label: `${user.first_name} ${user.last_name}`,
              }))}
              selectedValues={formData.responsibleEmployees}
              onSelectionChange={handleResponsibleEmployeeChange}
              placeholder="Mas'ul shaxslarni tanlang"
              searchPlaceholder="Mas'ul shaxslarni qidirish..."
              emptyMessage="Mas'ul shaxs topilmadi"
            />
            {errors.responsibleEmployees && (
              <p className="text-red-500 text-xs mt-1">
                {errors.responsibleEmployees}
              </p>
            )}
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
            <LoadingButton
              type="submit"
              disabled={!isFormValid()}
              isPending={isLoading}
            >
              {mode === "create" ? "Saqlash" : "O'zgarishlarni saqlash"}
            </LoadingButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
