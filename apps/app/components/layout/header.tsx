import { Button } from "@repo/ui";
import { Menu, Settings, X } from "lucide-react";

interface IHeaderProps {
  isSidebarOpen: boolean;
  onMenuToggle: () => void;
}

export function Header({ isSidebarOpen, onMenuToggle }: IHeaderProps) {
  return (
    <header
      className="h-14 border-b bg-background flex items-center px-4 gap-4"
      data-testid="Header"
    >
      <Button
        aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        variant="ghost"
        size="icon"
        onClick={onMenuToggle}
        className="shrink-0"
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      <div className="flex-1 flex items-center gap-4">
        <h1 className="text-lg font-semibold">Application</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          aria-label="Open application settings"
          variant="ghost"
          size="icon"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
