'use client';

import { FileImage, Type, Palette, Moon } from 'lucide-react';

const features = [
  {
    icon: FileImage,
    title: 'Export Multi-formats',
    description: 'Exportez en 16:9 ou 9:16 pour tous vos reseaux sociaux et presentations.',
  },
  {
    icon: Type,
    title: 'Mise en forme Markdown',
    description: 'Gras, italique, titres, listes... formatez facilement votre contenu.',
  },
  {
    icon: Palette,
    title: 'Personnalisation complete',
    description: 'Polices, couleurs, arrieres-plans personnalisables a votre image.',
  },
  {
    icon: Moon,
    title: 'Mode Sombre',
    description: 'Interface adaptee a vos preferences avec support du theme systeme.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Tout ce dont vous avez besoin
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Des outils simples et puissants pour creer des visuels professionnels en quelques secondes.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="relative p-6 rounded-2xl bg-card border border-border/50 shadow-apple transition-all duration-300 hover:shadow-apple-md hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
