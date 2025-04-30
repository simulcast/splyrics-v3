import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Note, ChatMessage, AutocompleteSuggestion, SelectionSuggestion } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface AppContextType {
  notes: Note[];
  currentNote: Note | null;
  chatMessages: ChatMessage[];
  autocompleteSuggestion: AutocompleteSuggestion | null;
  selectionSuggestions: SelectionSuggestion | null;
  selectedText: string;
  createNote: () => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setCurrentNote: (note: Note | null) => void;
  sendChatMessage: (content: string) => void;
  clearChatMessages: () => void;
  setSelectedText: (text: string) => void;
  getSelectionSuggestions: (text: string) => void;
  getAutocompleteSuggestion: (content: string) => void;
  applyAutocompleteSuggestion: () => void;
  applySelectionSuggestion: (replacement: string) => void;
}

const defaultContext: AppContextType = {
  notes: [],
  currentNote: null,
  chatMessages: [],
  autocompleteSuggestion: null,
  selectionSuggestions: null,
  selectedText: '',
  createNote: () => {},
  updateNote: () => {},
  deleteNote: () => {},
  setCurrentNote: () => {},
  sendChatMessage: () => {},
  clearChatMessages: () => {},
  setSelectedText: () => {},
  getSelectionSuggestions: () => {},
  getAutocompleteSuggestion: () => {},
  applyAutocompleteSuggestion: () => {},
  applySelectionSuggestion: () => {},
};

export const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [autocompleteSuggestion, setAutocompleteSuggestion] = useState<AutocompleteSuggestion | null>(null);
  const [selectionSuggestions, setSelectionSuggestions] = useState<SelectionSuggestion | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');

  // Load notes from localStorage on initial render
  useEffect(() => {
    const savedNotes = localStorage.getItem('lyrics-assistant-notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        // Convert string dates back to Date objects
        const notesWithDates = parsedNotes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(notesWithDates);
        
        // Set the most recently updated note as current if no note is selected
        if (notesWithDates.length > 0 && !currentNote) {
          const sortedNotes = [...notesWithDates].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          setCurrentNote(sortedNotes[0]);
        }
      } catch (error) {
        console.error('Failed to parse saved notes:', error);
      }
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('lyrics-assistant-notes', JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    const newNote: Note = {
      id: uuidv4(),
      title: 'Untitled Lyrics',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setCurrentNote(newNote);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const updatedNotes = notes.map((note) => {
      if (note.id === id) {
        const updatedNote = { 
          ...note, 
          ...updates,
          updatedAt: new Date(),
        };
        
        // If we're updating the current note, also update the currentNote state
        if (currentNote && currentNote.id === id) {
          setCurrentNote(updatedNote);
        }
        
        return updatedNote;
      }
      return note;
    });
    
    setNotes(updatedNotes);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    
    // If we're deleting the current note, set the most recent note as current
    if (currentNote && currentNote.id === id) {
      if (updatedNotes.length > 0) {
        const sortedNotes = [...updatedNotes].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setCurrentNote(sortedNotes[0]);
      } else {
        setCurrentNote(null);
      }
    }
  };

  const sendChatMessage = (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: new Date(),
    };
    
    setChatMessages([...chatMessages, userMessage]);
    
    // Simulate assistant response (in a real app, this would call an AI API)
    setTimeout(() => {
      // Generate a contextual response based on current note and user message
      const noteLyrics = currentNote?.content || '';
      let assistantResponse = "I'm your lyrics assistant. How can I help with your song?";
      
      if (content.toLowerCase().includes('rhyme')) {
        assistantResponse = "Here are some rhyme suggestions based on your lyrics...";
      } else if (content.toLowerCase().includes('theme')) {
        assistantResponse = "Looking at your lyrics, I sense themes of...";
      } else if (content.toLowerCase().includes('structure')) {
        assistantResponse = "For song structure, you might consider...";
      } else if (noteLyrics) {
        assistantResponse = "I've analyzed your lyrics. Would you like suggestions for the next verse?";
      }
      
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        content: assistantResponse,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setChatMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const clearChatMessages = () => {
    setChatMessages([]);
  };

  const getSelectionSuggestions = (text: string) => {
    if (!text.trim()) {
      setSelectionSuggestions(null);
      return;
    }
    
    // In a real app, this would call an AI API to get alternatives
    // Here we'll just provide some mock data based on the selected text
    
    const mockSuggestions = {
      original: text,
      alternatives: [
        text.toUpperCase(),
        text.toLowerCase(),
        text + ' (emphatically)',
        'a ' + text.replace(/^\w/, (c) => c.toUpperCase()),
      ],
    };
    
    setSelectionSuggestions(mockSuggestions);
  };

  const getAutocompleteSuggestion = (content: string) => {
    if (!content.trim()) {
      setAutocompleteSuggestion(null);
      return;
    }
    
    // In a real app, this would call an AI API to get next line suggestions
    // Here we'll provide a mock suggestion based on the last line of content
    
    const lines = content.split('\n');
    const lastLine = lines[lines.length - 1].trim();
    
    if (!lastLine) {
      setAutocompleteSuggestion(null);
      return;
    }
    
    let suggestion = '';
    
    // Simple mock logic for suggestion generation
    if (lastLine.toLowerCase().includes('love')) {
      suggestion = 'Like stars shining from above';
    } else if (lastLine.toLowerCase().includes('heart')) {
      suggestion = 'Tearing us apart';
    } else if (lastLine.toLowerCase().includes('day')) {
      suggestion = 'In every single way';
    } else if (lastLine.toLowerCase().includes('night')) {
      suggestion = 'Holding you so tight';
    } else {
      // Generate something based on the last word
      const lastWord = lastLine.split(' ').pop() || '';
      suggestion = `The ${lastWord} takes me to a new place`;
    }
    
    setAutocompleteSuggestion({
      text: suggestion,
      confidence: 0.85,
    });
  };

  const applyAutocompleteSuggestion = () => {
    if (!currentNote || !autocompleteSuggestion) return;
    
    const updatedContent = currentNote.content.trim() + '\n' + autocompleteSuggestion.text;
    
    updateNote(currentNote.id, { content: updatedContent });
    setAutocompleteSuggestion(null);
  };

  const applySelectionSuggestion = (replacement: string) => {
    if (!currentNote || !selectedText) return;
    
    const updatedContent = currentNote.content.replace(selectedText, replacement);
    
    updateNote(currentNote.id, { content: updatedContent });
    setSelectedText('');
    setSelectionSuggestions(null);
  };

  return (
    <AppContext.Provider
      value={{
        notes,
        currentNote,
        chatMessages,
        autocompleteSuggestion,
        selectionSuggestions,
        selectedText,
        createNote,
        updateNote,
        deleteNote,
        setCurrentNote,
        sendChatMessage,
        clearChatMessages,
        setSelectedText,
        getSelectionSuggestions,
        getAutocompleteSuggestion,
        applyAutocompleteSuggestion,
        applySelectionSuggestion,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};