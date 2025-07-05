export interface Suggestion {
  user_name: string;
  comments: string;
  rating: number;
}

export interface SuggestionState {
  suggestions: Suggestion[];
  addSuggestion: (suggestion: Suggestion) => Promise<void>;
}