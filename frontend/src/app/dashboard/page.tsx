"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api, { getAccessToken } from "../../lib/api";
import { io, Socket } from "socket.io-client";
import { LogOut, Plus, SearchX } from "lucide-react";
import { Task, TaskCard } from "../../components/TaskCard";
import { TaskFilters, FilterState } from "../../components/TaskFilters";
import { Pagination } from "../../components/Pagination";
import { Modal } from "../../components/Modal";
import { TaskForm, TaskFormData } from "../../components/TaskForm";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import ThemeToggle from "../../components/ThemeToggle";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    status: "",
    priority: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Standard limit

  // Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Protect route
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  // Setup Socket.io
  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io(
        process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000",
        {
          auth: { token: getAccessToken() },
        },
      );

      const refreshTasks = () =>
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      newSocket.on("task:created", refreshTasks);
      newSocket.on("task:updated", refreshTasks);
      newSocket.on("task:deleted", refreshTasks);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, queryClient]);

  // Fetch tasks
  const {
    data: response,
    isLoading: isTasksLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks", page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.sortBy && { sortBy: filters.sortBy }),
        ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
      });
      const res = await api.get(`/tasks?${params.toString()}`);
      return res.data;
    },
    enabled: isAuthenticated,
  });

  // Mutations
  const createTaskMutation = useMutation({
    mutationFn: (data: TaskFormData) => api.post("/tasks", data),
    onSuccess: () => {
      setIsTaskModalOpen(false);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskFormData> }) =>
      api.patch(`/tasks/${id}`, data),
    onSuccess: () => {
      setIsTaskModalOpen(false);
      setEditingTask(null);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      setDeletingTask(null);
    },
  });

  // Derived state
  const tasks: Task[] = response?.data || [];
  const totalPages = response?.pagination?.totalPages || 1;
  const isLoading = isAuthLoading || (isAuthenticated && isTasksLoading);

  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((t) => t.status === "DONE");

  // Handlers
  const openCreateModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const openDeleteModal = (task: Task) => {
    setDeletingTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleTaskSubmit = (data: TaskFormData) => {
    if (editingTask) {
      updateTaskMutation.mutate({ id: editingTask.id, data });
    } else {
      createTaskMutation.mutate(data);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center">
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                TaskFlow
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={openCreateModal}
                className="hidden sm:inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                title="Create New Task"
              >
                <Plus className="h-4 w-4 mr-1.5" /> New Task
              </button>
              <div className="flex items-center space-x-2 border-l pl-4 border-gray-200">
                <span className="text-sm text-gray-600 font-medium mr-2">
                  {user?.name}
                </span>
                <ThemeToggle />
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-[96rem] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        <div className="flex sm:hidden mb-6">
          <button
            onClick={openCreateModal}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700"
          >
            <Plus className="h-4 w-4 mr-1.5" /> New Task
          </button>
        </div>

        <TaskFilters
          filters={filters}
          onChange={(f) => {
            setFilters(f);
            setPage(1);
          }}
        />

        {isError ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-red-100">
            <div className="bg-red-50 p-3 rounded-full">
              <SearchX className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Failed to load tasks
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Please try refreshing the page.
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-gray-200 border-dashed">
            <div className="bg-gray-50 p-3 rounded-full mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              No tasks found
            </h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm text-center mb-6">
              {filters.status || filters.priority
                ? "Try adjusting your filters to see more tasks."
                : "Get started by creating a new task and organizing your workflow."}
            </p>
            {!filters.status && !filters.priority && (
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-brand-700 bg-brand-100 hover:bg-brand-200"
              >
                Create your first task
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-start mb-6">
              {/* TODO Column */}
              <div className="flex flex-col bg-gray-100/50 rounded-xl p-4 min-h-[500px]">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center justify-between uppercase tracking-wider">
                  To Do{" "}
                  <span className="bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {todoTasks.length}
                  </span>
                </h3>
                <div className="flex flex-col space-y-3">
                  {todoTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={openEditModal}
                      onDelete={openDeleteModal}
                    />
                  ))}
                  {todoTasks.length === 0 && (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex items-center justify-center text-sm text-gray-400">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>

              {/* IN PROGRESS Column */}
              <div className="flex flex-col bg-gray-100/50 rounded-xl p-4 min-h-[500px]">
                <h3 className="text-sm font-semibold text-brand-700 mb-4 flex items-center justify-between uppercase tracking-wider">
                  In Progress{" "}
                  <span className="bg-brand-100 text-brand-700 py-0.5 px-2 rounded-full text-xs">
                    {inProgressTasks.length}
                  </span>
                </h3>
                <div className="flex flex-col space-y-3">
                  {inProgressTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={openEditModal}
                      onDelete={openDeleteModal}
                    />
                  ))}
                  {inProgressTasks.length === 0 && (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex items-center justify-center text-sm text-gray-400">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>

              {/* DONE Column */}
              <div className="flex flex-col bg-gray-100/50 rounded-xl p-4 min-h-[500px]">
                <h3 className="text-sm font-semibold text-green-700 mb-4 flex items-center justify-between uppercase tracking-wider">
                  Done{" "}
                  <span className="bg-green-100 text-green-700 py-0.5 px-2 rounded-full text-xs">
                    {doneTasks.length}
                  </span>
                </h3>
                <div className="flex flex-col space-y-3">
                  {doneTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={openEditModal}
                      onDelete={openDeleteModal}
                    />
                  ))}
                  {doneTasks.length === 0 && (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex items-center justify-center text-sm text-gray-400">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </main>

      {/* Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={editingTask ? "Edit Task" : "Create Task"}
      >
        <TaskForm
          initialData={editingTask || undefined}
          onSubmit={handleTaskSubmit}
          onCancel={() => setIsTaskModalOpen(false)}
          isSubmitting={
            createTaskMutation.isPending || updateTaskMutation.isPending
          }
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() =>
          deletingTask && deleteTaskMutation.mutate(deletingTask.id)
        }
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        isDestructive={true}
        isLoading={deleteTaskMutation.isPending}
      />
    </div>
  );
}
