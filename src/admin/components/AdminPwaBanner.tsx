import React, { useState } from 'react';
import { Smartphone, Download, X, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useAppDispatch } from '../../store';
import { addToast } from '../../store/slices/uiSlice';

export const AdminPwaBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);
  const dispatch = useAppDispatch();

  if (dismissed) return null;

  const handleInstall = () => {
    setInstalled(true);
    dispatch(
      addToast({
        type: 'success',
        title: 'Admin App Ready!',
        message: 'Homly Food Kitchen CRM icon added to your mobile home screen.'
      })
    );
    setTimeout(() => setDismissed(true), 1500);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-4 shadow-xl border border-emerald-500/30 relative overflow-hidden mb-5">
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-900 shadow-md font-black flex-shrink-0">
            <Smartphone className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-white">
                Install Kitchen Admin App (PWA)
              </h4>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-400/30">
                PWA Mobile
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 leading-snug">
              Manage tiffin packing, check 1 vs 2 sabjis, track collections & udhar from your phone screen.
            </p>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-2">
        <button
          onClick={handleInstall}
          disabled={installed}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-75"
        >
          {installed ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Installed Successfully!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Install Admin App to Home Screen</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
