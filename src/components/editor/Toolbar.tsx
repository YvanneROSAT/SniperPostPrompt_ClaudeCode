'use client';

import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/theme/mode-toggle';
import { Download, Sparkles, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ToolbarProps {
  onExport: (quality: '1x' | '2x') => void;
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              disabled={!canExport}
              size="sm"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exporter {exportFormat}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExport('1x')}>
              <span className="font-medium">1080P</span>
              <span className="ml-2 text-xs text-muted-foreground">
                {exportFormat === '16:9' ? '1920x1080' : '1080x1920'}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('2x')}>
              <span className="font-medium">4K</span>
              <span className="ml-2 text-xs text-muted-foreground">
                {exportFormat === '16:9' ? '3840x2160' : '2160x3840'}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
