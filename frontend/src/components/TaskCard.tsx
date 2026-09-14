import React from "react";
import { MoreHorizontal, Calendar, Clock, Edit2, Trash2 } from "lucide-react";
import { TaskFormData } from "./TaskForm";

export interface Task extends TaskFormData {
  id: string;
  createdAt: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const priorityColors = {
  HIGH: "bg-priority-high/10 text-priority-high border-priority-high/20",
  MEDIUM:
    "bg-priority-medium/10 text-priority-medium border-priority-medium/20",
  LOW: "bg-priority-low/10 text-priority-low border-priority-low/20",
};

const priorityLabels = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-shadow p-4 group relative">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${priorityColors[task.priority]}`}
          >
            {priorityLabels[task.priority]}
          </span>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-md hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Task options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-100 z-10 py-1">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit(task);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onDelete(task);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <h4 className="text-sm font-semibold text-gray-900 mb-1">{task.title}</h4>

      {task.description && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      <div className="mt-4 flex items-center text-xs text-gray-400 justify-between">
        {task.dueDate ? (
          <div
            className={`flex items-center ${isOverdue && task.status !== "DONE" ? "text-red-500" : ""}`}
          >
            <Calendar className="w-3.5 h-3.5 mr-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        ) : (
          <div /> // Spacer
        )}
        <div className="flex items-center">
          <Clock className="w-3.5 h-3.5 mr-1" />
          {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
