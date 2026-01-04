'use client';

import { Link } from '@/i18n/navigation';
import { ModeToggle } from '@/components/theme/mode-toggle';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">PS</span>
            </div>
            <span className="font-semibold text-foreground">Prompt Styler</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/app" className="hover:text-foreground transition-colors">
              {t('app')}
            </Link>
            <Link href="#features" className="hover:text-foreground transition-colors">
              {t('features')}
            </Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">
              {t('pricing')}
            </Link>
          </nav>

          {/* Theme toggle */}
          <div className="flex items-center gap-4">
            <ModeToggle />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Prompt Styler. {t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
