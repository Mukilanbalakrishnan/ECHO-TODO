import React from 'react';
import { motion } from 'framer-motion';
import type { Task } from '../../types';

interface TaskStatsProps {
  tasks: Task[];
}

export const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;

  const stats = [
    { label: 'Total Tasks', value: total, color: 'bg-slate-100 text-slate-700' },
    { label: 'Pending', value: pending, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'In Progress', value: inProgress, color: 'bg-indigo-100 text-indigo-700' },
    { label: 'Completed', value: completed, color: 'bg-emerald-100 text-emerald-700' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
        >
          <span className="text-sm font-medium text-slate-500">{stat.label}</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">{stat.value}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
