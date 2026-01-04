'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Import dynamique de dom-to-image-more (client-side only)
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
  { value: 'text-[10px]', label: 'Minuscule (10px)' },
  { value: 'text-xs', label: 'Tres Petit (12px)' },
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
  { value: 'text-[10px]', label: 'Minuscule (10px)' },
  { value: 'text-xs', label: 'Tres Petit (12px)' },
  { value: 'text-sm', label: 'Petit (14px)' },
  { value: 'text-base', label: 'Normal (16px)' },
  { value: 'text-lg', label: 'Large (18px)' },
  { value: 'text-xl', label: 'Tres Large (20px)' },
  { value: 'text-2xl', label: 'XXL (24px)' },
  { value: 'text-3xl', label: 'XXXL (30px)' },
  { value: 'text-4xl', label: 'Enorme (36px)' },
  { value: 'text-5xl', label: 'Gigantesque (48px)' },
  { value: 'text-6xl', label: 'Titanesque (60px)' }
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

  // Gestion du comportement liste style Notion
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Ne pas interférer si du texte est sélectionné
    if (start !== end) return;

    // Trouver la ligne actuelle
    const textBefore = promptText.substring(0, start);
    const lastNewLine = textBefore.lastIndexOf('\n');
    const currentLine = textBefore.substring(lastNewLine + 1);

    // Vérifier si c'est une liste à puces
    const bulletMatch = currentLine.match(/^(• )(.*)$/);
    if (bulletMatch) {
      e.preventDefault();
      const content = bulletMatch[2];

      if (content.trim() === '') {
        // Liste vide → supprimer le préfixe et sortir de la liste
        const newText = promptText.substring(0, start - 2) + promptText.substring(start);
        setPromptText(newText);
        setTimeout(() => {
          textarea.setSelectionRange(start - 2, start - 2);
        }, 0);
      } else {
        // Contenu présent → créer nouvel item
        const newText = promptText.substring(0, start) + '\n• ' + promptText.substring(start);
        setPromptText(newText);
        setTimeout(() => {
          textarea.setSelectionRange(start + 3, start + 3);
        }, 0);
      }
      return;
    }

    // Vérifier si c'est une liste numérotée
    const numberedMatch = currentLine.match(/^(\d+)\. (.*)$/);
    if (numberedMatch) {
      e.preventDefault();
      const num = parseInt(numberedMatch[1]);
      const content = numberedMatch[2];

      if (content.trim() === '') {
        // Liste vide → supprimer le préfixe et sortir de la liste
        const prefixLength = `${num}. `.length;
        const newText = promptText.substring(0, start - prefixLength) + promptText.substring(start);
        setPromptText(newText);
        setTimeout(() => {
          textarea.setSelectionRange(start - prefixLength, start - prefixLength);
        }, 0);
      } else {
        // Contenu présent → créer nouvel item avec numéro suivant
        const nextNum = num + 1;
        const newText = promptText.substring(0, start) + `\n${nextNum}. ` + promptText.substring(start);
        const newPos = start + `\n${nextNum}. `.length;
        setPromptText(newText);
        setTimeout(() => {
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
      }
      return;
    }
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
      .replace(/^### (.+)$/gm, '<h3 style="font-size: 1.1em; font-weight: 600; margin-top: 0.15em; margin-bottom: 0.1em;">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 style="font-size: 1.25em; font-weight: 700; margin-top: 0.2em; margin-bottom: 0.125em;">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 style="font-size: 1.5em; font-weight: 800; margin-top: 0.25em; margin-bottom: 0.15em;">$1</h1>')
      .replace(/^(\d+\. .+)$/gm, '<div style="margin-left: 16px; margin-top: 0.05em; margin-bottom: 0.05em;">$1</div>')
      .replace(/^(• .+)$/gm, '<div style="margin-left: 16px; margin-top: 0.05em; margin-bottom: 0.05em;">$1</div>')
      .replace(/\n/g, '<br>')
      // Supprimer les <br> après les éléments block pour éviter double espacement
      .replace(/<\/(h1|h2|h3|div)><br>/g, '</$1>')
      // Supprimer les <br> avant les éléments block
      .replace(/<br><(h1|h2|h3|div)/g, '<$1');

    // Sanitize with DOMPurify as additional security layer
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['strong', 'em', 'u', 'del', 'code', 'h1', 'h2', 'h3', 'div', 'br'],
      ALLOWED_ATTR: ['style']
    });
  };

  const exportToImage = async (quality: '1x' | '2x' = '1x') => {
    if (!previewRef.current) return;

    const formatConfig = EXPORT_FORMATS.find(f => f.value === exportSettings.format);
    if (!formatConfig) return;

    try {
      // Import dynamique (client-side only)
      const domtoimage = (await import('dom-to-image-more')).default;

      const scale = quality === '2x' ? 2 : 1;
      const { width, height } = formatConfig;

      // Creer un conteneur temporaire avec les dimensions exactes d'export
      const tempContainer = document.createElement('div');
      tempContainer.style.cssText = `
        position: fixed;
        top: -9999px;
        left: 0;
        width: ${width}px;
        height: ${height}px;
        overflow: hidden;
        pointer-events: none;
      `;

      // Cloner le preview (BG gradient + card)
      const clonedPreview = previewRef.current.cloneNode(true) as HTMLElement;

      // Adapter le clone aux dimensions d'export
      // Padding different selon le format: 9:16 = 5% vertical, 5% horizontal, 16:9 = 5% partout
      const paddingStyle = exportSettings.format === '9:16'
        ? 'padding: 5% 5%;'  // 5% partout pour 9:16
        : 'padding: 5%;';   // 5% partout pour 16:9
      clonedPreview.style.cssText = `
        width: ${width}px;
        height: ${height}px;
        display: flex;
        align-items: center;
        justify-content: center;
        ${paddingStyle}
        box-sizing: border-box;
      `;
      // Conserver le background gradient
      clonedPreview.className = previewRef.current.className;

      // Supprimer tous les scrollbars, focus, outlines et bordures sur tous les elements
      const allElements = clonedPreview.querySelectorAll('*');
      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.outline = 'none';
        htmlEl.style.border = 'none';
        htmlEl.style.borderLeft = 'none';
        htmlEl.style.borderRight = 'none';
        htmlEl.style.borderTop = 'none';
        htmlEl.style.borderBottom = 'none';
        htmlEl.style.boxShadow = htmlEl.style.boxShadow?.includes('shadow') ? htmlEl.style.boxShadow : 'none';
        // Supprimer les scrollbars
        if (htmlEl.scrollHeight > htmlEl.clientHeight || htmlEl.scrollWidth > htmlEl.clientWidth) {
          htmlEl.style.overflow = 'hidden';
        }
        // Enlever focus rings
        htmlEl.blur?.();
      });

      // Trouver et ajuster la card
      const card = clonedPreview.querySelector('[data-slot="card"], .rounded-2xl, .rounded-xl, .rounded-lg, .rounded-3xl') as HTMLElement;
      if (card) {
        // Garder les styles de card mais supprimer overflow et bordures
        // IMPORTANT: forcer width (pas juste maxWidth) car la classe Tailwind w-[56.25%] est clonée
        card.style.overflow = 'hidden';
        card.style.maxHeight = '90%';
        card.style.width = exportSettings.format === '9:16' ? '80%' : '85%';
        card.style.maxWidth = 'none';
        card.style.outline = 'none';
        card.style.border = 'none';
      }

      // Trouver le CardContent et ajuster
      const cardContent = clonedPreview.querySelector('[data-slot="card-content"], .p-6') as HTMLElement;
      if (cardContent) {
        cardContent.style.overflow = 'hidden';
        cardContent.style.scrollbarWidth = 'none';
      }

      // Ajuster la taille du texte pour l'export
      const textContainer = clonedPreview.querySelector('[class*="font-"]') as HTMLElement;
      if (textContainer) {
        // Taille de base selon le format
        const baseFontSize = exportSettings.format === '9:16' ? 28 : 22;
        textContainer.style.fontSize = `${baseFontSize}px`;
        textContainer.style.lineHeight = '1.5';

        // Ajuster les headings
        const headings = textContainer.querySelectorAll('h1, h2, h3');
        headings.forEach((heading) => {
          const el = heading as HTMLElement;
          if (el.tagName === 'H1') {
            el.style.fontSize = `${baseFontSize * 1.6}px`;
          } else if (el.tagName === 'H2') {
            el.style.fontSize = `${baseFontSize * 1.4}px`;
          } else if (el.tagName === 'H3') {
            el.style.fontSize = `${baseFontSize * 1.2}px`;
          }
        });
      }

      tempContainer.appendChild(clonedPreview);
      document.body.appendChild(tempContainer);

      // Attendre pour le rendu complet
      await new Promise(resolve => setTimeout(resolve, 150));

      // Capturer avec dom-to-image-more
      let dataUrl: string;

      if (exportSettings.fileType === 'jpeg') {
        dataUrl = await domtoimage.toJpeg(tempContainer, {
          width: width,
          height: height,
          scale: scale,
          quality: 0.95,
          bgcolor: '#ffffff'
        });
      } else {
        dataUrl = await domtoimage.toPng(tempContainer, {
          width: width,
          height: height,
          scale: scale
        });
      }

      // Nettoyer
      document.body.removeChild(tempContainer);

      // Telecharger l'image
      const link = document.createElement('a');
      const qualitySuffix = quality === '2x' ? '@2x' : '';
      link.download = `prompt-${exportSettings.format}${qualitySuffix}-${Date.now()}.${exportSettings.fileType}`;
      link.href = dataUrl;
      link.click();

    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Une erreur est survenue lors de l\'export. Veuillez reessayer.');
    }
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
              onKeyDown={handleTextareaKeyDown}
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
