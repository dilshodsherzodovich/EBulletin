"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui/dialog";
import { EnhancedInput } from "@/ui/enhanced-input";
import { EnhancedButton } from "@/ui/enhanced-button";
import { Label } from "@/ui/label";

interface ClassificatorElement {
  id: string;
  name: string;
}

interface ClassificatorElementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ClassificatorElement, "id">) => void;
  element?: ClassificatorElement;
  mode: "create" | "edit";
}

export function ClassificatorElementModal({
  isOpen,
  onClose,
  onSave,
  element,
  mode,
}: ClassificatorElementModalProps) {
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (mode === "edit" && element) {
      setFormData({
        name: element.name,
      });
    } else {
      setFormData({
        name: "",
      });
    }
  }, [mode, element, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleClose = () => {
    onClose();
    setFormData({
      name: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Element" : "Edit Element"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Element Name</Label>
            <EnhancedInput
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter element name"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <EnhancedButton
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </EnhancedButton>
            <EnhancedButton
              type="submit"
              className="bg-[#2354bf] hover:bg-[#1148ae]"
            >
              {mode === "create" ? "Add" : "Save Changes"}
            </EnhancedButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
