import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  trend,
  isPositive = true,
  icon: Icon,
  iconBgColor = 'bg-emerald-50 dark:bg-emerald-950/50',
  iconColor = 'text-emerald-600 dark:text-emerald-400'
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {title}
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            {value}
          </div>
        </div>

        <div className={`w-12 h-12 rounded-2xl ${iconBgColor} ${iconColor} flex items-center justify-center flex-shrink-0 shadow-xs`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800/80">
        {trend && (
          <div className={`flex items-center gap-1 font-extrabold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{trend}</span>
          </div>
        )}
        {subtext && <span className="text-slate-400 text-[11px] truncate">{subtext}</span>}
      </div>
    </div>
  );
};
