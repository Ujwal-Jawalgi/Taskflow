import React from "react";
import { Filter, ArrowUpDown } from "lucide-react";

export interface FilterState {
  status: string;
  priority: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface TaskFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const handleSortToggle = (field: string) => {
    if (filters.sortBy === field) {
      onChange({
        ...filters,
        sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
      });
    } else {
      onChange({ ...filters, sortBy: field, sortOrder: "desc" });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center space-x-4 overflow-x-auto pb-2 sm:pb-0">
        <div className="flex items-center text-sm font-medium text-gray-500 mr-2">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </div>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="text-sm border-0 bg-gray-50 rounded-md py-1.5 pl-3 pr-8 text-gray-700 focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => handleFilterChange("priority", e.target.value)}
          className="text-sm border-0 bg-gray-50 rounded-md py-1.5 pl-3 pr-8 text-gray-700 focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-500 mr-2 flex items-center">
          <ArrowUpDown className="w-4 h-4 mr-1" />
          Sort by
        </span>
        <button
          onClick={() => handleSortToggle("dueDate")}
          className={`text-sm px-3 py-1.5 rounded-md flex items-center transition-colors ${
            filters.sortBy === "dueDate"
              ? "bg-brand-100 text-brand-700 font-medium"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Due Date{" "}
          {filters.sortBy === "dueDate" &&
            (filters.sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button
          onClick={() => handleSortToggle("createdAt")}
          className={`text-sm px-3 py-1.5 rounded-md flex items-center transition-colors ${
            filters.sortBy === "createdAt"
              ? "bg-brand-100 text-brand-700 font-medium"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Created{" "}
          {filters.sortBy === "createdAt" &&
            (filters.sortOrder === "asc" ? "↑" : "↓")}
        </button>
      </div>
    </div>
  );
}
