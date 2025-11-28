export interface DocSettings {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  pageSize: 'A4' | 'Letter';
  margins: number; // in rem
  viewMode: 'continuous' | 'paged';
  pageIndicator: PageIndicatorSettings;
}

export interface PageIndicatorSettings {
  enabled: boolean;
  position: 'left' | 'center' | 'right';
  format: 'number' | 'number-total' | 'page-number' | 'page-number-of-total';
}

export enum PaperSize {
  A4 = 'A4',
  Letter = 'Letter'
}

export const FontOptions = [
  { label: 'Sans Serif (Inter)', value: 'ui-sans-serif, system-ui, sans-serif' },
  { label: 'Serif (Merriweather)', value: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' },
  { label: 'Monospace (Fira Code)', value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
];

export interface AIState {
  isLoading: boolean;
  error: string | null;
  showPrompt: boolean;
}