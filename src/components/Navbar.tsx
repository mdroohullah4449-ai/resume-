import React from 'react';
import { Sparkles, RefreshCw, FileText, Building2, Check } from 'lucide-react';
import { SAMPLE_PRESETS, Preset } from '../data/samplePresets';

interface NavbarProps {
  onSelectPreset: (preset: Preset) => void;
  onReset: () => void;
  hasResults: boolean;
  onNewAnalysis: () => void;
  currentView: 'analyzer' | 'vacancies';
  onToggleView: (view: 'analyzer' | 'vacancies') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectPreset,
  onReset,
  hasResults,
  onNewAnalysis,
  currentView,
  onToggleView,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      {/* High-contrast top accent line */}
      <div className="h-[2px] w-full bg-blue-600" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onToggleView('analyzer')}
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xs hover:shadow-md hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95 border border-blue-500/30 overflow-hidden"
            title="TalentSync Home"
          >
            {/* Subtle ambient interior hover sheen */}
            <span className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* TalentSync Custom Logo: Synchronized Talent Arcs with Central Compatibility Star */}
            <svg
              className="relative h-5 w-5 text-white transition-transform duration-500 ease-out group-hover:rotate-180"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Upper Talent Stream Arc */}
              <path
                d="M12 3.5C7.85786 3.5 4.5 6.85786 4.5 11C4.5 12.3 4.83 13.52 5.41 14.59L3.8 16.2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M6.2 10.2H3.8V12.6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Lower Market Opportunity Stream Arc */}
              <path
                d="M12 20.5C16.1421 20.5 19.5 17.1421 19.5 13C19.5 11.7 19.17 10.48 18.59 9.41L20.2 7.8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M17.8 13.8H20.2V11.4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Central Talent Alignment Node */}
              <path
                d="M12 7.8L13.2 10.8L16.2 12L13.2 13.2L12 16.2L10.8 13.2L7.8 12L10.8 10.8L12 7.8Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleView('analyzer')}
                className="text-left text-lg font-black tracking-tight text-slate-950 font-['Space_Grotesk'] hover:text-blue-600 transition-colors"
              >
                TalentSync
              </button>
              <span className="rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                Intelligence Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block font-medium">
              Resume compatibility · Skill gap diagnostics · Verified company vacancies
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="hidden sm:flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => onToggleView('analyzer')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              currentView === 'analyzer'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Compatibility Analyzer</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleView('vacancies')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              currentView === 'vacancies'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="h-3.5 w-3.5 text-blue-600" />
            <span>Company Vacancies Radar</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Preset Selector */}
          <div className="relative hidden lg:flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Presets:</span>
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200">
              {SAMPLE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPreset(p)}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all"
                  title={`Load ${p.name} Sample Data`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  <span>{p.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reset / New Button */}
          {hasResults ? (
            <button
              onClick={onNewAnalysis}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-xs active:scale-95"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>New Analysis</span>
            </button>
          ) : (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
