export type RelationshipStage = 
  | "spark"      // Primer Chispazo
  | "serious"    // Esto Va En Serio
  | "official"   // Novios Oficiales
  | "forever";   // Para Siempre

export type QuizMode = "solo" | "versus";

export interface User {
  name: string;
  avatar?: string;
}

export interface Question {
  id: string;
  category: string;
  text: string;
  type: "text" | "choice" | "scale";
  options?: string[];
  requiresSearch?: boolean; // For Google Search integration
}

export interface Answer {
  questionId: string;
  user: "player1" | "player2";
  value: string;
  timestamp: number;
}

export interface QuizState {
  stage: RelationshipStage | null;
  mode: QuizMode;
  currentQuestionIndex: number;
  questions: Question[];
  answers: Answer[];
  isVoiceMode: boolean;
  isProcessing: boolean;
  isFinished: boolean;
  player1: User;
  player2: User;
  setStage: (stage: RelationshipStage) => void;
  setMode: (mode: QuizMode) => void;
  setPlayers: (p1: string, p2: string) => void;
  addAnswer: (answer: Answer) => void;
  nextQuestion: () => void;
  toggleVoiceMode: () => void;
  setProcessing: (isProcessing: boolean) => void;
  setQuestions: (questions: Question[]) => void;
  setFinished: (isFinished: boolean) => void;
}
