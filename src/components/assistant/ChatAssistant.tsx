import { useEffect, useRef, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { ChatMessage } from '@/types';
import { Send, Bot, User, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ChatAssistant = () => {
  const { chatMessages, currentNote, sendChatMessage, clearChatMessages } = useAppContext();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    // Show typing indicator when a new user message is added
    // and no assistant message has been added yet
    if (
      chatMessages.length > 0 && 
      chatMessages[chatMessages.length - 1].role === 'user'
    ) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [chatMessages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (message.trim()) {
      sendChatMessage(message);
      setMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const renderSuggestionChips = () => {
    const suggestions = [
      "Help me with a rhyme for...",
      "Suggest a chorus",
      "How can I improve this verse?",
      "What theme do you see in my lyrics?",
    ];

    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => {
              setMessage(suggestion);
              setTimeout(() => handleSendMessage(), 0);
            }}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 flex justify-between items-center">
        <h2 className="text-lg font-medium">Lyrics Assistant</h2>
        {chatMessages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChatMessages}
            className="h-8 px-2 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Clear chat
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {!currentNote ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No note selected</h3>
            <p className="text-muted-foreground mt-2">
              Select a note to get assistance with your lyrics.
            </p>
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <Bot className="h-12 w-12 text-primary/30 mb-4" />
              <h3 className="text-lg font-medium">Lyrics Assistant</h3>
              <p className="text-muted-foreground mt-2">
                Get help with rhymes, themes, structure, and more.
              </p>
              {renderSuggestionChips()}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {chatMessages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={cn(
                      "flex gap-2 mb-4",
                      msg.role === 'assistant' ? "flex-row" : "flex-row-reverse"
                    )}
                  >
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full text-sm",
                      msg.role === 'assistant' 
                        ? "bg-primary/10 text-primary" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {msg.role === 'assistant' ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className={cn(
                      "rounded-lg px-4 py-3 max-w-[85%]",
                      msg.role === 'assistant' 
                        ? "bg-muted text-primary-foreground" 
                        : "bg-primary text-primary-foreground ml-auto"
                    )}>
                      <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                      <div className="text-xs opacity-70 mt-1 text-right">
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  {index < chatMessages.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex gap-2"
              >
                <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary/10 text-primary text-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-3 flex items-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      
      {currentNote && (
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Ask for help with your lyrics..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;