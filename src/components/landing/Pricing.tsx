'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, X, Crown, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Gratuit',
    price: '0',
    description: 'Pour commencer et decouvrir',
    icon: Zap,
    features: [
      { text: 'Toutes les fonctionnalites', included: true },
      { text: 'Export illimite', included: true },
      { text: 'Tous les formats', included: true },
      { text: 'Publicites affichees', included: false },
    ],
    cta: 'Commencer',
    href: '/app',
    popular: false,
  },
  {
    name: 'Premium',
    price: '5',
    description: 'Pour une experience optimale',
    icon: Crown,
    features: [
      { text: 'Toutes les fonctionnalites', included: true },
      { text: 'Export illimite', included: true },
      { text: 'Tous les formats', included: true },
      { text: 'Sans publicites', included: true },
      { text: 'Support prioritaire', included: true },
    ],
    cta: "S'abonner",
    href: '#checkout',
    popular: true,
  },
];

export function Pricing() {
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

  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Tarifs simples et transparents
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Commencez gratuitement, passez a Premium quand vous le souhaitez.
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
                    Populaire
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
                {plan.price !== '0' && <span className="text-muted-foreground">/mois</span>}
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
          Annulez a tout moment. Pas d&apos;engagement.
        </p>
      </div>
    </section>
  );
}
