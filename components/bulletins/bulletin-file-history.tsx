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

interface BulletinFileHistoryProps {
  files: BulletinFile[];
  isLoading: boolean;
  onDownload: (file: BulletinFile) => void;
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
  onDownload,
}: BulletinFileHistoryProps) {
  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Fayl yuklash tarixi</h2>
          <p className="text-sm text-gray-600 mt-1">
            Bulletin uchun yuklangan fayllar tarixi
          </p>
        </div>
        <TableSkeleton rows={5} columns={6} />
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Fayl yuklash tarixi</h2>
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
              <TableHead className="w-24 p-3">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-sm text-[var(--muted-foreground)]">
                    Hali hech qanday fayl yuklanmagan
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              files.map((file, index) => (
                <TableRow
                  key={file.id}
                  className="transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-semibold text-[var(--primary)] p-3">
                    {index + 1}
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.upload_file || "unknown")}
                      <div>
                        <div className="font-medium text-[var(--foreground)]">
                          {getFileName(file.upload_file || "")}
                        </div>
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
                    {formatDate(file.upload_at)}
                  </TableCell>
                  <TableCell className="p-3 text-[var(--muted-foreground)]">
                    {formatDate(file.deadline)}
                  </TableCell>
                  <TableCell className="p-3">
                    <Badge
                      variant={getStatusVariant(file.status)}
                      className={`${getStatusColor(file.status)} border-none`}
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
                    <div className="flex items-center justify-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDownload(file)}
                        disabled={!file.upload_file}
                        className="h-8 w-8 p-0 border border-[var(--border)] hover:bg-[var(--primary)]/10 disabled:opacity-50"
                        aria-label="Yuklab olish"
                      >
                        <Download className="h-4 w-4 text-[var(--primary)]" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
