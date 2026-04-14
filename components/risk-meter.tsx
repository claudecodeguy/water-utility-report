import React from "react";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/types";

interface RiskMeterProps {
  level: RiskLevel;
  score?: number;
  className?: string;
  showLabel?: boolean;
}

const zones = [
  { id: "safe", label: "No Concern", color: "#166534", width: "20%" },
  { id: "low", label: "Low", color: "#4ADE80", width: "20%" },
  { id: "moderate", label: "Moderate", color: "#F59E0B", width: "20%" },
  { id: "high", label: "High", color: "#EA580C", width: "20%" },
  { id: "critical", label: "Critical", color: "#B91C1C", width: "20%" },
];

const levelIndex: Record<RiskLevel, number> = {
  safe: 0,
  low: 1,
  moderate: 2,
  high: 3,
  critical: 4,
};

const levelConfig = {
  safe: {
    label: "No Concerns Detected",
    desc: "Water meets all safety standards with no detected exceedances.",
    color: "#166534",
    bgClass: "bg-wur-safe-bg",
    textClass: "text-wur-safe",
  },
  low: {
    label: "Low Concern",
    desc: "Minor detections below regulatory limits. Routine monitoring adequate.",
    color: "#4ADE80",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
  },
  moderate: {
    label: "Moderate Concern",
    desc: "Contaminants detected within limits but elevated. Consider filtration.",
    color: "#F59E0B",
    bgClass: "bg-wur-caution-bg",
    textClass: "text-wur-caution",
  },
  high: {
    label: "High Concern",
    desc: "Elevated contaminant levels detected. Filtration recommended.",
    color: "#EA580C",
    bgClass: "bg-wur-warning-bg",
    textClass: "text-wur-warning",
  },
  critical: {
    label: "Action Required",
    desc: "Violations recorded or levels exceeding regulatory limits.",
    color: "#B91C1C",
    bgClass: "bg-wur-danger-bg",
    textClass: "text-wur-danger",
  },
};

export default function RiskMeter({ level, score, className, showLabel = true }: RiskMeterProps) {
  const idx = levelIndex[level];
  const config = levelConfig[level];
  // Marker position: center of the active zone (each zone is 20%)
  const markerPct = idx * 20 + 10;

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className={cn("text-xs font-semibold uppercase tracking-widest", config.textClass)}>
              Overall Risk Level
            </span>
            <p className={cn("text-lg font-semibold mt-0.5", config.textClass)}>
              {config.label}
            </p>
          </div>
          {score !== undefined && (
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-lg font-mono font-semibold border-2", config.bgClass, config.textClass, "border-current")}>
              {score}
            </div>
          )}
        </div>
      )}

      {/* Bar */}
      <div className="relative">
        <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="flex-1 rounded-sm transition-opacity"
              style={{
                backgroundColor: zone.color,
                opacity: zones.findIndex(z => z.id === level) >= zones.findIndex(z => z.id === zone.id) ? 1 : 0.18,
              }}
            />
          ))}
        </div>

        {/* Marker */}
        <div
          className="absolute -top-1 transition-all duration-500"
          style={{ left: `calc(${markerPct}% - 6px)` }}
        >
          <div
            className="w-3 h-5 rounded-sm shadow-md"
            style={{ backgroundColor: config.color }}
          />
        </div>

        {/* Zone labels */}
        <div className="flex mt-2.5">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className={cn(
                "flex-1 text-center text-[10px] font-medium transition-colors",
                level === zone.id ? "text-foreground font-semibold" : "text-muted-foreground/50"
              )}
            >
              {zone.label}
            </div>
          ))}
        </div>
      </div>

      {showLabel && (
        <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
          {config.desc}
        </p>
      )}
    </div>
  );
}
