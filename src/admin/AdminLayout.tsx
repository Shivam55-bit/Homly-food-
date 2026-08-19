import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../store';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { AdminMobileNav } from './components/AdminMobileNav';

export const AdminLayout: React.FC = () => {
  const { sidebarCollapsed, theme, mobileDeviceFrame } = useAppSelector((state) => state.ui);

  if (mobileDeviceFrame) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <div className="min-h-screen bg-slate-950 py-4 px-2 sm:px-4 flex items-center justify-center">
          <div className="mobile-viewport-container bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative flex flex-col w-full border-8 border-slate-800 shadow-2xl rounded-[36px] overflow-hidden max-h-[92vh]">
            <AdminHeader />
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-0">
              <Outlet />
            </main>
            {/* Dedicated In-Frame Mobile Nav */}
            <AdminMobileNav isFrame={true} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
        {/* Desktop Collapsible Sidebar (Hidden on mobile < 768px) */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>
        
        {/* Main Content Area: Zero left-padding on mobile screens */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            sidebarCollapsed ? 'pl-0 md:pl-20' : 'pl-0 md:pl-64'
          }`}
        >
          <AdminHeader />
          <main className="flex-1 pb-24 md:pb-16 overflow-x-hidden">
            <Outlet />
          </main>
        </div>

        {/* Global Mobile Bottom Navigation Bar (< 768px) */}
        <AdminMobileNav isFrame={false} />
      </div>
    </div>
  );
};
