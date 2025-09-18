"use client";

import { useState } from "react";
import { Modal } from "@/ui/modal";
import { FileUpload } from "@/ui/file-upload";
import { BulletinFile } from "@/api/types/bulleten";

interface BulletinFileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  file: BulletinFile | null;
  isUploading?: boolean;
}

export function BulletinFileUploadModal({
  isOpen,
  onClose,
  onUpload,
  file,
  isUploading = false,
}: BulletinFileUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File[]>([]);

  const handleFileChange = (files: File[]) => {
    setSelectedFile(files);
  };

  const handleSubmit = (files: File[]) => {
    if (files.length > 0) {
      onUpload(files[0]);
    }
  };

  const handleClose = () => {
    setSelectedFile([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Faylni yangilash"
      size="md"
    >
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          {file && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Joriy fayl:</p>
              <p className="text-sm text-gray-600">{file.upload_file}</p>
            </div>
          )}
          <p>
            Yangi faylni tanlang va yuklang. Eski fayl yangi fayl bilan
            almashtiriladi.
          </p>
        </div>

        <FileUpload
          label="Yangi faylni yuklang"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
          multiple={false}
          maxSize={200}
          maxFiles={1}
          onFilesChange={handleFileChange}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          filesUploaded={selectedFile}
          isUploadingFile={isUploading}
          hint="PDF, Word, Excel, PowerPoint, rasm va arxiv fayllari qo'llab-quvvatlanadi"
        />
      </div>
    </Modal>
  );
}
