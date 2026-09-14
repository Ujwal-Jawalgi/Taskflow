import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z
    .string()
    .max(500, "Description is too long")
    .optional()
    .nullable(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  dueDate: z.string().optional().nullable(),
});

export type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TaskForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      status: initialData?.status || "TODO",
      priority: initialData?.priority || "MEDIUM",
      dueDate: initialData?.dueDate
        ? new Date(initialData.dueDate).toISOString().slice(0, 10)
        : "",
    },
  });

  // Reset form when initialData changes (useful for edit mode when Modal stays mounted)
  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().slice(0, 10)
          : "",
      });
    }
  }, [initialData, reset]);

  console.log("Errors:", errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <div className="mt-1">
          <input
            {...register("title")}
            type="text"
            id="title"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6 px-3"
            placeholder="What needs to be done?"
          />
        </div>
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <div className="mt-1">
          <textarea
            {...register("description")}
            id="description"
            rows={3}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6 px-3"
            placeholder="Add any extra details..."
          />
        </div>
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            {...register("status")}
            id="status"
            className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6 bg-white"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700"
          >
            Priority
          </label>
          <select
            {...register("priority")}
            id="priority"
            className="mt-1 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6 bg-white"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">
              {errors.priority.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700"
        >
          Due Date
        </label>
        <div className="mt-1">
          <input
            {...register("dueDate")}
            type="date"
            id="dueDate"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
        {errors.dueDate && (
          <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
        )}
      </div>

      <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full justify-center rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:ml-3 sm:w-auto disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Task"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
