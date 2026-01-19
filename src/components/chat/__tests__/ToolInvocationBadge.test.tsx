import { render, screen, cleanup } from "@testing-library/react";
import { expect, test, vi, afterEach } from "vitest";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

vi.mock("lucide-react", () => ({
  Loader2: ({ className, "data-testid": testId }: any) => (
    <div className={className} data-testid={testId}>
      Loading...
    </div>
  ),
}));

afterEach(() => {
  cleanup();
});

test("renders 'Creating file' message for str_replace_editor create command", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "result",
        result: "File created",
      }}
    />
  );

  expect(screen.getByText("Creating file: /App.jsx")).toBeDefined();
});

test("renders 'Editing file' message for str_replace_editor str_replace command", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "str_replace_editor",
        args: { command: "str_replace", path: "/Button.tsx" },
        state: "result",
        result: "Replaced 1 occurrence",
      }}
    />
  );

  expect(screen.getByText("Editing file: /Button.tsx")).toBeDefined();
});

test("renders 'Editing file' message for str_replace_editor insert command", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "str_replace_editor",
        args: { command: "insert", path: "/utils.ts" },
        state: "result",
        result: "Text inserted",
      }}
    />
  );

  expect(screen.getByText("Editing file: /utils.ts")).toBeDefined();
});

test("renders 'Viewing file' message for str_replace_editor view command", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "str_replace_editor",
        args: { command: "view", path: "/index.tsx" },
        state: "result",
        result: "file content",
      }}
    />
  );

  expect(screen.getByText("Viewing file: /index.tsx")).toBeDefined();
});

test("renders 'Renaming' message for file_manager rename command", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "file_manager",
        args: { command: "rename", path: "/old.tsx", new_path: "/new.tsx" },
        state: "result",
        result: { success: true },
      }}
    />
  );

  expect(screen.getByText("Renaming: /old.tsx → /new.tsx")).toBeDefined();
});

test("renders 'Deleting' message for file_manager delete command", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "file_manager",
        args: { command: "delete", path: "/temp.tsx" },
        state: "result",
        result: { success: true },
      }}
    />
  );

  expect(screen.getByText("Deleting: /temp.tsx")).toBeDefined();
});

test("shows loading spinner when state is not 'result'", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "call",
      }}
    />
  );

  expect(screen.getByTestId("loading-indicator")).toBeDefined();
  expect(screen.queryByTestId("success-indicator")).toBeNull();
});

test("shows green success indicator when state is 'result'", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "result",
        result: "File created",
      }}
    />
  );

  expect(screen.getByTestId("success-indicator")).toBeDefined();
  expect(screen.queryByTestId("loading-indicator")).toBeNull();
});

test("falls back to tool name for unknown tools", () => {
  render(
    <ToolInvocationBadge
      tool={{
        toolName: "unknown_tool",
        args: { some: "args" },
        state: "result",
        result: "done",
      }}
    />
  );

  expect(screen.getByText("unknown_tool")).toBeDefined();
});
