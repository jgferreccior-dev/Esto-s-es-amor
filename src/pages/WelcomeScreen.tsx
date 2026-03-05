import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Flame, Heart, Infinity } from 'lucide-react';
import { useQuizStore } from '@/store';
import { RelationshipStage } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const stages: { id: RelationshipStage; label: string; icon: React.ElementType; desc: string; color: string }[] = [
  { id: 'spark', label: 'Primer Chispazo', icon: Sparkles, desc: 'Recién se conocen, todo es nuevo y emocionante.', color: 'text-secondary' },
  { id: 'serious', label: 'Esto Va En Serio', icon: Flame, desc: 'Llevan unos meses, construyendo confianza.', color: 'text-warm' },
  { id: 'official', label: 'Novios Oficiales', icon: Heart, desc: 'Relación establecida, compromiso claro.', color: 'text-primary' },
  { id: 'forever', label: 'Para Siempre', icon: Infinity, desc: 'Casados o de larga duración, una vida juntos.', color: 'text-white' },
];

export const WelcomeScreen = () => {
  const setStage = useQuizStore((state) => state.setStage);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-warm">
            Conexión Profunda
          </span>
        </h1>
        <p className="mt-4 text-lg text-text-muted max-w-md mx-auto">
          Descubre qué tan conectados están realmente. Un viaje guiado por IA para parejas.
        </p>
      </motion.div>

      <div className="grid w-full max-w-4xl gap-4 md:grid-cols-2">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="group cursor-pointer hover:bg-white/5 transition-colors h-full flex flex-col items-center text-center py-8"
              onClick={() => setStage(stage.id)}
            >
              <stage.icon className={cn("h-12 w-12 mb-4 transition-transform group-hover:scale-110", stage.color)} />
              <h3 className="font-display text-xl font-bold mb-2">{stage.label}</h3>
              <p className="text-sm text-text-muted">{stage.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
