'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Bold, Italic, Underline, Download, List, ListOrdered, Heading1, Heading2, Heading3 } from 'lucide-react';
import html2canvas from 'html2canvas-pro';

interface StyleSettings {
  font: string;
  background: string;
  cardStyle: string;
  title: string;
  fontSize16_9: string;
  fontSize9_16: string;
}

interface ExportSettings {
  format: string;
  fileType: 'png' | 'jpeg';
}

const FONT_STYLES = [
  { value: 'font-mono', label: 'Monospace' },
  { value: 'font-serif', label: 'Serif' },
  { value: 'font-sans', label: 'Sans-serif' },
  { value: 'font-[cursive]', label: 'Cursive' },
  { value: 'font-[fantasy]', label: 'Fantasy' }
];

const FONT_SIZES_16_9 = [
  { value: 'text-sm', label: 'Petit (14px)' },
  { value: 'text-base', label: 'Normal (16px)' },
  { value: 'text-lg', label: 'Large (18px)' },
  { value: 'text-xl', label: 'Très Large (20px)' },
  { value: 'text-2xl', label: 'XXL (24px)' },
  { value: 'text-3xl', label: 'XXXL (30px)' },
  { value: 'text-4xl', label: 'Énorme (36px)' },
  { value: 'text-5xl', label: 'Gigantesque (48px)' }
];

const FONT_SIZES_9_16 = [
  { value: 'text-base', label: 'Petit (16px)' },
  { value: 'text-lg', label: 'Normal (18px)' },
  { value: 'text-xl', label: 'Large (20px)' },
  { value: 'text-2xl', label: 'Très Large (24px)' },
  { value: 'text-3xl', label: 'XXL (30px)' },
  { value: 'text-4xl', label: 'XXXL (36px)' },
  { value: 'text-5xl', label: 'Énorme (48px)' },
  { value: 'text-6xl', label: 'Gigantesque (60px)' }
];

const BACKGROUND_STYLES = [
  { value: 'bg-gradient-to-br from-blue-400 to-purple-600', label: 'Gradient Blue' },
  { value: 'bg-gradient-to-br from-green-400 to-blue-500', label: 'Gradient Green' },
  { value: 'bg-gradient-to-br from-pink-400 to-orange-500', label: 'Gradient Pink' }
];

const CARD_STYLES = [
  { value: 'bg-white shadow-xl border-0 rounded-2xl', label: 'Modern White' },
  { value: 'bg-gray-900 text-white shadow-2xl border-gray-700 rounded-lg', label: 'Dark Theme' },
  { value: 'bg-gradient-to-br from-white to-gray-100 shadow-lg border-gray-200 rounded-xl', label: 'Subtle Gradient' }
];

const EXPORT_FORMATS = [
  { value: '16:9', label: '16:9 (1920x1080)', width: 1920, height: 1080 },
  { value: '9:16', label: '9:16 (1080x1920)', width: 1080, height: 1920 }
];

export default function PromptStyler() {
  const [promptText, setPromptText] = useState('');
  const [styleSettings, setStyleSettings] = useState<StyleSettings>({
    font: 'font-sans',
    background: 'bg-gradient-to-br from-blue-400 to-purple-600',
    cardStyle: 'bg-white shadow-xl border-0 rounded-2xl',
    title: '',
    fontSize16_9: 'text-xl',
    fontSize9_16: 'text-3xl'
  });
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: '16:9',
    fileType: 'png'
  });
  const [mounted, setMounted] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
    const savedData = localStorage.getItem('prompt-styler-data');
    if (savedData) {
      const { promptText: savedText, styleSettings: savedSettings } = JSON.parse(savedData);
      setPromptText(savedText || '');
      setStyleSettings(savedSettings || {
        font: 'font-sans',
        background: 'bg-gradient-to-br from-blue-400 to-purple-600',
        cardStyle: 'bg-white shadow-xl border-0 rounded-2xl',
        title: '',
        fontSize16_9: 'text-xl',
        fontSize9_16: 'text-3xl'
      });
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      const dataToSave = { promptText, styleSettings };
      localStorage.setItem('prompt-styler-data', JSON.stringify(dataToSave));
    }
  }, [promptText, styleSettings, mounted]);

  const insertMarkdown = (markdown: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = promptText.substring(start, end);
    
    let newText;
    if (selectedText) {
      newText = promptText.substring(0, start) + markdown + selectedText + markdown + promptText.substring(end);
    } else {
      newText = promptText.substring(0, start) + markdown + markdown + promptText.substring(start);
    }
    
    setPromptText(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + markdown.length, end + markdown.length);
    }, 0);
  };

  const insertList = (listType: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = promptText.substring(start, end);
    
    let newText;
    if (selectedText) {
      const lines = selectedText.split('\n');
      const listItems = lines.map(line => line.trim() ? listType + line.trim() : line).join('\n');
      newText = promptText.substring(0, start) + listItems + promptText.substring(end);
    } else {
      const beforeCursor = promptText.substring(0, start);
      const needsNewLine = beforeCursor.length > 0 && !beforeCursor.endsWith('\n');
      newText = beforeCursor + (needsNewLine ? '\n' : '') + listType + promptText.substring(start);
    }
    
    setPromptText(newText);
    
    setTimeout(() => {
      textarea.focus();
      const beforeCursorCheck = promptText.substring(0, start);
      const needsNewLineCheck = beforeCursorCheck.length > 0 && !beforeCursorCheck.endsWith('\n');
      const newPosition = selectedText ? start + newText.substring(start).indexOf(selectedText) + selectedText.length : start + (needsNewLineCheck ? 1 : 0) + listType.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const insertOrderedList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lines = promptText.substring(0, start).split('\n');
    
    // Compter uniquement les listes numérotées existantes
    const numberedItems = lines.filter(line => /^\d+\. /.test(line.trim())).length;
    const nextNumber = numberedItems + 1;
    
    insertList(`${nextNumber}. `);
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<u>$1</u>')
      .replace(/^### (.+)$/gm, '<h3 style="font-size: 1.25rem; font-weight: 600; margin: 0.5rem 0;">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 style="font-size: 1.5rem; font-weight: 700; margin: 0.75rem 0;">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 style="font-size: 1.875rem; font-weight: 800; margin: 1rem 0;">$1</h1>')
      .replace(/^(\d+\. .+)$/gm, '<div style="margin-left: 20px;">$1</div>')
      .replace(/^(• .+)$/gm, '<div style="margin-left: 20px;">$1</div>')
      .replace(/\n/g, '<br>');
  };

  const exportToImage = async () => {
    if (!previewRef.current) return;

    const formatConfig = EXPORT_FORMATS.find(f => f.value === exportSettings.format);
    if (!formatConfig) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      if (exportSettings.format === '9:16') {
        // LOGIQUE SPÉCIFIQUE 9:16 - Export natif sans déformation
        await exportToImage9_16(formatConfig);
      } else {
        // LOGIQUE 16:9 - Logique existante maintenue
        await exportToImage16_9(formatConfig);
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      alert(`Erreur lors de l'export de l'image: ${errorMessage}`);
    }
  };

  const exportToImage9_16 = async (formatConfig: { value: string; label: string; width: number; height: number }) => {
    // Créer un élément temporaire optimisé pour 9:16
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.top = '-9999px';
    tempContainer.style.left = '0';
    tempContainer.style.width = `${formatConfig.width}px`;
    tempContainer.style.height = `${formatConfig.height}px`;
    tempContainer.style.backgroundColor = 'transparent';

    // Cloner et optimiser le contenu pour 9:16
    const clonedPreview = previewRef.current!.cloneNode(true) as HTMLElement;
    
    // Styles optimisés pour 9:16
    clonedPreview.style.width = `${formatConfig.width}px`;
    clonedPreview.style.height = `${formatConfig.height}px`;
    clonedPreview.style.padding = '60px';
    clonedPreview.style.display = 'flex';
    clonedPreview.style.alignItems = 'center';
    clonedPreview.style.justifyContent = 'center';

    // Trouver et optimiser la card
    const card = clonedPreview.querySelector('[class*="rounded"]') as HTMLElement;
    if (card) {
      card.style.width = '95%';
      card.style.maxHeight = 'none';
      
      // Optimiser le contenu de la card
      const cardContent = card.querySelector('[class*="p-"]') as HTMLElement;
      if (cardContent) {
        cardContent.style.padding = '80px 60px';
      }

      // Optimiser le texte
      const textContainer = card.querySelector('[dangerouslySetInnerHTML]') as HTMLElement;
      if (textContainer) {
        textContainer.style.fontSize = '44px';
        textContainer.style.lineHeight = '1.6';
        textContainer.style.width = '100%';
        
        // Optimiser les éléments spécifiques
        const elements = textContainer.querySelectorAll('*');
        elements.forEach(el => {
          const element = el as HTMLElement;
          element.style.fontSize = '44px';
          element.style.lineHeight = '1.6';
          element.style.marginBottom = '24px';
          element.style.width = '100%';
          element.style.wordWrap = 'break-word';
        });
      }
    }

    tempContainer.appendChild(clonedPreview);
    document.body.appendChild(tempContainer);

    // Capturer avec html2canvas
    const canvas = await html2canvas(tempContainer, {
      width: formatConfig.width,
      height: formatConfig.height,
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false
    });

    // Nettoyer
    document.body.removeChild(tempContainer);

    // Export direct
    const mimeType = exportSettings.fileType === 'jpeg' ? 'image/jpeg' : 'image/png';
    const quality = exportSettings.fileType === 'jpeg' ? 0.9 : undefined;
    
    const link = document.createElement('a');
    link.download = `prompt-${exportSettings.format}-${Date.now()}.${exportSettings.fileType}`;
    link.href = canvas.toDataURL(mimeType, quality);
    link.click();
  };

  const exportToImage16_9 = async (formatConfig: { value: string; label: string; width: number; height: number }) => {
    // LOGIQUE SPÉCIFIQUE 16:9 - Export natif optimisé
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.top = '-9999px';
    tempContainer.style.left = '0';
    tempContainer.style.width = `${formatConfig.width}px`;
    tempContainer.style.height = `${formatConfig.height}px`;
    tempContainer.style.backgroundColor = 'transparent';

    // Cloner et optimiser le contenu pour 16:9
    const clonedPreview = previewRef.current!.cloneNode(true) as HTMLElement;
    
    // Styles optimisés pour 16:9
    clonedPreview.style.width = `${formatConfig.width}px`;
    clonedPreview.style.height = `${formatConfig.height}px`;
    clonedPreview.style.padding = '60px';
    clonedPreview.style.display = 'flex';
    clonedPreview.style.alignItems = 'center';
    clonedPreview.style.justifyContent = 'center';

    // Trouver et optimiser la card
    const card = clonedPreview.querySelector('[class*="rounded"]') as HTMLElement;
    if (card) {
      card.style.width = '75%';
      card.style.maxHeight = 'none';
      
      // Optimiser le contenu de la card
      const cardContent = card.querySelector('[class*="p-"]') as HTMLElement;
      if (cardContent) {
        cardContent.style.padding = '60px 80px';
      }

      // Optimiser le texte pour 16:9
      const textContainer = card.querySelector('[dangerouslySetInnerHTML]') as HTMLElement;
      if (textContainer) {
        textContainer.style.fontSize = '36px';
        textContainer.style.lineHeight = '1.5';
        textContainer.style.width = '100%';
        
        // Optimiser les éléments spécifiques
        const elements = textContainer.querySelectorAll('*');
        elements.forEach(el => {
          const element = el as HTMLElement;
          element.style.fontSize = '36px';
          element.style.lineHeight = '1.5';
          element.style.marginBottom = '20px';
          element.style.width = '100%';
          element.style.wordWrap = 'break-word';
        });
      }
    }

    tempContainer.appendChild(clonedPreview);
    document.body.appendChild(tempContainer);

    // Capturer avec html2canvas
    const canvas = await html2canvas(tempContainer, {
      width: formatConfig.width,
      height: formatConfig.height,
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false
    });

    // Nettoyer
    document.body.removeChild(tempContainer);

    // Export direct
    const mimeType = exportSettings.fileType === 'jpeg' ? 'image/jpeg' : 'image/png';
    const quality = exportSettings.fileType === 'jpeg' ? 0.9 : undefined;
    
    const link = document.createElement('a');
    link.download = `prompt-${exportSettings.format}-${Date.now()}.${exportSettings.fileType}`;
    link.href = canvas.toDataURL(mimeType, quality);
    link.click();
  };

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Section de saisie */}
      <div className="w-full lg:w-1/2 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r flex flex-col min-h-[50vh] lg:min-h-screen">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-1 mb-4 flex-wrap">
            <Toggle
              pressed={false}
              onPressedChange={() => insertMarkdown('**')}
              aria-label="Bold"
              size="sm"
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={false}
              onPressedChange={() => insertMarkdown('*')}
              aria-label="Italic"
              size="sm"
            >
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={false}
              onPressedChange={() => insertMarkdown('_')}
              aria-label="Underline"
              size="sm"
            >
              <Underline className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={false}
              onPressedChange={() => insertList('• ')}
              aria-label="Liste à puces"
              size="sm"
            >
              <List className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={false}
              onPressedChange={() => insertOrderedList()}
              aria-label="Liste numérotée"
              size="sm"
            >
              <ListOrdered className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={false}
              onPressedChange={() => insertMarkdown('# ')}
              aria-label="Titre 1"
              size="sm"
            >
              <Heading1 className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={false}
              onPressedChange={() => insertMarkdown('## ')}
              aria-label="Titre 2"
              size="sm"
            >
              <Heading2 className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={false}
              onPressedChange={() => insertMarkdown('### ')}
              aria-label="Titre 3"
              size="sm"
            >
              <Heading3 className="h-4 w-4" />
            </Toggle>
          </div>

          <Textarea
            ref={textareaRef}
            placeholder="Écrivez votre prompt ici..."
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="flex-1 resize-none text-base min-h-[200px] lg:min-h-[400px]"
          />
        </div>
      </div>

      {/* Section de paramètres et prévisualisation */}
      <div className="w-full lg:w-1/2 p-4 lg:p-6 flex flex-col min-h-[50vh] lg:min-h-screen">
        {/* Paramètres */}
        <div className="space-y-4 mb-4">
          {/* Ligne 1 : Police, Arrière-plan, Style de carte */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
            <h3 className="text-sm font-medium">Police</h3>
            <Select value={styleSettings.font} onValueChange={(value) => setStyleSettings(prev => ({ ...prev, font: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_STYLES.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Arrière-plan</h3>
            <Select value={styleSettings.background} onValueChange={(value) => setStyleSettings(prev => ({ ...prev, background: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BACKGROUND_STYLES.map((bg) => (
                  <SelectItem key={bg.value} value={bg.value}>
                    {bg.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Style de carte</h3>
            <Select value={styleSettings.cardStyle} onValueChange={(value) => setStyleSettings(prev => ({ ...prev, cardStyle: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CARD_STYLES.map((card) => (
                  <SelectItem key={card.value} value={card.value}>
                    {card.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>
          </div>

          {/* Ligne 2 : Tailles de police et Export format/type */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Taille police 16:9</h3>
              <Select value={styleSettings.fontSize16_9} onValueChange={(value) => setStyleSettings(prev => ({ ...prev, fontSize16_9: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_SIZES_16_9.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Taille police 9:16</h3>
              <Select value={styleSettings.fontSize9_16} onValueChange={(value) => setStyleSettings(prev => ({ ...prev, fontSize9_16: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_SIZES_9_16.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Format & Type</h3>
              <div className="flex gap-2">
                <ToggleGroup
                  type="single"
                  value={exportSettings.format}
                  onValueChange={(value) => value && setExportSettings(prev => ({ ...prev, format: value }))}
                  className="flex-1"
                >
                  {EXPORT_FORMATS.map((format) => (
                    <ToggleGroupItem key={format.value} value={format.value} className="text-xs px-2 flex-1">
                      {format.value}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <ToggleGroup
                  type="single"
                  value={exportSettings.fileType}
                  onValueChange={(value) => value && setExportSettings(prev => ({ ...prev, fileType: value as 'png' | 'jpeg' }))}
                  className="flex-1"
                >
                  <ToggleGroupItem value="png" className="text-xs px-2 flex-1">
                    PNG
                  </ToggleGroupItem>
                  <ToggleGroupItem value="jpeg" className="text-xs px-2 flex-1">
                    JPEG
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <Button
          onClick={exportToImage}
          className="w-full"
          disabled={!promptText.trim()}
        >
          <Download className="h-4 w-4 mr-2" />
          Exporter en {exportSettings.fileType.toUpperCase()}
        </Button>

        {/* Prévisualisation */}
        <div className="flex-1 min-h-[300px] lg:min-h-[400px] mt-4">
          <div
            ref={previewRef}
            className={`${styleSettings.background} p-4 lg:p-8 flex items-center justify-center h-full rounded-lg`}
          >
            <Card className={`${styleSettings.cardStyle} mx-auto ${
              exportSettings.format === '9:16' 
                ? 'w-[85%]' // Format vertical mobile - 85% largeur
                : 'w-[75%]' // Format horizontal - 75% largeur
            }`}>
              <CardContent className={`${
                exportSettings.format === '9:16' 
                  ? 'p-8' // Plus de padding en 9:16
                  : 'p-6' // Padding normal en 16:9
              }`}>
                <div
                  className={`${styleSettings.font} ${
                    exportSettings.format === '9:16' 
                      ? styleSettings.fontSize9_16 + ' leading-relaxed' // Taille personnalisée pour 9:16
                      : styleSettings.fontSize16_9 + ' leading-relaxed' // Taille personnalisée pour 16:9
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(promptText || 'Votre prompt apparaîtra ici...')
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}