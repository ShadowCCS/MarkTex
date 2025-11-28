import React from 'react';
import { DocSettings, FontOptions, PaperSize } from '../types';
import { X } from 'lucide-react';

interface SettingsPanelProps {
  settings: DocSettings;
  onUpdate: (newSettings: DocSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleChange = <K extends keyof DocSettings>(key: K, value: DocSettings[K]) => {
    onUpdate({ ...settings, [key]: value });
  };

  return (
    <div className="absolute right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 shadow-xl z-20 flex flex-col no-print">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="font-semibold text-gray-800">Page Settings</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        {/* Paper Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Paper Size</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleChange('pageSize', PaperSize.A4)}
              className={`px-3 py-2 text-sm rounded-md border ${settings.pageSize === PaperSize.A4
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              A4
            </button>
            <button
              onClick={() => handleChange('pageSize', PaperSize.Letter)}
              className={`px-3 py-2 text-sm rounded-md border ${settings.pageSize === PaperSize.Letter
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              Letter
            </button>
          </div>
        </div>

        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
          <select
            value={settings.fontFamily}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          >
            {FontOptions.map((font) => (
              <option key={font.label} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Base Font Size: {settings.fontSize}px
          </label>
          <input
            type="range"
            min="10"
            max="24"
            step="1"
            value={settings.fontSize}
            onChange={(e) => handleChange('fontSize', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Line Height */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Line Spacing: {settings.lineHeight}
          </label>
          <input
            type="range"
            min="1"
            max="2.5"
            step="0.1"
            value={settings.lineHeight}
            onChange={(e) => handleChange('lineHeight', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Margins */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Margins: {settings.margins}rem
          </label>
          <input
            type="range"
            min="0.5"
            max="4"
            step="0.25"
            value={settings.margins}
            onChange={(e) => handleChange('margins', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Page Indicator */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-700">Page Indicator</label>
            <button
              onClick={() => handleChange('pageIndicator', { ...settings.pageIndicator, enabled: !settings.pageIndicator.enabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.pageIndicator.enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.pageIndicator.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>

          {settings.pageIndicator.enabled && (
            <>
              {/* Position */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['left', 'center', 'right'] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => handleChange('pageIndicator', { ...settings.pageIndicator, position: pos })}
                      className={`px-3 py-2 text-sm rounded-md border capitalize ${settings.pageIndicator.position === pos
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <div className="space-y-2">
                  {[
                    { value: 'number', label: '2' },
                    { value: 'number-total', label: '2/5' },
                    { value: 'page-number', label: 'Page 2' },
                    { value: 'page-number-of-total', label: 'Page 2 of 5' }
                  ].map((fmt) => (
                    <button
                      key={fmt.value}
                      onClick={() => handleChange('pageIndicator', { ...settings.pageIndicator, format: fmt.value as any })}
                      className={`w-full px-3 py-2 text-sm rounded-md border text-left ${settings.pageIndicator.format === fmt.value
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
