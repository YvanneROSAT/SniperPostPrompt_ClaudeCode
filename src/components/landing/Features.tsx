'use client';

import { FileImage, Type, Palette, Moon } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Features() {
  const t = useTranslations('Features');

  const features = [
    {
      icon: FileImage,
      titleKey: 'exportTitle',
      descKey: 'exportDesc',
    },
    {
      icon: Type,
      titleKey: 'markdownTitle',
      descKey: 'markdownDesc',
    },
    {
      icon: Palette,
      titleKey: 'customTitle',
      descKey: 'customDesc',
    },
    {
      icon: Moon,
      titleKey: 'darkModeTitle',
      descKey: 'darkModeDesc',
    },
  ];

  return (
    <section id="features" className="py-24 sm:py-32 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {t('title')}
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.titleKey}
              className="relative p-6 rounded-2xl bg-card border border-border/50 shadow-apple transition-all duration-300 hover:shadow-apple-md hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t(feature.titleKey)}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
