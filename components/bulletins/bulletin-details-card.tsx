"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Calendar,
  Building2,
  FileText,
} from "lucide-react";
import { Card } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Bulletin } from "@/api/types/bulleten";
import { Button } from "@/ui/button";

interface BulletinDetailsCardProps {
  bulletin: Bulletin;
}

export function BulletinDetailsCard({ bulletin }: BulletinDetailsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDeadlineLabel = (periodType: string) => {
    switch (periodType) {
      case "weekly":
        return "Haftalik";
      case "monthly":
        return "Oylik";
      case "quarterly":
        return "Choraklik";
      case "every_n_months":
        return "Har n oy";
      default:
        return periodType;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="p-4">
      {/* Always visible section - clickable */}
      <div
        className="space-y-3 text-sm grid grid-cols-12 cursor-pointer hover:bg-[var(--muted)]/10 p-2 rounded-md transition-colors relative"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-2 col-span-3">
          <FileText className="h-4 w-4 text-[var(--muted-foreground)] mt-0.5" />
          <div>
            <span className="text-[var(--muted-foreground)]">Nomi:</span>
            <p className="font-bold text-[var(--foreground)]">
              {bulletin.name}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 col-span-2">
          <FileText className="h-4 w-4 text-[var(--muted-foreground)] mt-0.5" />
          <div>
            <span className="text-[var(--muted-foreground)]">Tavsif:</span>
            <p className="font-bold text-[var(--foreground)]">
              {bulletin.description || "Tavsif yo'q"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 col-span-2">
          <Calendar className="h-4 w-4 text-[var(--muted-foreground)] mt-0.5" />
          <div>
            <span className="text-[var(--muted-foreground)]">
              Joriy muddat:
            </span>
            <p className="font-bold text-[var(--foreground)]">
              {bulletin.deadline?.current_deadline
                ? formatDate(bulletin.deadline.current_deadline)
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 col-span-5">
          <Building2 className="h-4 w-4 text-[var(--muted-foreground)] mt-0.5" />
          <div className="flex-1">
            <span className="text-[var(--muted-foreground)]">
              Tashkilotlar:
            </span>
            <div className="mt-1 flex flex-wrap gap-1">
              {bulletin.main_organizations_list?.map((org) => (
                <div key={org.id} className="flex items-center gap-1">
                  <Badge variant="primary" className="text-xs">
                    {org.name}
                  </Badge>
                  {org.secondary_organizations &&
                    org.secondary_organizations.length > 0 && (
                      <span className="text-[var(--muted-foreground)] text-xs">
                        :
                      </span>
                    )}
                  {org.secondary_organizations?.slice(0, 2).map((dept) => (
                    <Badge
                      key={dept.id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {dept.name}
                    </Badge>
                  ))}
                  {org.secondary_organizations &&
                    org.secondary_organizations.length > 2 && (
                      <span className="text-[var(--muted-foreground)] text-xs">
                        +{org.secondary_organizations.length - 2}
                      </span>
                    )}
                </div>
              )) || (
                <span className="text-[var(--muted-foreground)] text-sm">
                  Tashkilotlar yo'q
                </span>
              )}
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-0 bg-white text-primary hover:text-white"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4 " />
          )}
        </Button>
      </div>

      {/* Expanded view - only additional details */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-3">
          {/* Additional deadline details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[var(--muted-foreground)]">
                Muddat turi:
              </span>
              <span className="ml-1 font-bold text-[var(--foreground)]">
                {getDeadlineLabel(bulletin.deadline?.period_type)}
              </span>
            </div>
            <div>
              <span className="text-[var(--muted-foreground)]">Muddat:</span>
              <span className="ml-1 font-bold text-[var(--foreground)]">
                {bulletin.deadline?.period_start
                  ? formatDate(bulletin.deadline.current_deadline)
                  : "N/A"}
              </span>
            </div>

            <div>
              <span className="text-[var(--muted-foreground)]">
                Yaratilgan sanasi:
              </span>
              <span className="ml-1 font-bold text-[var(--foreground)]">
                {bulletin.deadline?.period_start
                  ? formatDate(bulletin.deadline.period_start)
                  : "N/A"}
              </span>
            </div>

            <div>
              <span className="text-[var(--muted-foreground)] text-xs">
                Mas'ul xodimlar:
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {bulletin.employees_list?.map((employee) => (
                  <Badge
                    key={employee.id}
                    variant="outline"
                    className="text-xs"
                  >
                    {employee.first_name} {employee.last_name}
                  </Badge>
                )) || (
                  <span className="text-[var(--muted-foreground)] text-xs">
                    Xodimlar yo'q
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
