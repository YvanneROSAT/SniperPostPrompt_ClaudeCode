'use client';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>{t('badge')}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            {t('title')}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {t('titleHighlight')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
            {t('subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="btn-apple text-base px-8 py-6">
              <Link href="/app">
                {t('cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="btn-apple text-base px-8 py-6">
              <Link href="#pricing">
                {t('ctaSecondary')}
              </Link>
            </Button>
          </div>

          {/* Social proof */}
          <p className="text-sm text-muted-foreground">
            {t('socialProof')}
          </p>
        </div>

        {/* Preview mockup */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden shadow-apple-lg border border-border/50 bg-card">
            <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-600 p-8 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-md">
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('preview')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
