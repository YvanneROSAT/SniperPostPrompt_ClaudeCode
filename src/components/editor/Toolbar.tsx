'use client';

import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/theme/mode-toggle';
import { Download, Sparkles } from 'lucide-react';

interface ToolbarProps {
  onExport: () => void;
  canExport: boolean;
  exportFormat: string;
}

export function Toolbar({
  onExport,
  canExport,
  exportFormat
}: ToolbarProps) {
  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-lg">Prompt Styler</span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Button
          onClick={onExport}
          disabled={!canExport}
          size="sm"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Exporter {exportFormat}</span>
        </Button>
      </div>
    </header>
  );
}
