import { create } from 'zustand';
import { QuizState, Question } from './types';

// Initial dummy questions for "Primer Chispazo" to start with before AI takes over
const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q1',
    category: 'Personalidad',
    text: '¿Cuál es tu idea de una cita perfecta en este momento de nuestra relación?',
    type: 'text'
  },
  {
    id: 'q2',
    category: 'Gustos',
    text: 'Si pudieras viajar a cualquier lugar del mundo mañana mismo, ¿a dónde iríamos?',
    type: 'text'
  }
];

export const useQuizStore = create<QuizState>((set) => ({
  stage: null,
  mode: 'solo',
  currentQuestionIndex: 0,
  questions: INITIAL_QUESTIONS,
  answers: [],
  isVoiceMode: false,
  isProcessing: false,
  isFinished: false,
  player1: { name: 'Jugador 1' },
  player2: { name: 'Jugador 2' },

  setStage: (stage) => set({ stage }),
  setMode: (mode) => set({ mode }),
  setPlayers: (p1, p2) => set({ player1: { name: p1 }, player2: { name: p2 } }),
  addAnswer: (answer) => set((state) => ({ answers: [...state.answers, answer] })),
  nextQuestion: () => set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 })),
  toggleVoiceMode: () => set((state) => ({ isVoiceMode: !state.isVoiceMode })),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setQuestions: (questions) => set({ questions }),
  setFinished: (isFinished) => set({ isFinished }),
}));
