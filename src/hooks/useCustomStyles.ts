'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CustomGradient {
  id: string;
  label: string;
  fromColor: string;
  toColor: string;
  direction: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl';
}

export interface CustomCardStyle {
  id: string;
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
  shadow: string;
}

const GRADIENTS_STORAGE_KEY = 'prompt-styler-custom-gradients';
const CARDS_STORAGE_KEY = 'prompt-styler-custom-cards';

export function useCustomStyles() {
  const [customGradients, setCustomGradients] = useState<CustomGradient[]>([]);
  const [customCards, setCustomCards] = useState<CustomCardStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedGradients = localStorage.getItem(GRADIENTS_STORAGE_KEY);
      if (savedGradients) {
        setCustomGradients(JSON.parse(savedGradients));
      }

      const savedCards = localStorage.getItem(CARDS_STORAGE_KEY);
      if (savedCards) {
        setCustomCards(JSON.parse(savedCards));
      }
    } catch (error) {
      console.error('Error loading custom styles:', error);
      localStorage.removeItem(GRADIENTS_STORAGE_KEY);
      localStorage.removeItem(CARDS_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save gradients to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(GRADIENTS_STORAGE_KEY, JSON.stringify(customGradients));
    }
  }, [customGradients, isLoading]);

  // Save cards to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(customCards));
    }
  }, [customCards, isLoading]);

  // Add a new custom gradient
  const addGradient = useCallback((gradient: Omit<CustomGradient, 'id'>): string => {
    const id = `gradient-${Date.now()}`;
    const newGradient: CustomGradient = { ...gradient, id };
    setCustomGradients(prev => [...prev, newGradient]);
    return id;
  }, []);

  // Remove a custom gradient
  const removeGradient = useCallback((gradientId: string) => {
    setCustomGradients(prev => prev.filter(g => g.id !== gradientId));
  }, []);

  // Add a new custom card style
  const addCardStyle = useCallback((card: Omit<CustomCardStyle, 'id'>): string => {
    const id = `card-${Date.now()}`;
    const newCard: CustomCardStyle = { ...card, id };
    setCustomCards(prev => [...prev, newCard]);
    return id;
  }, []);

  // Remove a custom card style
  const removeCardStyle = useCallback((cardId: string) => {
    setCustomCards(prev => prev.filter(c => c.id !== cardId));
  }, []);

  // Convert gradient object to Tailwind class string
  const getGradientValue = (gradient: CustomGradient): string => {
    // Convert hex colors to Tailwind arbitrary values
    return `bg-gradient-${gradient.direction} from-[${gradient.fromColor}] to-[${gradient.toColor}]`;
  };

  // Convert card style object to Tailwind class string
  const getCardStyleValue = (card: CustomCardStyle): string => {
    const classes: string[] = [];

    // Background color
    if (card.bgColor.startsWith('#')) {
      classes.push(`bg-[${card.bgColor}]`);
    } else {
      classes.push(card.bgColor);
    }

    // Text color
    if (card.textColor.startsWith('#')) {
      classes.push(`text-[${card.textColor}]`);
    } else {
      classes.push(card.textColor);
    }

    // Border
    if (card.borderWidth !== '0' && card.borderColor) {
      classes.push(`border-${card.borderWidth}`);
      if (card.borderColor.startsWith('#')) {
        classes.push(`border-[${card.borderColor}]`);
      } else {
        classes.push(card.borderColor);
      }
    }

    // Border radius
    if (card.borderRadius) {
      classes.push(card.borderRadius);
    }

    // Shadow
    if (card.shadow) {
      classes.push(card.shadow);
    }

    return classes.join(' ');
  };

  // Validate contrast ratio (simplified check)
  const validateContrast = (bgColor: string, textColor: string): boolean => {
    // This is a simplified check - in production you'd use a proper contrast ratio calculation
    // For now, we just check if one is light and one is dark
    const isLightColor = (color: string): boolean => {
      if (!color.startsWith('#')) return false;
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5;
    };

    const bgLight = isLightColor(bgColor);
    const textLight = isLightColor(textColor);

    // Good contrast if one is light and one is dark
    return bgLight !== textLight;
  };

  return {
    customGradients,
    customCards,
    isLoading,
    addGradient,
    removeGradient,
    addCardStyle,
    removeCardStyle,
    getGradientValue,
    getCardStyleValue,
    validateContrast
  };
}
