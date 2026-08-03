import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accentColorClass: string;
  hoverBorderClass: string;
  bgIconClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  accentColorClass,
  hoverBorderClass,
  bgIconClass,
}) => {
  return (
    <div
      className={`bg-[#18181B] border border-[#27272A] p-5 rounded-2xl flex items-center justify-between shadow-sm transition-colors ${hoverBorderClass}`}
    >
      <div>
        <p className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
          {label}
        </p>
        <p className={`text-2xl md:text-3xl font-bold mt-1 ${accentColorClass}`}>
          {value}
        </p>
      </div>
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center border ${bgIconClass}`}
      >
        {icon}
      </div>
    </div>
  );
};
