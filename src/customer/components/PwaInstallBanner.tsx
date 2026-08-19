import React, { useState } from 'react';
import { Smartphone, Download, X, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useAppDispatch } from '../../store';
import { addToast } from '../../store/slices/uiSlice';

export const PwaInstallBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);
  const dispatch = useAppDispatch();

  if (dismissed) return null;

  const handleInstall = () => {
    setInstalled(true);
    dispatch(
      addToast({
        type: 'success',
        title: 'App Ready to Install!',
        message: 'Homly Food icon added to your device home screen.'
      })
    );
    setTimeout(() => setDismissed(true), 1500);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 text-white rounded-2xl p-4 shadow-xl border border-orange-500/20 relative overflow-hidden my-4">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl"></div>

      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-lg flex-shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-white">
                Install Homly Food App
              </h4>
              <span className="bg-orange-500/30 text-orange-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-orange-400/30">
                PWA
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Order meals in 1-tap, get real-time rider GPS tracking, and pause deliveries on the go!
            </p>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-amber-300">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Instant Loading
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> 100% Safe & Light
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2 relative z-10 pt-2 border-t border-white/10">
        <button
          onClick={handleInstall}
          disabled={installed}
          className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-75"
        >
          {installed ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Installed Successfully!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Install to Home Screen</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
