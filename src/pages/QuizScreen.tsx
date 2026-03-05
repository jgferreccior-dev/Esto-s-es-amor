import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Sparkles, Search } from 'lucide-react';
import { useQuizStore } from '@/store';
import { geminiService } from '@/services/gemini';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/Quiz/ProgressBar';
import { AnswerInput } from '@/components/Quiz/AnswerInput';
import { CupidChat } from '@/components/Quiz/CupidChat';

export const QuizScreen = () => {
  const { 
    questions, 
    currentQuestionIndex, 
    nextQuestion, 
    addAnswer, 
    stage,
    answers,
    setQuestions,
    isVoiceMode,
    toggleVoiceMode,
    setFinished
  } = useQuizStore();

  const [feedback, setFeedback] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<'player1' | 'player2'>('player1');
  const [searchContext, setSearchContext] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === 14; // 15 questions total (0-14)

  // Initial question generation if needed (simulated for now, would be real in prod)
  useEffect(() => {
    if (questions.length <= 2 && stage) {
      // Trigger background generation
      geminiService.generateQuestions(stage, []).then(newQuestions => {
        if (newQuestions.length > 0) {
          setQuestions([...questions, ...newQuestions]);
        }
      });
    }
  }, [stage]);

  // Handle Google Search integration for specific questions
  useEffect(() => {
    if (currentQuestion?.requiresSearch) {
      // In a real implementation, we would call a service to perform the search
      // For now, we simulate or use a placeholder
      setSearchContext("Trending: 'The Last of Us', 'Succession', 'Euphoria'");
    } else {
      setSearchContext(null);
    }
  }, [currentQuestion]);

  // TTS when question changes if voice mode is on
  useEffect(() => {
    if (isVoiceMode && currentQuestion) {
      geminiService.speakText(currentQuestion.text).then(audioData => {
        if (audioData) {
          const audio = new Audio(`data:audio/mp3;base64,${audioData}`);
          audio.play();
        }
      });
    }
  }, [currentQuestion, isVoiceMode]);

  const handleAnswer = async (text: string) => {
    setIsProcessing(true);
    
    // 1. Save answer
    addAnswer({
      questionId: currentQuestion.id,
      user: currentPlayer,
      value: text,
      timestamp: Date.now()
    });

    // 2. Fast Feedback (Gemini Flash Lite)
    const reaction = await geminiService.getFastFeedback(text);
    setFeedback(reaction);

    // 3. Wait for feedback animation
    setTimeout(async () => {
      setFeedback(null);
      setIsProcessing(false);

      // Switch player or Next Question
      if (currentPlayer === 'player1') {
        setCurrentPlayer('player2');
      } else {
        setCurrentPlayer('player1');
        
        if (currentQuestionIndex < 14) {
          nextQuestion();
          
          // Adaptive: Generate more questions if running low
          if (currentQuestionIndex + 5 >= questions.length && questions.length < 15) {
             
             // Generate standard adaptive questions
             const newQs = await geminiService.generateQuestions(stage!, answers);
             
             // Generate one trending question
             const trendingQ = await geminiService.generateTrendingQuestion();
             
             let questionsToAdd = [...newQs];
             
             if (trendingQ && trendingQ.text) {
               // Add unique ID to trending question
               const uniqueTrendingQ = { 
                 ...trendingQ, 
                 id: `trend-${Date.now()}`, 
                 requiresSearch: true 
               };
               // Insert trending question in the mix
               questionsToAdd.push(uniqueTrendingQ);
             }
             
             if (questionsToAdd.length > 0) {
               setQuestions([...questions, ...questionsToAdd]);
             }
          }
        } else {
          // End of Quiz -> Results
          setFinished(true);
        }
      }
    }, 2000);
  };

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(199,125,255,0.1),transparent_50%)] pointer-events-none" />
      
      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button variant="ghost" size="sm" onClick={toggleVoiceMode}>
          {isVoiceMode ? <Volume2 className="text-primary" /> : <VolumeX />}
        </Button>
      </div>

      <div className="w-full max-w-3xl z-10">
        <ProgressBar current={currentQuestionIndex + 1} total={15} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 md:p-12">
              <span className="text-xs font-mono text-primary mb-4 uppercase tracking-widest">
                {currentQuestion.category}
              </span>
              
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-6">
                {currentQuestion.text}
              </h2>

              {searchContext && (
                <div className="flex items-center gap-2 text-xs text-secondary bg-secondary/10 px-3 py-1 rounded-full mb-6">
                  <Search size={12} />
                  <span>Data: {searchContext}</span>
                </div>
              )}

              <div className="mt-4 px-4 py-1 rounded-full bg-white/5 text-sm text-text-muted">
                Turno de: <span className="text-white font-bold">{currentPlayer === 'player1' ? 'Jugador 1' : 'Jugador 2'}</span>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <AnswerInput onAnswer={handleAnswer} isProcessing={isProcessing} />
      </div>

      {/* Feedback Toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-primary to-secondary p-[1px] rounded-full">
              <div className="bg-surface px-6 py-2 rounded-full flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <span className="font-display font-bold text-white">{feedback}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CupidChat />
    </div>
  );
};
