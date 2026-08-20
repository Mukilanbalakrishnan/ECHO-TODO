import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../hooks/useAuth';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return { title: 'Dashboard', subtitle: 'Overview of your tasks and productivity' };
      case '/todo': return { title: 'To-Do', subtitle: 'Manage and organize your tasks' };
      case '/completed': return { title: 'Completed', subtitle: 'Tasks you have finished' };
      case '/calendar': return { title: 'Calendar', subtitle: 'View tasks by due date' };
      case '/settings': return { title: 'Settings', subtitle: 'Manage your preferences' };
      default: return { title: 'To-Do', subtitle: 'Manage and organize your tasks' };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:block z-10 shadow-[1px_0_10px_rgba(0,0,0,0.03)]">
        <Sidebar onLogout={logout} />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 shadow-xl md:hidden"
            >
              <Sidebar onLogout={logout} onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <Header 
          user={user} 
          onOpenSidebar={() => setIsSidebarOpen(true)} 
          title={title}
          subtitle={subtitle}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-full p-4 sm:p-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
