'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Type, Palette, Square, Image, Maximize } from 'lucide-react';

interface FontOption {
  value: string;
  label: string;
}

interface BackgroundOption {
  value: string;
  label: string;
}

interface CardStyleOption {
  value: string;
  label: string;
}

interface FontSizeOption {
  value: string;
  label: string;
}

interface ExportFormat {
  value: string;
  label: string;
}

interface InspectorProps {
  // Font settings
  fontOptions: FontOption[];
  selectedFont: string;
  onFontChange: (font: string) => void;

  // Background settings
  backgroundOptions: BackgroundOption[];
  selectedBackground: string;
  onBackgroundChange: (bg: string) => void;

  // Card style settings
  cardStyleOptions: CardStyleOption[];
  selectedCardStyle: string;
  onCardStyleChange: (style: string) => void;

  // Font size settings
  fontSizes16_9: FontSizeOption[];
  fontSizes9_16: FontSizeOption[];
  selectedFontSize16_9: string;
  selectedFontSize9_16: string;
  onFontSize16_9Change: (size: string) => void;
  onFontSize9_16Change: (size: string) => void;

  // Export settings
  exportFormats: ExportFormat[];
  selectedFormat: string;
  selectedFileType: 'png' | 'jpeg';
  onFormatChange: (format: string) => void;
  onFileTypeChange: (type: 'png' | 'jpeg') => void;
}

export function Inspector({
  fontOptions,
  selectedFont,
  onFontChange,
  backgroundOptions,
  selectedBackground,
  onBackgroundChange,
  cardStyleOptions,
  selectedCardStyle,
  onCardStyleChange,
  fontSizes16_9,
  fontSizes9_16,
  selectedFontSize16_9,
  selectedFontSize9_16,
  onFontSize16_9Change,
  onFontSize9_16Change,
  exportFormats,
  selectedFormat,
  selectedFileType,
  onFormatChange,
  onFileTypeChange
}: InspectorProps) {
  return (
    <aside className="w-72 border-l border-border bg-card/30 flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Parametres</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Police */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Type className="h-4 w-4" />
              Police
            </Label>
            <Select value={selectedFont} onValueChange={onFontChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Arriere-plan */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Palette className="h-4 w-4" />
              Arriere-plan
            </Label>
            <Select value={selectedBackground} onValueChange={onBackgroundChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {backgroundOptions.map((bg) => (
                  <SelectItem key={bg.value} value={bg.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${bg.value}`} />
                      {bg.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Style de carte */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Square className="h-4 w-4" />
              Style de carte
            </Label>
            <Select value={selectedCardStyle} onValueChange={onCardStyleChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cardStyleOptions.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tailles de police */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Maximize className="h-4 w-4" />
              Tailles de police
            </Label>

            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">Format 16:9</span>
              <Select value={selectedFontSize16_9} onValueChange={onFontSize16_9Change}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontSizes16_9.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">Format 9:16</span>
              <Select value={selectedFontSize9_16} onValueChange={onFontSize9_16Change}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontSizes9_16.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Export */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Image className="h-4 w-4" />
              Export
            </Label>

            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">Format</span>
              <ToggleGroup
                type="single"
                value={selectedFormat}
                onValueChange={(value) => value && onFormatChange(value)}
                className="justify-start"
              >
                {exportFormats.map((format) => (
                  <ToggleGroupItem key={format.value} value={format.value} className="text-xs">
                    {format.value}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">Type de fichier</span>
              <ToggleGroup
                type="single"
                value={selectedFileType}
                onValueChange={(value) => value && onFileTypeChange(value as 'png' | 'jpeg')}
                className="justify-start"
              >
                <ToggleGroupItem value="png" className="text-xs">
                  PNG
                </ToggleGroupItem>
                <ToggleGroupItem value="jpeg" className="text-xs">
                  JPEG
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
