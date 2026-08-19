import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../store';
import { CustomerNavbar } from './components/CustomerNavbar';
import { BottomNav } from './components/BottomNav';

export const CustomerLayout: React.FC = () => {
  const mobileDeviceFrame = useAppSelector((state) => state.ui.mobileDeviceFrame);

  if (mobileDeviceFrame) {
    return (
      <div className="min-h-screen bg-slate-950 py-4 px-2 sm:px-4 flex items-center justify-center">
        <div className="mobile-viewport-container bg-[#fcfaf8] relative flex flex-col w-full border-8 border-slate-800 shadow-2xl rounded-[36px] overflow-hidden max-h-[92vh]">
          <CustomerNavbar />
          <main className="flex-1 overflow-y-auto pb-16">
            <Outlet />
          </main>
          <BottomNav isFrame={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf8] flex flex-col text-slate-800">
      <CustomerNavbar />
      <main className="flex-1 pb-20 md:pb-12">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
