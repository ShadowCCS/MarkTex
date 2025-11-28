import React from 'react';

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  return (
    <div className="h-full w-full bg-slate-900 text-slate-100 flex flex-col no-print">
      <div className="bg-slate-800 px-4 py-2 text-xs font-mono text-slate-400 border-b border-slate-700 flex justify-between">
        <span>MARKDOWN INPUT</span>
        <span>$E=mc^2$ supported</span>
      </div>
      <textarea
        className="flex-1 w-full bg-slate-900 text-gray-200 p-6 font-mono text-sm resize-none focus:outline-none focus:ring-0 leading-relaxed custom-scrollbar"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type markdown here..."
        spellCheck={false}
      />
    </div>
  );
};

export default Editor;
