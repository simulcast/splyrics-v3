import { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import NotesList from '@/components/notes/NotesList';
import LyricsEditor from '@/components/editor/LyricsEditor';
import ChatAssistant from '@/components/assistant/ChatAssistant';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen, PanelRightOpen } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const MainLayout = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const { currentNote } = useAppContext();
  
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(isMobile || isTablet);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(isMobile);

  useEffect(() => {
    // Update collapsed state when screen size changes
    setLeftPanelCollapsed(isMobile || isTablet);
    setRightPanelCollapsed(isMobile);
  }, [isMobile, isTablet]);

  const toggleLeftPanel = () => {
    setLeftPanelCollapsed(!leftPanelCollapsed);
  };

  const toggleRightPanel = () => {
    setRightPanelCollapsed(!rightPanelCollapsed);
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
      <header className="h-14 border-b flex items-center px-4 bg-card">
        <div className="flex-1 flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleLeftPanel}
            className="md:hidden"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">Lyrics Assistant</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleRightPanel}
            className="md:hidden"
          >
            <PanelRightOpen className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        {isMobile ? (
          // Mobile layout - stack panels vertically with conditional rendering
          <div className="h-full">
            {leftPanelCollapsed && !rightPanelCollapsed ? (
              <div className="h-full overflow-y-auto">
                <ChatAssistant />
              </div>
            ) : leftPanelCollapsed ? (
              <div className="h-full overflow-y-auto">
                <LyricsEditor />
              </div>
            ) : (
              <div className="h-full overflow-y-auto">
                <NotesList />
              </div>
            )}
          </div>
        ) : (
          // Desktop/tablet layout - use ResizablePanelGroup
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel 
              defaultSize={20} 
              minSize={15}
              maxSize={30}
              collapsible={true}
              collapsedSize={0}
              collapsed={leftPanelCollapsed}
              onCollapse={() => setLeftPanelCollapsed(true)}
              onExpand={() => setLeftPanelCollapsed(false)}
              className="bg-card/50"
            >
              <NotesList />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={60} minSize={30}>
              <LyricsEditor />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel 
              defaultSize={20} 
              minSize={15}
              maxSize={30}
              collapsible={true}
              collapsedSize={0}
              collapsed={rightPanelCollapsed}
              onCollapse={() => setRightPanelCollapsed(true)}
              onExpand={() => setRightPanelCollapsed(false)}
              className="bg-card/50"
            >
              <ChatAssistant />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
};

export default MainLayout;