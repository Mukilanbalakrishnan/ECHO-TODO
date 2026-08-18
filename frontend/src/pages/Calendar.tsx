import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

export const Calendar: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-20">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 mb-6 text-indigo-500">
        <CalendarIcon size={40} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Calendar View</h2>
      <p className="text-slate-500 max-w-md">
        This feature is coming soon. You will be able to view and manage your tasks in a monthly calendar layout.
      </p>
    </div>
  );
};
