import { Loader2 } from "lucide-react";

interface ToolInvocationBadgeProps {
  tool: {
    toolName: string;
    args: Record<string, any>;
    state: string;
    result?: any;
  };
}

function getToolMessage(toolName: string, args: Record<string, any>): string {
  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return `Creating file: ${args.path}`;
      case "view":
        return `Viewing file: ${args.path}`;
      case "str_replace":
      case "insert":
        return `Editing file: ${args.path}`;
    }
  }

  if (toolName === "file_manager") {
    switch (args.command) {
      case "rename":
        return `Renaming: ${args.path} → ${args.new_path}`;
      case "delete":
        return `Deleting: ${args.path}`;
    }
  }

  return toolName;
}

export function ToolInvocationBadge({ tool }: ToolInvocationBadgeProps) {
  const message = getToolMessage(tool.toolName, tool.args);
  const isComplete = tool.state === "result" && tool.result;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isComplete ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" data-testid="success-indicator"></div>
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" data-testid="loading-indicator" />
      )}
      <span className="text-neutral-700">{message}</span>
    </div>
  );
}
