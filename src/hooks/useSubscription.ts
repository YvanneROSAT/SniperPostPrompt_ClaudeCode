'use client';

import { useState, useEffect } from 'react';

interface SubscriptionStatus {
  isPremium: boolean;
  isLoading: boolean;
  subscriptionId: string | null;
  expiresAt: number | null;
}

const STORAGE_KEY = 'prompt-styler-subscription';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function useSubscription(): SubscriptionStatus {
  const [status, setStatus] = useState<SubscriptionStatus>({
    isPremium: false,
    isLoading: true,
    subscriptionId: null,
    expiresAt: null,
  });

  useEffect(() => {
    // Check URL params for successful checkout
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');

    if (success === 'true' && sessionId) {
      // User just completed checkout - activate premium
      const premiumData = {
        isPremium: true,
        subscriptionId: sessionId,
        expiresAt: Date.now() + CACHE_DURATION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(premiumData));
      setStatus({
        ...premiumData,
        isLoading: false,
      });

      // Clean URL params
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    // Check localStorage for cached status
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);

        // Check if cache is still valid
        if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
          setStatus({
            isPremium: parsed.isPremium || false,
            isLoading: false,
            subscriptionId: parsed.subscriptionId || null,
            expiresAt: parsed.expiresAt,
          });
          return;
        } else {
          // Cache expired, clear it
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      console.warn('Error reading subscription cache');
      localStorage.removeItem(STORAGE_KEY);
    }

    // Default: not premium
    setStatus({
      isPremium: false,
      isLoading: false,
      subscriptionId: null,
      expiresAt: null,
    });
  }, []);

  return status;
}

// Helper to manually set premium status (for testing or admin)
export function setPremiumStatus(isPremium: boolean, subscriptionId?: string) {
  if (isPremium) {
    const premiumData = {
      isPremium: true,
      subscriptionId: subscriptionId || 'manual',
      expiresAt: Date.now() + CACHE_DURATION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(premiumData));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Helper to clear subscription (logout/cancel)
export function clearSubscription() {
  localStorage.removeItem(STORAGE_KEY);
}
