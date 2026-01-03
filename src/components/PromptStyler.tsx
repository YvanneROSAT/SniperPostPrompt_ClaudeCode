'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import html2canvas from 'html2canvas-pro';
import DOMPurify from 'dompurify';
import { Toolbar } from '@/components/editor/Toolbar';
import { AdBanner } from '@/components/ads/AdBanner';
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3, AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

// 15 polices Google Fonts + polices systeme
const FONT_STYLES = [
  // Polices Google Fonts
  { value: 'font-[var(--font-inter)]', label: 'Inter' },
  { value: 'font-[var(--font-roboto)]', label: 'Roboto' },
  { value: 'font-[var(--font-open-sans)]', label: 'Open Sans' },
  { value: 'font-[var(--font-montserrat)]', label: 'Montserrat' },
  { value: 'font-[var(--font-poppins)]', label: 'Poppins' },
  { value: 'font-[var(--font-lato)]', label: 'Lato' },
  { value: 'font-[var(--font-playfair)]', label: 'Playfair Display' },
  { value: 'font-[var(--font-merriweather)]', label: 'Merriweather' },
  { value: 'font-[var(--font-raleway)]', label: 'Raleway' },
  { value: 'font-[var(--font-nunito)]', label: 'Nunito' },
  { value: 'font-[var(--font-source-sans)]', label: 'Source Sans' },
  { value: 'font-[var(--font-ubuntu)]', label: 'Ubuntu' },
  { value: 'font-[var(--font-oswald)]', label: 'Oswald' },
  { value: 'font-[var(--font-quicksand)]', label: 'Quicksand' },
  { value: 'font-[var(--font-fira-code)]', label: 'Fira Code' },
  // Polices systeme
  { value: 'font-sans', label: 'System Sans' },
  { value: 'font-serif', label: 'System Serif' },
  { value: 'font-mono', label: 'System Mono' }
];

const FONT_SIZES_16_9 = [
  { value: 'text-sm', label: 'Petit (14px)' },
  { value: 'text-base', label: 'Normal (16px)' },
  { value: 'text-lg', label: 'Large (18px)' },
  { value: 'text-xl', label: 'Tres Large (20px)' },
  { value: 'text-2xl', label: 'XXL (24px)' },
  { value: 'text-3xl', label: 'XXXL (30px)' },
  { value: 'text-4xl', label: 'Enorme (36px)' },
  { value: 'text-5xl', label: 'Gigantesque (48px)' }
];

const FONT_SIZES_9_16 = [
  { value: 'text-base', label: 'Petit (16px)' },
  { value: 'text-lg', label: 'Normal (18px)' },
  { value: 'text-xl', label: 'Large (20px)' },
  { value: 'text-2xl', label: 'Tres Large (24px)' },
  { value: 'text-3xl', label: 'XXL (30px)' },
  { value: 'text-4xl', label: 'XXXL (36px)' },
  { value: 'text-5xl', label: 'Enorme (48px)' },
  { value: 'text-6xl', label: 'Gigantesque (60px)' }
];

const BACKGROUND_STYLES = [
  { value: 'bg-gradient-to-br from-blue-400 to-purple-600', label: 'Ocean Sunset' },
  { value: 'bg-gradient-to-br from-green-400 to-blue-500', label: 'Aurora' },
  { value: 'bg-gradient-to-br from-pink-400 to-orange-500', label: 'Peach' },
  { value: 'bg-gradient-to-br from-indigo-500 to-purple-700', label: 'Cosmic' },
  { value: 'bg-gradient-to-br from-yellow-400 to-red-500', label: 'Fire' },
  { value: 'bg-gradient-to-br from-teal-400 to-cyan-500', label: 'Aqua' },
  { value: 'bg-gradient-to-br from-gray-700 to-gray-900', label: 'Midnight' },
  { value: 'bg-gradient-to-br from-rose-400 to-pink-600', label: 'Rose' },
  { value: 'bg-gradient-to-br from-emerald-400 to-teal-600', label: 'Forest' },
  { value: 'bg-gradient-to-br from-amber-300 to-orange-500', label: 'Honey' }
];

// W3C WCAG 2.1 AA Compliant - Ratio contraste >= 4.5:1
const CARD_STYLES = [
  // Fonds clairs → text-gray-900 (ratio ~15:1 sur blanc)
  { value: 'bg-white text-gray-900 shadow-xl border-0 rounded-2xl', label: 'Modern White' },
  { value: 'bg-gradient-to-br from-white to-gray-100 text-gray-900 shadow-lg border-gray-200 rounded-xl', label: 'Subtle' },
  { value: 'bg-white/80 backdrop-blur-lg text-gray-900 shadow-lg rounded-2xl', label: 'Glass' },
  { value: 'bg-white text-gray-900 border-2 border-gray-200 rounded-none', label: 'Sharp' },
  { value: 'bg-yellow-50 text-yellow-900 border border-yellow-200 rounded-xl', label: 'Paper' },
  { value: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 rounded-3xl', label: 'Pastel' },
  { value: 'bg-white text-gray-900 shadow-[0_0_30px_rgba(0,0,0,0.1)] rounded-2xl', label: 'Floating' },
  // Fonds sombres → text-white ou text-[color]-100 (ratio >= 7:1)
  { value: 'bg-gray-900 text-white shadow-2xl border-gray-700 rounded-lg', label: 'Dark Theme' },
  { value: 'bg-black text-green-400 font-mono rounded-lg', label: 'Terminal' },
  { value: 'bg-slate-800 text-slate-100 border border-slate-700 rounded-xl', label: 'Slate' }
];

const EXPORT_FORMATS = [
  { value: '16:9', label: '16:9 (1920x1080)', width: 1920, height: 1080 },
  { value: '9:16', label: '9:16 (1080x1920)', width: 1080, height: 1920 }
];

export default function PromptStyler() {
  const [promptText, setPromptText] = useState('');
  const [styleSettings, setStyleSettings] = useState<StyleSettings>({
    font: 'font-[var(--font-inter)]',
    background: 'bg-gradient-to-br from-blue-400 to-purple-600',
    cardStyle: 'bg-white text-gray-900 shadow-xl border-0 rounded-2xl',
    title: '',
    fontSize16_9: 'text-xl',
    fontSize9_16: 'text-3xl'
  });
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: '16:9',
    fileType: 'png'
  });
  const [mounted, setMounted] = useState(false);
  const [showOverflowWarning, setShowOverflowWarning] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const savedData = localStorage.getItem('prompt-styler-data');
      if (savedData) {
        const parsed = JSON.parse(savedData);

        // Validate parsed data structure
        if (typeof parsed === 'object' && parsed !== null) {
          const { promptText: savedText, styleSettings: savedSettings } = parsed;

          // Validate promptText is a string
          if (typeof savedText === 'string') {
            setPromptText(savedText);
          }

          // Validate styleSettings structure
          if (savedSettings && typeof savedSettings === 'object') {
            const validFonts = FONT_STYLES.map(f => f.value);
            const validBackgrounds = BACKGROUND_STYLES.map(b => b.value);
            const validCardStyles = CARD_STYLES.map(c => c.value);
            const validFontSizes16_9 = FONT_SIZES_16_9.map(s => s.value);
            const validFontSizes9_16 = FONT_SIZES_9_16.map(s => s.value);

            setStyleSettings({
              font: validFonts.includes(savedSettings.font) ? savedSettings.font : 'font-[var(--font-inter)]',
              background: validBackgrounds.includes(savedSettings.background) ? savedSettings.background : 'bg-gradient-to-br from-blue-400 to-purple-600',
              cardStyle: validCardStyles.includes(savedSettings.cardStyle) ? savedSettings.cardStyle : 'bg-white text-gray-900 shadow-xl border-0 rounded-2xl',
              title: typeof savedSettings.title === 'string' ? savedSettings.title : '',
              fontSize16_9: validFontSizes16_9.includes(savedSettings.fontSize16_9) ? savedSettings.fontSize16_9 : 'text-xl',
              fontSize9_16: validFontSizes9_16.includes(savedSettings.fontSize9_16) ? savedSettings.fontSize9_16 : 'text-3xl'
            });
          }
        }
      }
    } catch {
      // If localStorage data is corrupted, clear it and use defaults
      localStorage.removeItem('prompt-styler-data');
      console.warn('Corrupted localStorage data cleared');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      const dataToSave = { promptText, styleSettings };
      localStorage.setItem('prompt-styler-data', JSON.stringify(dataToSave));
    }
  }, [promptText, styleSettings, mounted]);

  // Contrer l'injection AdSense qui met "height: auto !important"
  useEffect(() => {
    if (!containerRef.current) return;

    let isEnforcing = false; // Flag pour éviter la boucle infinie

    const enforceHeight = () => {
      if (isEnforcing || !containerRef.current) return;

      // Vérifier si la hauteur est déjà correcte
      const currentHeight = containerRef.current.style.getPropertyValue('height');
      if (currentHeight === '100dvh') return;

      isEnforcing = true;
      containerRef.current.style.setProperty('height', '100dvh', 'important');
      // Réactiver après un tick pour éviter la boucle
      requestAnimationFrame(() => {
        isEnforcing = false;
      });
    };

    // Appliquer immédiatement
    enforceHeight();

    // Observer les mutations de style pour contrer AdSense
    const observer = new MutationObserver(() => {
      enforceHeight();
    });

    observer.observe(containerRef.current, {
      attributes: true,
      attributeFilter: ['style']
    });

    // Aussi appliquer après un délai pour AdSense qui charge après
    const timeouts = [100, 500, 1000, 2000].map(delay =>
      setTimeout(enforceHeight, delay)
    );

    return () => {
      observer.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, [mounted]);

  // Détecter l'overflow du contenu de la card
  useEffect(() => {
    if (!cardContentRef.current) return;

    const checkOverflow = () => {
      const el = cardContentRef.current;
      if (el && el.scrollHeight > el.clientHeight) {
        setShowOverflowWarning(true);
      }
    };

    // Vérifier après un court délai pour laisser le rendu se faire
    const timeout = setTimeout(checkOverflow, 100);
    return () => clearTimeout(timeout);
  }, [promptText, styleSettings.fontSize16_9, styleSettings.fontSize9_16, exportSettings.format]);


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

    // Compter uniquement les listes numerotees existantes
    const numberedItems = lines.filter(line => /^\d+\. /.test(line.trim())).length;
    const nextNumber = numberedItems + 1;

    insertList(`${nextNumber}. `);
  };

  const renderMarkdown = (text: string) => {
    // Escape HTML first to prevent XSS attacks
    const escapeHtml = (str: string) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    // Escape the input first
    const escapedText = escapeHtml(text);

    // Apply markdown transformations on escaped text
    const html = escapedText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<u>$1</u>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      .replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.1); padding: 0.1em 0.3em; border-radius: 3px; font-family: monospace;">$1</code>')
      .replace(/^### (.+)$/gm, '<h3 style="font-size: 1.1em; font-weight: 600; margin: 0.15em 0;">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 style="font-size: 1.25em; font-weight: 700; margin: 0.2em 0;">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 style="font-size: 1.5em; font-weight: 800; margin: 0.25em 0;">$1</h1>')
      .replace(/^(\d+\. .+)$/gm, '<div style="margin-left: 16px;">$1</div>')
      .replace(/^(• .+)$/gm, '<div style="margin-left: 16px;">$1</div>')
      .replace(/\n/g, '<br>');

    // Sanitize with DOMPurify as additional security layer
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['strong', 'em', 'u', 'del', 'code', 'h1', 'h2', 'h3', 'div', 'br'],
      ALLOWED_ATTR: ['style']
    });
  };

  const exportToImage = async () => {
    if (!previewRef.current) return;

    const formatConfig = EXPORT_FORMATS.find(f => f.value === exportSettings.format);
    if (!formatConfig) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      if (exportSettings.format === '9:16') {
        // LOGIQUE SPECIFIQUE 9:16 - Export natif sans deformation
        await exportToImage9_16(formatConfig);
      } else {
        // LOGIQUE 16:9 - Logique existante maintenue
        await exportToImage16_9(formatConfig);
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Une erreur est survenue lors de l\'export. Veuillez reessayer.');
    }
  };

  const exportToImage9_16 = async (formatConfig: { value: string; label: string; width: number; height: number }) => {
    // Creer un element temporaire optimise pour 9:16
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.top = '-9999px';
    tempContainer.style.left = '0';
    tempContainer.style.width = `${formatConfig.width}px`;
    tempContainer.style.height = `${formatConfig.height}px`;
    tempContainer.style.backgroundColor = 'transparent';

    // Cloner et optimiser le contenu pour 9:16
    const clonedPreview = previewRef.current!.cloneNode(true) as HTMLElement;

    // Card = 100% sans padding (pas de bord BG visible)
    clonedPreview.style.width = `${formatConfig.width}px`;
    clonedPreview.style.height = `${formatConfig.height}px`;
    clonedPreview.style.padding = '0';
    clonedPreview.style.display = 'flex';
    clonedPreview.style.alignItems = 'stretch';
    clonedPreview.style.justifyContent = 'stretch';

    // Trouver et optimiser la card (100% de l'espace)
    const card = clonedPreview.querySelector('[class*="rounded"]') as HTMLElement;
    if (card) {
      card.style.width = '100%';
      card.style.height = '100%';
      card.style.maxHeight = 'none';
      card.style.borderRadius = '0'; // Pas de coins arrondis a l'export

      // Optimiser le contenu de la card
      const cardContent = card.querySelector('[class*="p-"]') as HTMLElement;
      if (cardContent) {
        cardContent.style.padding = '80px 60px';
        cardContent.style.height = '100%';
        cardContent.style.display = 'flex';
        cardContent.style.alignItems = 'center';
        cardContent.style.justifyContent = 'center';
      }

      // Optimiser le texte
      const textContainer = card.querySelector('div[class*="font-"]') as HTMLElement;
      if (textContainer) {
        textContainer.style.fontSize = '44px';
        textContainer.style.lineHeight = '1.5';
        textContainer.style.width = '100%';

        // Optimiser les elements specifiques
        const elements = textContainer.querySelectorAll('*');
        elements.forEach(el => {
          const element = el as HTMLElement;
          if (element.tagName === 'H1') {
            element.style.fontSize = '66px';
            element.style.marginBottom = '20px';
          } else if (element.tagName === 'H2') {
            element.style.fontSize = '55px';
            element.style.marginBottom = '16px';
          } else if (element.tagName === 'H3') {
            element.style.fontSize = '48px';
            element.style.marginBottom = '12px';
          } else {
            element.style.fontSize = '44px';
          }
          element.style.lineHeight = '1.5';
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
    // LOGIQUE SPECIFIQUE 16:9 - Export natif optimise
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.top = '-9999px';
    tempContainer.style.left = '0';
    tempContainer.style.width = `${formatConfig.width}px`;
    tempContainer.style.height = `${formatConfig.height}px`;
    tempContainer.style.backgroundColor = 'transparent';

    // Cloner et optimiser le contenu pour 16:9
    const clonedPreview = previewRef.current!.cloneNode(true) as HTMLElement;

    // Card = 100% sans padding (pas de bord BG visible)
    clonedPreview.style.width = `${formatConfig.width}px`;
    clonedPreview.style.height = `${formatConfig.height}px`;
    clonedPreview.style.padding = '0';
    clonedPreview.style.display = 'flex';
    clonedPreview.style.alignItems = 'stretch';
    clonedPreview.style.justifyContent = 'stretch';

    // Trouver et optimiser la card (100% de l'espace)
    const card = clonedPreview.querySelector('[class*="rounded"]') as HTMLElement;
    if (card) {
      card.style.width = '100%';
      card.style.height = '100%';
      card.style.maxHeight = 'none';
      card.style.borderRadius = '0'; // Pas de coins arrondis a l'export

      // Optimiser le contenu de la card
      const cardContent = card.querySelector('[class*="p-"]') as HTMLElement;
      if (cardContent) {
        cardContent.style.padding = '60px 100px';
        cardContent.style.height = '100%';
        cardContent.style.display = 'flex';
        cardContent.style.alignItems = 'center';
        cardContent.style.justifyContent = 'center';
      }

      // Optimiser le texte pour 16:9
      const textContainer = card.querySelector('div[class*="font-"]') as HTMLElement;
      if (textContainer) {
        textContainer.style.fontSize = '36px';
        textContainer.style.lineHeight = '1.5';
        textContainer.style.width = '100%';

        // Optimiser les elements specifiques
        const elements = textContainer.querySelectorAll('*');
        elements.forEach(el => {
          const element = el as HTMLElement;
          if (element.tagName === 'H1') {
            element.style.fontSize = '54px';
            element.style.marginBottom = '16px';
          } else if (element.tagName === 'H2') {
            element.style.fontSize = '45px';
            element.style.marginBottom = '12px';
          } else if (element.tagName === 'H3') {
            element.style.fontSize = '40px';
            element.style.marginBottom = '10px';
          } else {
            element.style.fontSize = '36px';
          }
          element.style.lineHeight = '1.5';
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
    <div
      ref={containerRef}
      className="grid grid-rows-[auto_auto_1fr_auto] h-screen bg-background overflow-hidden"
    >
      {/* Toolbar - Header fixe */}
      <Toolbar
        onExport={exportToImage}
        canExport={!!promptText.trim()}
        exportFormat={exportSettings.format}
      />

      {/* Barre de parametres horizontale - centree */}
      <div className="border-b border-border bg-card/50 p-2">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Police */}
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Police</Label>
            <Select value={styleSettings.font} onValueChange={(font) => setStyleSettings(prev => ({ ...prev, font }))}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Police" />
              </SelectTrigger>
              <SelectContent>
                {FONT_STYLES.map((font) => (
                  <SelectItem key={font.value} value={font.value} className="text-xs">
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Arriere-plan */}
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Arriere-plan</Label>
            <Select value={styleSettings.background} onValueChange={(bg) => setStyleSettings(prev => ({ ...prev, background: bg }))}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue placeholder="Arriere-plan" />
              </SelectTrigger>
              <SelectContent>
                {BACKGROUND_STYLES.map((bg) => (
                  <SelectItem key={bg.value} value={bg.value} className="text-xs">
                    {bg.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Style de carte */}
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Style carte</Label>
            <Select value={styleSettings.cardStyle} onValueChange={(style) => setStyleSettings(prev => ({ ...prev, cardStyle: style }))}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                {CARD_STYLES.map((card) => (
                  <SelectItem key={card.value} value={card.value} className="text-xs">
                    {card.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Taille police */}
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Taille texte</Label>
            <Select
              value={exportSettings.format === '9:16' ? styleSettings.fontSize9_16 : styleSettings.fontSize16_9}
              onValueChange={(size) => {
                if (exportSettings.format === '9:16') {
                  setStyleSettings(prev => ({ ...prev, fontSize9_16: size }));
                } else {
                  setStyleSettings(prev => ({ ...prev, fontSize16_9: size }));
                }
              }}
            >
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue placeholder="Taille" />
              </SelectTrigger>
              <SelectContent>
                {(exportSettings.format === '9:16' ? FONT_SIZES_9_16 : FONT_SIZES_16_9).map((size) => (
                  <SelectItem key={size.value} value={size.value} className="text-xs">
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Format export */}
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Format</Label>
            <div className="flex items-center gap-1 border rounded-md p-1 bg-background">
              {EXPORT_FORMATS.map((format) => (
                <Button
                  key={format.value}
                  variant={exportSettings.format === format.value ? "default" : "ghost"}
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setExportSettings(prev => ({ ...prev, format: format.value }))}
                >
                  {format.value}
                </Button>
              ))}
            </div>
          </div>

          {/* Type fichier */}
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Type fichier</Label>
            <div className="flex items-center gap-1 border rounded-md p-1 bg-background">
              <Button
                variant={exportSettings.fileType === 'png' ? "default" : "ghost"}
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setExportSettings(prev => ({ ...prev, fileType: 'png' }))}
              >
                PNG
              </Button>
              <Button
                variant={exportSettings.fileType === 'jpeg' ? "default" : "ghost"}
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setExportSettings(prev => ({ ...prev, fileType: 'jpeg' }))}
              >
                JPEG
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Zone principale : 40% Textarea | 60% Preview - remplit jusqu'au footer */}
      <div className="flex min-h-0 overflow-hidden">
        {/* Textarea - 40% */}
        <div className="w-[40%] border-r border-border bg-card/30 flex flex-col overflow-hidden">
          {/* Boutons de formatage */}
          <div className="flex items-center gap-1 p-2 border-b border-border bg-card/50">
            <Toggle
              pressed={false}
              onPressedChange={() => insertMarkdown('**')}
              aria-label="Bold"
              size="sm"
              className="h-8 w-8"
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={false}
              onPressedChange={() => insertMarkdown('*')}
              aria-label="Italic"
              size="sm"
              className="h-8 w-8"
            >
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={false}
              onPressedChange={() => insertMarkdown('_')}
              aria-label="Underline"
              size="sm"
              className="h-8 w-8"
            >
              <Underline className="h-4 w-4" />
            </Toggle>
            <div className="w-px h-6 bg-border mx-1" />
            <Toggle
              pressed={false}
              onPressedChange={() => insertList('• ')}
              aria-label="Liste a puces"
              size="sm"
              className="h-8 w-8"
            >
              <List className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={false}
              onPressedChange={() => insertOrderedList()}
              aria-label="Liste numerotee"
              size="sm"
              className="h-8 w-8"
            >
              <ListOrdered className="h-4 w-4" />
            </Toggle>
            <div className="w-px h-6 bg-border mx-1" />
            <Toggle
              pressed={false}
              onPressedChange={() => insertMarkdown('# ')}
              aria-label="Titre 1"
              size="sm"
              className="h-8 w-8"
            >
              <Heading1 className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={false}
              onPressedChange={() => insertMarkdown('## ')}
              aria-label="Titre 2"
              size="sm"
              className="h-8 w-8"
            >
              <Heading2 className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={false}
              onPressedChange={() => insertMarkdown('### ')}
              aria-label="Titre 3"
              size="sm"
              className="h-8 w-8"
            >
              <Heading3 className="h-4 w-4" />
            </Toggle>
          </div>
          {/* Textarea */}
          <div className="flex-1 p-2 overflow-hidden min-h-0">
            <Textarea
              ref={textareaRef}
              placeholder="Ecrivez votre prompt ici..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="resize-none text-base h-full"
            />
          </div>
        </div>

        {/* Preview - 60% - BG gradient visible, card hauteur dynamique (max 90%, marge 10% BG) */}
        <div
          ref={previewRef}
          className={`w-[60%] h-full flex items-center justify-center p-[5%] ${styleSettings.background}`}
        >
          <Card className={`${styleSettings.cardStyle} transition-all duration-300 max-h-full overflow-hidden ${
            exportSettings.format === '9:16'
              ? 'w-[56.25%]'  /* Largeur 9:16 = 56.25% pour garder les proportions visuelles */
              : 'w-full max-w-2xl'  /* Largeur 16:9 inchangée */
          }`}>
            <CardContent
              ref={cardContentRef}
              className="p-6 overflow-auto"
            >
              <div
                className={`${styleSettings.font} ${
                  exportSettings.format === '9:16'
                    ? styleSettings.fontSize9_16 + ' leading-tight'
                    : styleSettings.fontSize16_9 + ' leading-tight'
                }`}
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(promptText || 'Votre prompt apparaitra ici...')
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AdSense Banner - Footer fixe en bas avec hauteur fixe pour éviter AdSense override */}
      <footer className="h-[100px] shrink-0 border-t border-border bg-card/50 p-2 overflow-hidden">
        <AdBanner
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER}
          format="horizontal"
          className="max-w-4xl mx-auto"
        />
      </footer>

      {/* Modal d'avertissement overflow */}
      <Dialog open={showOverflowWarning} onOpenChange={setShowOverflowWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Contenu trop long
            </DialogTitle>
            <DialogDescription className="text-left space-y-2">
              <p>Votre prompt depasse la zone visible de la card.</p>
              <p className="font-medium">Pour un meilleur rendu a l&apos;export, vous pouvez:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Reduire la taille de police</li>
                <li>Raccourcir votre prompt</li>
                <li>Utiliser le format 9:16 (plus de hauteur)</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowOverflowWarning(false)}>
              Compris
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
