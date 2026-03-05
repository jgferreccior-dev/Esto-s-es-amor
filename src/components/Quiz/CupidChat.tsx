import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { geminiService } from '@/services/gemini';
import { useQuizStore } from '@/store';
import { cn } from '@/lib/utils';

export const CupidChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'cupid'; text: string }[]>([
    { role: 'cupid', text: '¡Hola! Soy Cúpido IA. Estoy aquí para ayudarles si se atascan o quieren un consejo. 💘' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { currentQuestionIndex, questions, answers } = useQuizStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    const context = {
      currentQuestion: questions[currentQuestionIndex],
      recentAnswers: answers.slice(-3)
    };

    const response = await geminiService.chatWithCupid(userMsg, context);
    
    setMessages(prev => [...prev, { role: 'cupid', text: response }]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-tr from-warm to-primary shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] max-h-[80vh]"
          >
            <Card className="h-full flex flex-col p-0 overflow-hidden border-warm/30 shadow-2xl bg-[#12121A]/95 backdrop-blur-xl">
              {/* Header */}
              <div className="p-4 border-b border-white/10 bg-gradient-to-r from-warm/20 to-primary/20 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-warm flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm">Cúpido IA</h3>
                  <p className="text-xs text-text-muted">Asistente del Amor</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "max-w-[85%] rounded-2xl p-3 text-sm",
                      msg.role === 'user' 
                        ? "ml-auto bg-primary/20 text-primary-foreground rounded-tr-none" 
                        : "bg-white/5 text-text-main rounded-tl-none"
                    )}
                  >
                    {msg.text}
                  </div>
                ))}
                {isTyping && (
                  <div className="bg-white/5 rounded-2xl p-3 w-16 rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-text-muted/50 rounded-full animate-bounce" />
                      <div className="h-2 w-2 bg-text-muted/50 rounded-full animate-bounce delay-75" />
                      <div className="h-2 w-2 bg-text-muted/50 rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregúntale a Cúpido..."
                  className="flex-1 bg-background/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-warm/50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="h-9 w-9 bg-warm rounded-xl flex items-center justify-center text-white hover:bg-warm/90 disabled:opacity-50 transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
