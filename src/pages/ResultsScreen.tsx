import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Share2, Volume2, VolumeX, RefreshCw, Sparkles } from 'lucide-react';
import { useQuizStore } from '@/store';
import { geminiService } from '@/services/gemini';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const ResultsScreen = () => {
  const { answers, stage, setFinished, setStage, isVoiceMode } = useQuizStore();
  const [report, setReport] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      const result = await geminiService.generateCompatibilityReport(answers);
      setReport(result);
      
      // Auto-generate audio if voice mode was on, but don't play yet
      if (result && isVoiceMode) {
        const audioData = await geminiService.speakText(result.summary);
        if (audioData) {
          const newAudio = new Audio(`data:audio/mp3;base64,${audioData}`);
          newAudio.onended = () => setIsPlaying(false);
          setAudio(newAudio);
        }
      }
    };
    fetchReport();
  }, []);

  const toggleAudio = () => {
    if (!audio && report) {
      // Generate if not ready
      geminiService.speakText(report.summary).then(audioData => {
        if (audioData) {
          const newAudio = new Audio(`data:audio/mp3;base64,${audioData}`);
          newAudio.onended = () => setIsPlaying(false);
          setAudio(newAudio);
          newAudio.play();
          setIsPlaying(true);
        }
      });
      return;
    }

    if (isPlaying) {
      audio?.pause();
      setIsPlaying(false);
    } else {
      audio?.play();
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    setFinished(false);
    setStage(null as any); // Reset to welcome
    useQuizStore.setState({ 
      currentQuestionIndex: 0, 
      answers: [], 
      questions: [] // Will reload initial
    });
  };

  if (!report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Heart className="h-16 w-16 text-primary mb-4" fill="currentColor" />
        </motion.div>
        <h2 className="text-2xl font-display font-bold">Analizando su conexión...</h2>
        <p className="text-text-muted mt-2">Cúpido IA está pensando profundamente.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12 relative">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,157,0.1),transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-8 z-10"
      >
        {/* Score Card */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-block relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <h1 className="relative text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary via-white to-secondary">
              {report.score}%
            </h1>
          </motion.div>
          <div className="mt-4 inline-block px-4 py-1 rounded-full border border-warm/50 text-warm font-mono text-sm uppercase tracking-widest bg-warm/10">
            {report.badge}
          </div>
        </div>

        {/* Summary Card */}
        <Card className="bg-surface/80 backdrop-blur-xl border-white/10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-display font-bold">Veredicto de Cúpido</h3>
            <Button variant="ghost" size="sm" onClick={toggleAudio}>
              {isPlaying ? <VolumeX className="text-primary" /> : <Volume2 />}
            </Button>
          </div>
          <p className="text-lg leading-relaxed text-text-muted">
            {report.summary}
          </p>
        </Card>

        {/* Strengths & Growth */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-secondary/20 bg-secondary/5">
            <h4 className="font-bold text-secondary mb-3 flex items-center gap-2">
              <Sparkles size={16} /> Superpoderes
            </h4>
            <ul className="space-y-2 text-sm text-text-muted">
              {report.strengths?.map((s: string, i: number) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </Card>
          
          <Card className="border-warm/20 bg-warm/5">
            <h4 className="font-bold text-warm mb-3 flex items-center gap-2">
              <Heart size={16} /> Para Cultivar
            </h4>
            <ul className="space-y-2 text-sm text-text-muted">
              {report.growthAreas?.map((s: string, i: number) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center pt-8">
          <Button variant="outline" onClick={handleRestart}>
            <RefreshCw className="mr-2 h-4 w-4" /> Jugar de nuevo
          </Button>
          <Button variant="primary">
            <Share2 className="mr-2 h-4 w-4" /> Compartir
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
