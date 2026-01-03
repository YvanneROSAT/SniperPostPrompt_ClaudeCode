'use client';

import { useEffect, useRef } from 'react';
import { useSubscription } from '@/hooks/useSubscription';

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
}

export function AdBanner({
  slot,
  format = 'auto',
  className = '',
}: AdBannerProps) {
  const { isPremium, isLoading } = useSubscription();
  const adRef = useRef<HTMLModElement>(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    // Don't show ads if premium or still loading
    if (isPremium || isLoading) return;

    // Don't load if no slot or already loaded
    if (!slot || isAdLoaded.current) return;

    // Check if AdSense script is loaded
    if (typeof window === 'undefined') return;

    try {
      // Push ad only once
      if (!isAdLoaded.current && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isAdLoaded.current = true;
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [isPremium, isLoading, slot]);

  // Don't render if premium or loading
  if (isPremium || isLoading) {
    return null;
  }

  // Don't render if no slot configured
  if (!slot) {
    return null;
  }

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  // Don't render if no client ID
  if (!clientId) {
    return null;
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Placeholder for when ads would show (for premium users to see the space)
export function AdPlaceholder({ className = '' }: { className?: string }) {
  const { isPremium } = useSubscription();

  if (!isPremium) return null;

  return (
    <div
      className={`bg-muted/30 border border-dashed border-border rounded-lg p-4 text-center text-sm text-muted-foreground ${className}`}
    >
      <p>Merci d&apos;etre Premium - Pas de publicites</p>
    </div>
  );
}
