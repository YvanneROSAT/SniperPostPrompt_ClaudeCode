'use client';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Check, X, Crown, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Pricing() {
  const t = useTranslations('Pricing');

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID }),
      });
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const plans = [
    {
      name: t('free.name'),
      price: t('free.price'),
      description: t('free.description'),
      icon: Zap,
      features: [
        { text: t('free.feature1'), included: true },
        { text: t('free.feature2'), included: true },
        { text: t('free.feature3'), included: true },
        { text: t('free.feature4'), included: false },
      ],
      cta: t('free.cta'),
      href: '/app',
      popular: false,
    },
    {
      name: t('premium.name'),
      price: t('premium.price'),
      description: t('premium.description'),
      icon: Crown,
      features: [
        { text: t('premium.feature1'), included: true },
        { text: t('premium.feature2'), included: true },
        { text: t('premium.feature3'), included: true },
        { text: t('premium.feature4'), included: true },
        { text: t('premium.feature5'), included: true },
        { text: t('premium.feature6'), included: true },
      ],
      cta: t('premium.cta'),
      href: '#checkout',
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="py-24 sm:py-32">
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

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                plan.popular
                  ? 'bg-card border-primary shadow-apple-lg scale-105'
                  : 'bg-card border-border/50 shadow-apple hover:shadow-apple-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    <Crown className="h-3.5 w-3.5" />
                    {t('popular')}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  plan.popular ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <plan.icon className={`h-5 w-5 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}EUR</span>
                {plan.price !== '0' && <span className="text-muted-foreground">{t('perMonth')}</span>}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
                    )}
                    <span className={feature.included ? 'text-foreground' : 'text-muted-foreground/50'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.popular ? (
                <Button
                  onClick={handleCheckout}
                  className="w-full btn-apple"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  className="w-full btn-apple"
                  size="lg"
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* FAQ or note */}
        <p className="text-center text-sm text-muted-foreground mt-12">
          {t('cancel')}
        </p>
      </div>
    </section>
  );
}
