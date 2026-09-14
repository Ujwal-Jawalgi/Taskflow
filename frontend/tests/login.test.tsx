import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../src/app/login/page";
import api from "../src/lib/api";
import { AuthProvider } from "../src/context/AuthContext";

// Mock api
jest.mock("../src/lib/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

const mockApi = api as jest.Mocked<typeof api>;

// Mock AuthContext checkAuth so it doesn't make real requests
jest.mock("../src/context/AuthContext", () => ({
  ...jest.requireActual("../src/context/AuthContext"),
  useAuth: () => ({
    login: jest.fn(),
  }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form", () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("displays validation errors on empty submit", async () => {
    render(<LoginPage />);
    const form = screen
      .getByRole("button", { name: /sign in/i })
      .closest("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it("submits form successfully and calls api.post", async () => {
    mockApi.post.mockResolvedValueOnce({
      data: {
        accessToken: "token123",
        user: { id: "1", email: "test@test.com" },
      },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith("/auth/login", {
        email: "test@test.com",
        password: "password123",
      });
    });
  });

  it("displays server error when login fails", async () => {
    mockApi.post.mockRejectedValueOnce({
      response: { data: { error: { message: "Invalid credentials" } } },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
