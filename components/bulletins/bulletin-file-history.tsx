"use client";

import { useState } from "react";
import {
  Download,
  File,
  ImageIcon,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { BulletinFile } from "@/api/types/bulleten";
import { TableSkeleton } from "@/ui/table-skeleton";
import { PermissionGuard } from "../permission-guard";
import { getFileName } from "@/lib/utils";
import {
  useCreateBulletinFileStatusHistory,
  useUpdateBulletinFile,
} from "@/api/hooks/use-bulletin";
import { useSnackbar } from "@/providers/snackbar-provider";
import { LoadingButton } from "@/ui/loading-button";
import { BulletinFileUploadModal } from "./bulletin-file-upload-modal";
import { useParams } from "next/navigation";
import React from "react";

interface BulletinFileHistoryProps {
  files: BulletinFile[];
  isLoading: boolean;
}

// Status mapping to Uzbek labels
const statusLabels: { [key: string]: string } = {
  on_time: "Vaqtida",
  late: "Kechikkan",
  not_submitted: "Yuklanmagan",
};

const getStatusLabel = (status: string): string => {
  return statusLabels[status] || status;
};

const getStatusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "on_time":
      return "default";
    case "late":
      return "destructive";
    case "not_submitted":
      return "secondary";
    default:
      return "outline";
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "on_time":
      return "bg-green-100 text-green-800 border-green-200";
    case "late":
      return "bg-red-100 text-red-800 border-red-200";
    case "not_submitted":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension || "")) {
    return <ImageIcon className="h-5 w-5 text-blue-500" />;
  }
  if (["pdf"].includes(extension || "")) {
    return <FileText className="h-5 w-5 text-red-500" />;
  }
  if (["doc", "docx"].includes(extension || "")) {
    return <FileText className="h-5 w-5 text-blue-600" />;
  }
  if (["xls", "xlsx"].includes(extension || "")) {
    return <FileText className="h-5 w-5 text-green-600" />;
  }
  if (["ppt", "pptx"].includes(extension || "")) {
    return <FileText className="h-5 w-5 text-orange-600" />;
  }
  if (["zip", "rar", "7z"].includes(extension || "")) {
    return <File className="h-5 w-5 text-purple-500" />;
  }

  return <File className="h-5 w-5 text-gray-500" />;
};

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "N/A";
  }
};

export function BulletinFileHistory({
  files,
  isLoading,
}: BulletinFileHistoryProps) {
  const { mutate: updateBulletinFile, isPending } = useUpdateBulletinFile();
  const {
    mutate: createBulletinFileStatusHistory,
    isPending: isCreatingBulletinFileStatusHistory,
  } = useCreateBulletinFileStatusHistory();
  const { showSuccess, showError } = useSnackbar();
  const { id: journalId } = useParams();

  // Modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFileForEdit, setSelectedFileForEdit] =
    useState<BulletinFile | null>(null);

  // Expanded rows state
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (fileId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Yuklangan fayllar</h2>
          <p className="text-sm text-gray-600 mt-1">
            Bulletin uchun yuklangan fayllar tarixi
          </p>
        </div>
        <TableSkeleton rows={5} columns={6} />
      </Card>
    );
  }

  const handleGiveAccessToEditBulletinFile = (
    id: string,
    editable: boolean
  ) => {
    updateBulletinFile(
      {
        id,
        journal: journalId as string,
        data: { editable },
      },
      {
        onSuccess: () => {
          showSuccess("Fayl tahrirlash ruxsat berildi");
        },
        onError: () => {
          showError("Fayl tahrirlash ruxsat berishda xatolik");
        },
      }
    );
  };

  const handleUpdateBulletinFile = (
    id: string,
    upload_file: File,
    description: string,
    journal_id: string
  ) => {
    createBulletinFileStatusHistory(
      {
        j_upload_history_id: id,
        upload_file,
        description,
        journal_id,
      },
      {
        onSuccess: () => {
          showSuccess("Fayl muvaffaqiyatli tahrirlendi");
          setIsUploadModalOpen(false);
          setSelectedFileForEdit(null);
        },
        onError: () => {
          showError("Fayl tahrirlashda xatolik");
        },
      }
    );
  };

  const handleEditFileClick = (file: BulletinFile) => {
    setSelectedFileForEdit(file);
    setIsUploadModalOpen(true);
  };

  const handleModalClose = () => {
    setIsUploadModalOpen(false);
    setSelectedFileForEdit(null);
  };

  const handleFileUpload = (file: File, description: string) => {
    if (selectedFileForEdit) {
      handleUpdateBulletinFile(
        selectedFileForEdit.id,
        file,
        description,
        journalId as string
      );
    }
  };

  const getActualFile = (file: BulletinFile) => {
    if (!file.uploaded_files || file.uploaded_files.length === 0) {
      return null;
    }
    return file.uploaded_files.find(
      (upload_file) => upload_file.status_display === "Actual"
    );
  };

  const hasUploadFiles = (file: BulletinFile) => {
    return file.uploaded_files && file.uploaded_files.length > 0;
  };

  return (
    <>
      <Card className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Yuklangan fayllar</h2>
          <p className="text-sm text-gray-600 mt-1">
            Bulletin uchun yuklangan fayllar tarixi
          </p>
        </div>

        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 text-[var(--table-header-fg)]">
                <TableHead className="w-16 p-3">№</TableHead>
                <TableHead className="p-3">Fayl nomi</TableHead>
                <TableHead className="p-3">Foydalanuvchi</TableHead>
                <TableHead className="p-3">Yuklangan sana</TableHead>
                <TableHead className="p-3">Muddat</TableHead>
                <TableHead className="p-3">Holat</TableHead>
                <TableHead className="p-3">Tahrir holati</TableHead>
                <TableHead className="w-24 p-3">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-sm text-[var(--muted-foreground)]">
                      Hali hech qanday fayl yuklanmagan
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                files.map((file, index) => {
                  const actualFile = getActualFile(file);
                  const isExpanded = expandedRows.has(file.id);
                  const hasHistory =
                    hasUploadFiles(file) &&
                    file.uploaded_files &&
                    file.uploaded_files.length > 1;

                  return (
                    <React.Fragment key={file.id}>
                      {/* Main Row */}
                      <TableRow className="transition-colors hover:bg-muted/50">
                        <TableCell className="font-semibold text-[var(--primary)] p-3">
                          {index + 1}
                        </TableCell>
                        <TableCell className="p-3">
                          <div className="flex items-center space-x-3">
                            {getFileIcon(actualFile?.upload_file || "unknown")}
                            <div>
                              <div className="font-medium text-[var(--foreground)]">
                                {actualFile
                                  ? getFileName(actualFile.upload_file)
                                  : "Fayl topilmadi"}
                              </div>
                              {hasHistory && (
                                <button
                                  onClick={() => toggleRowExpansion(file.id)}
                                  className="flex items-center text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="h-3 w-3 mr-1" />
                                  ) : (
                                    <ChevronRight className="h-3 w-3 mr-1" />
                                  )}
                                  {isExpanded
                                    ? "Tarixni yashirish"
                                    : "Tarixni ko'rsatish"}
                                </button>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-3">
                          <div>
                            <div className="font-medium text-[var(--foreground)]">
                              {file.user_info.full_name}
                            </div>
                            <div className="text-sm text-[var(--muted-foreground)]">
                              @{file.user_info.username}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-3 text-[var(--muted-foreground)]">
                          {formatDate(file.created)}
                        </TableCell>
                        <TableCell className="p-3 text-[var(--muted-foreground)]">
                          {formatDate(file.deadline)}
                        </TableCell>
                        <TableCell className="p-3">
                          <Badge
                            variant={getStatusVariant(file.status)}
                            className={`${getStatusColor(
                              file.status
                            )} border-none`}
                          >
                            <div className="flex items-center space-x-1">
                              {file.status === "on_time" && (
                                <CheckCircle className="h-3 w-3" />
                              )}
                              {file.status === "late" && (
                                <AlertCircle className="h-3 w-3" />
                              )}
                              {file.status === "not_submitted" && (
                                <Clock className="h-3 w-3" />
                              )}
                              <span>{getStatusLabel(file.status)}</span>
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell className="p-3">
                          <Badge variant="outline" className="border-none">
                            <span>
                              {file.editable
                                ? "Tahrirlashga ruxsat berilgan"
                                : "Tahrirlashga ruxsat berilmagan"}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="p-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              disabled={!actualFile}
                              className="h-8 w-8 p-0 border border-[var(--border)] hover:bg-[var(--primary)]/10 disabled:opacity-50"
                              aria-label="Yuklab olish"
                            >
                              <Download className="h-4 w-4 text-[var(--primary)]" />
                            </Button>

                            <PermissionGuard permission="give_access_to_edit_bulletin_file">
                              <LoadingButton
                                isPending={isPending}
                                onClick={() => {
                                  handleGiveAccessToEditBulletinFile(
                                    file.id,
                                    !file.editable
                                  );
                                }}
                                disabled={!actualFile}
                                variant={
                                  file.editable ? "destructive" : "default"
                                }
                                size="sm"
                              >
                                {!file.editable
                                  ? "Tahrirlash ruxsat berish"
                                  : "Tahrirlashni bekor qilish"}
                              </LoadingButton>
                            </PermissionGuard>

                            {file.editable && (
                              <PermissionGuard permission="edit_bulletin_file">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEditFileClick(file)}
                                >
                                  <Edit className="h-4 w-4 text-[var(--primary)]" />
                                </Button>
                              </PermissionGuard>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Expanded History Rows */}
                      {isExpanded && hasHistory && file.uploaded_files && (
                        <>
                          {file.uploaded_files.map(
                            (uploadFile, historyIndex) => (
                              <TableRow
                                key={`${file.id}-${uploadFile.id}`}
                                className="bg-muted/20 border-l-4 border-l-[var(--primary)]/30"
                              >
                                <TableCell className="p-3 pl-8">
                                  <div className="text-xs text-[var(--muted-foreground)]">
                                    {historyIndex + 1}
                                  </div>
                                </TableCell>
                                <TableCell className="p-3">
                                  <div className="flex items-center space-x-3">
                                    {getFileIcon(uploadFile.upload_file)}
                                    <div>
                                      <div className="font-medium text-[var(--foreground)] text-sm">
                                        {getFileName(uploadFile.upload_file)}
                                      </div>
                                      <div className="text-xs text-[var(--muted-foreground)]">
                                        {uploadFile.description ||
                                          "Tavsif yo'q"}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="p-3">
                                  <div className="text-sm text-[var(--muted-foreground)]">
                                    -
                                  </div>
                                </TableCell>
                                <TableCell className="p-3 text-[var(--muted-foreground)] text-sm">
                                  {formatDate(uploadFile.created)}
                                </TableCell>
                                <TableCell className="p-3">
                                  <div className="text-sm text-[var(--muted-foreground)]">
                                    -
                                  </div>
                                </TableCell>
                                <TableCell className="p-3">
                                  <Badge
                                    variant={
                                      uploadFile.status_display === "Actual"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className={`${
                                      uploadFile.status_display === "Actual"
                                        ? "bg-green-100 text-green-800 border-green-200"
                                        : "bg-gray-100 text-gray-800 border-gray-200"
                                    } border-none`}
                                  >
                                    {uploadFile.status_display === "Actual"
                                      ? "Joriy"
                                      : "Eski"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="p-3">
                                  <div className="text-sm text-[var(--muted-foreground)]">
                                    -
                                  </div>
                                </TableCell>
                                <TableCell className="p-3">
                                  <div className="flex items-center justify-center">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-6 w-6 p-0 border border-[var(--border)] hover:bg-[var(--primary)]/10"
                                      aria-label="Yuklab olish"
                                    >
                                      <Download className="h-3 w-3 text-[var(--primary)]" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <BulletinFileUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleModalClose}
        onUpload={handleFileUpload}
        file={selectedFileForEdit}
        isUploading={isPending || isCreatingBulletinFileStatusHistory}
      />
    </>
  );
}
