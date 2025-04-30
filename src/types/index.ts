export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutocompleteSuggestion {
  text: string;
  confidence: number;
}

export interface SelectionSuggestion {
  original: string;
  alternatives: string[];
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}