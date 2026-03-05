import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { geminiService } from '@/services/gemini';
import { cn } from '@/lib/utils';

interface AnswerInputProps {
  onAnswer: (text: string) => void;
  isProcessing: boolean;
}

export const AnswerInput = ({ onAnswer, isProcessing }: AnswerInputProps) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'es-ES';
      
      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
        setIsListening(false);
      };

      recog.onerror = () => setIsListening(false);
      recog.onend = () => setIsListening(false);
      
      setRecognition(recog);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnswer(text);
      setText('');
    }
  };

  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mt-8 relative">
      <div className="relative flex items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu respuesta aquí..."
          className="w-full bg-surface/50 border border-white/10 rounded-xl px-6 py-4 pr-32 text-lg focus:outline-none focus:border-primary/50 transition-colors placeholder:text-text-muted/50"
          disabled={isProcessing}
        />
        
        <div className="absolute right-2 flex gap-2">
          {recognition && (
            <button
              type="button"
              onClick={toggleListening}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isListening ? "text-warm animate-pulse bg-warm/10" : "text-text-muted hover:text-text-main"
              )}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}
          
          <Button 
            type="submit" 
            size="sm" 
            disabled={!text.trim() || isProcessing}
            className="h-10 w-10 p-0 rounded-lg"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </form>
  );
};
