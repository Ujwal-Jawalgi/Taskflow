import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TaskForm } from "../src/components/TaskForm";

describe("TaskForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly by default", () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    expect(
      screen.getByRole("button", { name: /save task/i }),
    ).toBeInTheDocument();
  });

  it("renders edit mode when initialData is provided", () => {
    render(
      <TaskForm
        initialData={{
          id: "1",
          title: "Test Task",
          status: "TODO",
          priority: "MEDIUM",
        }}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />,
    );
    expect(
      screen.getByRole("button", { name: /save task/i }),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
  });

  it("shows validation error if title is empty", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    const form = screen
      .getByRole("button", { name: /save task/i })
      .closest("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with valid data", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "New Description" },
    });

    const form = screen
      .getByRole("button", { name: /save task/i })
      .closest("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      console.log("mockOnSubmit called with:", mockOnSubmit.mock.calls[0][0]);
    });
  });

  it("calls onCancel when cancel button is clicked", () => {
    render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
