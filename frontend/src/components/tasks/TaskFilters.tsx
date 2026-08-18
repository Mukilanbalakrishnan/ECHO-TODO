import React from 'react';
import { Select } from '../common/Select';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Search, FilterX } from 'lucide-react';

export interface FilterState {
  search: string;
  priority: string;
  status: string;
  sortBy: string;
}

interface TaskFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClear: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, setFilters, onClear }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col gap-4">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search tasks by title or description..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="pl-10 h-11"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          options={[
            { label: 'All Priorities', value: 'All' },
            { label: 'Urgent', value: 'Urgent' },
            { label: 'High', value: 'High' },
            { label: 'Medium', value: 'Medium' },
            { label: 'Low', value: 'Low' },
          ]}
        />
        <Select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          options={[
            { label: 'All Statuses', value: 'All' },
            { label: 'Pending', value: 'Pending' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Completed', value: 'Completed' },
          ]}
        />
        <Select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          options={[
            { label: 'Recently Created', value: 'createdAt-desc' },
            { label: 'Oldest Created', value: 'createdAt-asc' },
            { label: 'Due Date: Earliest', value: 'dueDate-asc' },
            { label: 'Due Date: Latest', value: 'dueDate-desc' },
            { label: 'Priority: High to Low', value: 'priority-desc' },
            { label: 'Priority: Low to High', value: 'priority-asc' },
          ]}
        />
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={onClear}
        >
          <FilterX size={16} />
          Clear Filters
        </Button>
      </div>
    </div>
  );
};
