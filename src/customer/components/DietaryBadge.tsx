import React from 'react';
import { DietaryType } from '../../types';

interface Props {
  type: DietaryType;
  showLabel?: boolean;
}

export const DietaryBadge: React.FC<Props> = ({ type, showLabel = false }) => {
  if (type === 'veg') {
    return (
      <div className="inline-flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-xs border-2 border-emerald-600 flex items-center justify-center bg-white p-0.5" title="Pure Vegetarian">
          <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
        </div>
        {showLabel && <span className="text-[11px] font-bold text-emerald-700">Pure Veg</span>}
      </div>
    );
  }

  if (type === 'jain') {
    return (
      <div className="inline-flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-xs border-2 border-amber-600 flex items-center justify-center bg-white p-0.5" title="Jain Satvik (No Onion / Garlic)">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
        </div>
        {showLabel && <span className="text-[11px] font-bold text-amber-700">Jain Satvik</span>}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="w-4 h-4 rounded-xs border-2 border-rose-600 flex items-center justify-center bg-white p-0.5" title="Non-Vegetarian">
        <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-rose-600"></div>
      </div>
      {showLabel && <span className="text-[11px] font-bold text-rose-700">Non-Veg</span>}
    </div>
  );
};
