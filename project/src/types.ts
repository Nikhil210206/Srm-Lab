export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  imageUrl?: string;
  options: string[];
  correctAnswer: number;
  difficultyLevel: DifficultyLevel;
  subject: string;
  explanation?: string;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type QuestionType = 'text' | 'image';