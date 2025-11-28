import React, { useState, useRef, useCallback } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import SettingsPanel from './components/SettingsPanel';
import { DocSettings, PaperSize, AIState } from './types';
import { DEFAULT_MARKDOWN } from './constants';
import { Printer, Settings, Sparkles, FileDown, Download, ChevronLeft, ChevronRight, Columns, ScrollText } from 'lucide-react';
import { improveContent } from './services/geminiService';

const App: React.FC = () => {
  const [content, setContent] = useState<string>(DEFAULT_MARKDOWN);
  const [settings, setSettings] = useState<DocSettings>({
    fontSize: 16, // px base
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    lineHeight: 1.5,
    pageSize: PaperSize.A4,
    margins: 2.5, // rem
    viewMode: 'continuous',
    pageIndicator: {
      enabled: true,
      position: 'center',
      format: 'number-total'
    }
  });

  const [showSettings, setShowSettings] = useState(false);
  const [aiState, setAiState] = useState<AIState>({
    isLoading: false,
    error: null,
    showPrompt: false
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [editorWidth, setEditorWidth] = useState(50); // Percentage

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleAIRequest = async () => {
    if (!aiPrompt.trim()) return;

    setAiState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const newContent = await improveContent(content, aiPrompt);
      setContent(newContent);
      setAiState(prev => ({ ...prev, isLoading: false, showPrompt: false }));
      setAiPrompt('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setAiState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
    }
  };

  return (
    <div className="app-container flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 no-print shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileDown className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">MarkTeX <span className="text-blue-600">PDF</span></h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setSettings(s => ({ ...s, viewMode: 'continuous' }))}
              className={`p-1.5 rounded-md transition-all ${settings.viewMode === 'continuous' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="Continuous Scroll"
            >
              <ScrollText size={18} />
            </button>
            <button
              onClick={() => setSettings(s => ({ ...s, viewMode: 'paged' }))}
              className={`p-1.5 rounded-md transition-all ${settings.viewMode === 'paged' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="Paged View"
            >
              <Columns size={18} />
            </button>
          </div>

          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          <button
            onClick={() => setAiState(prev => ({ ...prev, showPrompt: !prev.showPrompt }))}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${aiState.showPrompt ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
          >
            <Sparkles size={16} className={aiState.showPrompt ? "text-purple-600" : "text-gray-400"} />
            AI Assist
          </button>

          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
            title="Page Settings"
          >
            <Settings size={20} />
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-sm hover:shadow"
          >
            <Printer size={18} />
            Export PDF
          </button>
        </div>
      </header>

      {/* AI Prompt Overlay */}
      {aiState.showPrompt && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4 no-print animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-white rounded-xl shadow-2xl border border-purple-100 p-1 overflow-hidden">
            <div className="relative">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask AI to write, summarize, or format (e.g., 'Add a table of contents', 'Explain the math')..."
                className="w-full pl-4 pr-12 py-3 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleAIRequest()}
                autoFocus
                disabled={aiState.isLoading}
              />
              <button
                onClick={handleAIRequest}
                disabled={aiState.isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {aiState.isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={16} />}
              </button>
            </div>
            {aiState.error && (
              <div className="px-4 py-2 bg-red-50 text-red-600 text-xs border-t border-red-100">
                {aiState.error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Editor Pane */}
        <div
          className="flex-shrink-0 transition-all duration-75 no-print"
          style={{ width: `${editorWidth}%` }}
        >
          <Editor content={content} onChange={setContent} />
        </div>

        {/* Resizer Handle */}
        <div
          className="w-1 bg-gray-200 hover:bg-blue-400 cursor-col-resize flex items-center justify-center z-10 transition-colors no-print"
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startWidth = editorWidth;
            const handleMouseMove = (moveEvent: MouseEvent) => {
              const deltaX = moveEvent.clientX - startX;
              const containerWidth = window.innerWidth;
              const deltaPercent = (deltaX / containerWidth) * 100;
              const newWidth = Math.min(Math.max(startWidth + deltaPercent, 20), 80);
              setEditorWidth(newWidth);
            };
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        >
          <div className="h-8 w-1 bg-gray-300 rounded-full" />
        </div>

        {/* Preview Pane */}
        <div className="flex-1 bg-gray-100/50 relative overflow-hidden">
          <Preview
            ref={printRef}
            content={content}
            settings={settings}
          />

          <SettingsPanel
            settings={settings}
            onUpdate={setSettings}
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />
        </div>
      </main>

      {/* Mobile Print Warning (optional, mostly for desktop tool) */}
      <style>{`
        @media print {
            @page {
                margin-top: ${settings.margins}rem;
                margin-bottom: ${settings.pageIndicator.enabled ? '60px' : `${settings.margins}rem`};
                margin-left: ${settings.margins}rem;
                margin-right: ${settings.margins}rem;
                /* Remove default browser header/footer */
                size: ${settings.pageSize};
            }

            ${settings.pageIndicator.enabled ? `
            @page {
                @bottom-${settings.pageIndicator.position} {
                    content: ${settings.pageIndicator.format === 'number' ? 'counter(page)' :
            settings.pageIndicator.format === 'number-total' ? 'counter(page) "/" counter(pages)' :
              settings.pageIndicator.format === 'page-number' ? '"Page " counter(page)' :
                '"Page " counter(page) " of " counter(pages)'
          };
                    font-family: ${settings.fontFamily};
                    font-size: 10pt;
                    color: #666;
                }
            }
            ` : ''}

            .no-print { display: none !important; }
            
            /* Reset all parent containers to allow full height printing */
            body, #root, .app-container, main {
                height: auto !important;
                overflow: visible !important;
                position: static !important;
                display: block !important;
            }

            .preview-wrapper {
                height: auto !important;
                overflow: visible !important;
                display: block !important;
                padding: 0 !important;
                background: white !important;
            }
            .print-container { 
                box-shadow: none !important; 
                margin: 0 !important; 
                width: 100% !important;
                max-width: none !important;
                min-height: auto !important;
                height: auto !important;
                column-width: auto !important;
                column-count: auto !important;
                column-gap: 0 !important;
                column-rule: none !important;
                padding: 0 !important;
            }
            body { background: white !important; }
            /* Hide the scrollbars in print */
            ::-webkit-scrollbar { display: none; }
            /* Break pages properly */
            .page-break { 
                break-after: page; 
                page-break-after: always;
                height: 0;
                display: block;
                visibility: hidden;
            }
        }
      `}</style>
    </div>
  );
};

export default App;
