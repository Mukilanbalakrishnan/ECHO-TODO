import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import type { User } from '../../types';

interface HeaderProps {
  user: User | null;
  onOpenSidebar: () => void;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ user, onOpenSidebar, title = 'To-Do', subtitle = 'Manage and organize your tasks' }) => {
  return (
    <header className="flex h-16 items-center justify-between bg-white px-4 sm:px-8 border-b border-slate-200">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
          <p className="hidden sm:block text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex relative items-center">
          <Search size={16} className="absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Quick search..."
            className="h-9 w-64 rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-slate-700">{user?.name || 'User'}</span>
            <span className="text-xs text-slate-500">@{user?.username || 'user'}</span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold border border-indigo-200">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
