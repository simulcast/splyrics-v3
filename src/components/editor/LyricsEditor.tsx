import { useEffect, useState, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  Sparkles,
  Palette,
  Wand2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';

const LyricsEditor = () => {
  const {
    currentNote,
    updateNote,
    autocompleteSuggestion,
    selectionSuggestions,
    getAutocompleteSuggestion,
    getSelectionSuggestions,
    applyAutocompleteSuggestion,
    applySelectionSuggestion,
    setSelectedText,
  } = useAppContext();
  
  const [content, setContent] = useState('');
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(!currentNote?.content);

  useEffect(() => {
    // Update content when current note changes
    if (currentNote) {
      setContent(currentNote.content);
      setShowPlaceholder(!currentNote.content);
    } else {
      setContent('');
      setShowPlaceholder(true);
    }
  }, [currentNote]);

  useEffect(() => {
    // Get autocomplete suggestion when cursor is at the end of the text
    if (cursorPosition !== null && cursorPosition === content.length) {
      getAutocompleteSuggestion(content);
    } else {
      // Clear suggestions when cursor is not at the end
      getAutocompleteSuggestion('');
    }
  }, [cursorPosition, content]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setShowPlaceholder(!newContent);
    
    if (currentNote) {
      updateNote(currentNote.id, { content: newContent });
    }
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const selectedText = target.value.substring(target.selectionStart, target.selectionEnd);
    
    if (selectedText) {
      setSelectedText(selectedText);
      setSelectionRange({
        start: target.selectionStart,
        end: target.selectionEnd
      });
      getSelectionSuggestions(selectedText);
    } else {
      setSelectedText('');
      setSelectionRange(null);
      getSelectionSuggestions('');
    }
  };

  const handleCursorPosition = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setCursorPosition(target.selectionEnd);
  };

  const handleApplySuggestion = (replacement: string) => {
    applySelectionSuggestion(replacement);
    
    // Refocus textarea after applying suggestion
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleApplyAutocomplete = () => {
    applyAutocompleteSuggestion();
    
    // Refocus textarea after applying suggestion
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  if (!currentNote) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No note selected</h3>
        <p className="text-muted-foreground mt-2">
          Select a note from the list or create a new one to start writing.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium truncate">{currentNote.title}</h2>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Palette className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Theme suggestions</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Wand2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Enhance lyrics</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <div className="relative h-full">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onSelect={handleSelect}
            onKeyUp={handleCursorPosition}
            onClick={handleCursorPosition}
            className={cn(
              "h-full w-full resize-none p-6 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none border-0",
              "text-lg leading-relaxed font-medium",
              "transition-all duration-200"
            )}
          />
          
          {showPlaceholder && (
            <div className="absolute top-0 left-0 p-6 pointer-events-none text-muted-foreground/70 text-lg">
              <p>Start writing your lyrics here...</p>
              <p className="mt-4">Some tips:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>Press Tab for autocomplete suggestions</li>
                <li>Select text to see alternative suggestions</li>
                <li>Ask the assistant for help with rhymes, themes, or structure</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Autocomplete suggestion */}
      <AnimatePresence>
        {autocompleteSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="border-t p-4 bg-muted/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Continue with</span>
              </div>
              <Button 
                size="sm" 
                onClick={handleApplyAutocomplete}
                className="h-8 gap-1"
              >
                <span>Apply</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
            <p className="mt-2 text-md italic pl-6">
              {autocompleteSuggestion.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Selection suggestions */}
      <AnimatePresence>
        {selectionSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="border-t p-4 bg-muted/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">
                Alternatives for "{selectionSuggestions.original}"
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {selectionSuggestions.alternatives.map((alt, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-3 flex items-center justify-between">
                    <span className="text-sm truncate">{alt}</span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleApplySuggestion(alt)}
                      className="h-7 px-2"
                    >
                      Use
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LyricsEditor;