/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useQuizStore } from './store';
import { WelcomeScreen } from './pages/WelcomeScreen';
import { QuizScreen } from './pages/QuizScreen';
import { ResultsScreen } from './pages/ResultsScreen';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { stage, isFinished } = useQuizStore();

  return (
    <div className="min-h-screen bg-background text-text-main selection:bg-primary/30">
      <AnimatePresence mode="wait">
        {!stage && (
          <motion.div
            key="welcome"
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0"
          >
            <WelcomeScreen />
          </motion.div>
        )}
        {stage && !isFinished && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <QuizScreen />
          </motion.div>
        )}
        {isFinished && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0"
          >
            <ResultsScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
