'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CustomFont {
  id: string;
  name: string;
  url: string;
  family: string;
}

const STORAGE_KEY = 'prompt-styler-custom-fonts';

export function useCustomFonts() {
  const [customFonts, setCustomFonts] = useState<CustomFont[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load fonts from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CustomFont[];
        setCustomFonts(parsed);
        // Inject existing fonts into document
        parsed.forEach(font => injectFontLink(font.url));
      }
    } catch (error) {
      console.error('Error loading custom fonts:', error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage when fonts change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customFonts));
    }
  }, [customFonts, isLoading]);

  // Inject a Google Font link into the document head
  const injectFontLink = (url: string) => {
    // Check if already exists
    const existingLink = document.querySelector(`link[href="${url}"]`);
    if (existingLink) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  };

  // Parse Google Fonts URL to extract font family name
  const parseFontUrl = (url: string): { name: string; family: string } | null => {
    try {
      // Handle different Google Fonts URL formats
      // Format 1: https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap
      // Format 2: https://fonts.googleapis.com/css?family=Open+Sans

      const urlObj = new URL(url);
      const familyParam = urlObj.searchParams.get('family');

      if (!familyParam) return null;

      // Extract font name (first part before : or +)
      const fontName = familyParam.split(':')[0].replace(/\+/g, ' ');
      const fontFamily = `'${fontName}', sans-serif`;

      return { name: fontName, family: fontFamily };
    } catch {
      return null;
    }
  };

  // Add a new custom font
  const addFont = useCallback((googleFontUrl: string): boolean => {
    // Validate URL
    if (!googleFontUrl.includes('fonts.googleapis.com')) {
      console.error('Invalid Google Fonts URL');
      return false;
    }

    const parsed = parseFontUrl(googleFontUrl);
    if (!parsed) {
      console.error('Could not parse font URL');
      return false;
    }

    // Check if already exists
    if (customFonts.some(f => f.name === parsed.name)) {
      console.warn('Font already exists');
      return false;
    }

    // Inject the font
    injectFontLink(googleFontUrl);

    // Add to state
    const newFont: CustomFont = {
      id: `custom-${Date.now()}`,
      name: parsed.name,
      url: googleFontUrl,
      family: parsed.family
    };

    setCustomFonts(prev => [...prev, newFont]);
    return true;
  }, [customFonts]);

  // Remove a custom font
  const removeFont = useCallback((fontId: string) => {
    setCustomFonts(prev => {
      const font = prev.find(f => f.id === fontId);
      if (font) {
        // Remove the link tag
        const link = document.querySelector(`link[href="${font.url}"]`);
        if (link) link.remove();
      }
      return prev.filter(f => f.id !== fontId);
    });
  }, []);

  // Get font style value for use in className
  const getFontStyleValue = (font: CustomFont): string => {
    return `font-['${font.name.replace(/ /g, '_')}']`;
  };

  return {
    customFonts,
    isLoading,
    addFont,
    removeFont,
    getFontStyleValue
  };
}
