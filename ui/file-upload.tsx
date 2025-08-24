"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Upload, X, File, ImageIcon, FileText, AlertCircle, CheckCircle } from "lucide-react"

export interface FileUploadProps {
  label?: string
  error?: string
  success?: string
  hint?: string
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  maxFiles?: number
  onFilesChange?: (files: File[]) => void
  className?: string
  disabled?: boolean
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      label,
      error,
      success,
      hint,
      accept,
      multiple = false,
      maxSize = 10,
      maxFiles = 5,
      onFilesChange,
      className,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const [files, setFiles] = React.useState<File[]>([])
    const [dragActive, setDragActive] = React.useState(false)
    const [uploadError, setUploadError] = React.useState<string>("")
    const inputRef = React.useRef<HTMLInputElement>(null)

    const hasError = !!error || !!uploadError
    const hasSuccess = !!success && !hasError

    const validateFile = (file: File): string | null => {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        return `Файл "${file.name}" превышает максимальный размер ${maxSize}MB`
      }
      return null
    }

    const handleFiles = (newFiles: FileList | null) => {
      if (!newFiles) return

      const fileArray = Array.from(newFiles)
      const validFiles: File[] = []
      let errorMessage = ""

      for (const file of fileArray) {
        const validation = validateFile(file)
        if (validation) {
          errorMessage = validation
          break
        }
        validFiles.push(file)
      }

      if (errorMessage) {
        setUploadError(errorMessage)
        return
      }

      const totalFiles = multiple ? [...files, ...validFiles] : validFiles
      if (maxFiles && totalFiles.length > maxFiles) {
        setUploadError(`Максимальное количество файлов: ${maxFiles}`)
        return
      }

      setUploadError("")
      setFiles(totalFiles)
      if (onFilesChange) {
        onFilesChange(totalFiles)
      }
    }

    const removeFile = (index: number) => {
      const newFiles = files.filter((_, i) => i !== index)
      setFiles(newFiles)
      if (onFilesChange) {
        onFilesChange(newFiles)
      }
    }

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true)
      } else if (e.type === "dragleave") {
        setDragActive(false)
      }
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (disabled) return
      handleFiles(e.dataTransfer.files)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
    }

    const getFileIcon = (file: File) => {
      if (file.type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
      if (file.type.includes("pdf")) return <FileText className="h-4 w-4" />
      return <File className="h-4 w-4" />
    }

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes"
      const k = 1024
      const sizes = ["Bytes", "KB", "MB", "GB"]
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {label && <label className="text-sm font-medium text-[#374151] leading-none">{label}</label>}

        <div
          className={cn(
            "relative border-1 border-dashed rounded-lg p-6 transition-colors",
            dragActive && !disabled
              ? "border-[#2354bf] bg-[#2354bf]/5"
              : hasError
                ? "border-[#ff5959] bg-[#ff5959]/5"
                : hasSuccess
                  ? "border-[#10b981] bg-[#10b981]/5"
                  : "border-[#d1d5db] hover:border-[#2354bf] hover:bg-[#f9fafb]",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-[#6b7280] mb-2" />
            <p className="text-sm text-[#374151] mb-1">
              <span className="font-medium text-[#2354bf]">Нажмите для выбора</span> или перетащите файлы сюда
            </p>
            <p className="text-xs text-[#6b7280]">
              {accept && `Поддерживаемые форматы: ${accept}`}
              {maxSize && ` • Максимальный размер: ${maxSize}MB`}
              {multiple && maxFiles && ` • До ${maxFiles} файлов`}
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#374151]">Выбранные файлы:</p>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#f9fafb] rounded-lg border">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file)}
                    <div>
                      <p className="text-sm font-medium text-[#374151]">{file.name}</p>
                      <p className="text-xs text-[#6b7280]">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-[#6b7280] hover:text-[#ff5959] transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {hint && !hasError && !hasSuccess && <p className="text-xs text-[#6b7280]">{hint}</p>}
        {(error || uploadError) && (
          <p className="text-xs text-[#ff5959] flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error || uploadError}
          </p>
        )}
        {success && (
          <p className="text-xs text-[#10b981] flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {success}
          </p>
        )}
      </div>
    )
  },
)
FileUpload.displayName = "FileUpload"

export { FileUpload }
