"use client";

import * as React from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";

export interface DatePickerProps {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  placeholder?: string;
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      label,
      error,
      success,
      hint,
      placeholder = "Выберите дату...",
      value,
      onValueChange,
      disabled = false,
      className,
      minDate,
      maxDate,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const hasError = !!error;
    const hasSuccess = !!success && !hasError;

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {label && (
          <label className="text-sm font-medium text-[#374151] leading-none">
            {label}
          </label>
        )}

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-12 justify-start text-left font-normal",
                !value && "text-[#9ca3af]",
                hasError
                  ? "border-[#ff5959] focus:ring-2 focus:ring-[#ff5959]/20"
                  : hasSuccess
                  ? "border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
                  : "border-[#d1d5db] focus:ring-2 focus:ring-[#2354bf]/20"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value
                ? format(value, "dd MMMM yyyy", { locale: ru })
                : placeholder}
              <div className="ml-auto flex items-center space-x-1">
                {hasError && <AlertCircle className="h-4 w-4 text-[#ff5959]" />}
                {hasSuccess && (
                  <CheckCircle className="h-4 w-4 text-[#10b981]" />
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={(date) => {
                onValueChange?.(date);
                setIsOpen(false);
              }}
              disabled={(date) => {
                if (disabled) return true;
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return false;
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {hint && !error && !success && (
          <p className="text-xs text-[#6b7280]">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-[#ff5959] flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}
        {success && (
          <p className="text-xs text-[#10b981] flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {success}
          </p>
        )}
      </div>
    );
  }
);
DatePicker.displayName = "DatePicker";

export { DatePicker };
