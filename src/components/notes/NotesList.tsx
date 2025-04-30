import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Note } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MoreVertical, 
  FilePlus, 
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';

const NotesList = () => {
  const { notes, currentNote, createNote, deleteNote, setCurrentNote, updateNote } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const handleSelectNote = (note: Note) => {
    setCurrentNote(note);
  };

  const handleDeleteNote = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    setNoteToDelete(note);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete.id);
      setNoteToDelete(null);
    }
  };

  const startEditingTitle = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(note.id);
    setEditTitle(note.title);
  };

  const saveTitle = (id: string) => {
    if (editTitle.trim()) {
      updateNote(id, { title: editTitle });
    }
    setIsEditing(null);
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort notes by updatedAt (most recent first)
  const sortedNotes = [...filteredNotes].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">My Lyrics</h2>
          <Button 
            onClick={createNote}
            size="sm"
            className="rounded-full h-8 w-8 p-0"
          >
            <FilePlus className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sortedNotes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {notes.length === 0 ? (
                <p>Create your first lyric note</p>
              ) : (
                <p>No matching notes found</p>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {sortedNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleSelectNote(note)}
                  className={cn(
                    "p-3 rounded-md cursor-pointer transition-colors",
                    "hover:bg-muted/50",
                    currentNote?.id === note.id && "bg-muted"
                  )}
                >
                  <div className="flex justify-between items-start">
                    {isEditing === note.id ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => saveTitle(note.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveTitle(note.id);
                          if (e.key === 'Escape') setIsEditing(null);
                        }}
                        autoFocus
                        className="h-7 text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div 
                        className="text-sm font-medium truncate flex-1"
                        onDoubleClick={(e) => startEditingTitle(note, e)}
                      >
                        {note.title}
                      </div>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => startEditingTitle(note, e)}>
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => handleDeleteNote(note, e)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(note.updatedAt)}
                  </div>
                  
                  <div className="text-xs mt-2 line-clamp-2 text-muted-foreground">
                    {note.content || "No content yet"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
      
      <AlertDialog open={!!noteToDelete} onOpenChange={() => setNoteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{noteToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NotesList;