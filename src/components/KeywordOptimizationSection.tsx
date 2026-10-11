import React, { useState } from 'react';
import { KeywordAnalysis, BulletOptimizationResult } from '../types/analyzer';
import {
  FileCode,
  Copy,
  Check,
  Sparkles,
  TrendingUp,
  Award,
  Layers,
  Wand2,
  CheckCircle2,
} from 'lucide-react';

interface KeywordOptimizationSectionProps {
  keywordData: KeywordAnalysis;
  roleTitle?: string;
}

export const KeywordOptimizationSection: React.FC<KeywordOptimizationSectionProps> = ({
  keywordData,
  roleTitle,
}) => {
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [customBullet, setCustomBullet] = useState<string>('');
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizedResult, setOptimizedResult] = useState<BulletOptimizationResult | null>(null);
  const [bulletError, setBulletError] = useState<string | null>(null);

  const handleCopy = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    setCopiedKeyword(keyword);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const handleOptimizeCustomBullet = async () => {
    if (!customBullet.trim()) return;
    setIsOptimizing(true);
    setBulletError(null);
    setOptimizedResult(null);

    try {
      const res = await fetch('/api/optimize-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalBullet: customBullet,
          targetRole: roleTitle || 'Target Role',
          keywords: keywordData.missingKeywords.map((k) => k.keyword),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to optimize bullet.');
      }

      const data = await res.json();
      setOptimizedResult(data);
    } catch (err: any) {
      setBulletError(err.message || 'Error optimizing bullet.');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ATS Architecture & Keyword Overview */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-xs">
            <FileCode className="h-4 w-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 tracking-wide">
            ATS Semantic Keyword Intelligence
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Applicant Tracking Systems parse documents into tokenized vector clusters. Including the exact syntax used in the job description significantly raises match confidence.
        </p>

        {keywordData.atsSummaryRecommendation && (
          <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 text-xs text-indigo-950 font-medium">
            <span className="font-bold text-indigo-700">Format & Structure Advisory: </span>
            {keywordData.atsSummaryRecommendation}
          </div>
        )}
      </div>

      {/* Missing Keywords Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900 tracking-wide">High-Value Missing Keywords</h4>
            <p className="text-xs text-slate-500">
              Crucial keywords present in the JD but absent or insufficiently emphasized in your resume
            </p>
          </div>
          <span className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs text-rose-700 font-mono font-bold tabular-nums">
            {keywordData.missingKeywords.length} Missing Terms
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {keywordData.missingKeywords.map((kw, idx) => (
            <div
              key={idx}
              className="group relative rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 flex flex-col justify-between hover:border-indigo-300 hover:bg-white transition-all duration-200 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 font-mono group-hover:text-indigo-600 transition-colors">
                    {kw.keyword}
                  </span>
                  <button
                    onClick={() => handleCopy(kw.keyword)}
                    className="text-slate-400 hover:text-indigo-600 p-1 transition-colors"
                    title="Copy keyword"
                  >
                    {copiedKeyword === kw.keyword ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                <div className="mt-2 text-[11px] text-slate-600">
                  <span className="text-slate-500 font-semibold">Placement: </span>
                  <span className="text-slate-800">{kw.suggestedPlacement}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-mono">
                  JD Frequency: <strong className="text-slate-800">{kw.frequencyInJd}x</strong>
                </span>
                <span
                  className={`rounded-md px-1.5 py-0.5 font-mono font-bold uppercase tracking-wider border ${
                    kw.importance === 'High'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : kw.importance === 'Medium'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                  }`}
                >
                  {kw.importance} Priority
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Matching Keywords */}
      {keywordData.matchingKeywords && keywordData.matchingKeywords.length > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Recognized Matching Keywords (Found in Resume)
            </h4>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            These terms are successfully aligned and contributing positively to your compatibility score.
          </p>

          <div className="flex flex-wrap gap-2">
            {keywordData.matchingKeywords.map((m, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800 font-semibold shadow-xs"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>{m.keyword}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Bullet Point Enhancements from Resume */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 tracking-wide">
              Resume Bullet Point Transformations
            </h4>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real lines extracted from your resume upgraded with Google's XYZ formula and high-value target keywords
          </p>
        </div>

        <div className="space-y-4">
          {keywordData.bulletEnhancements.map((b, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-colors hover:border-slate-300"
            >
              <div className="space-y-3">
                {/* Original */}
                <div>
                  <div className="text-[11px] font-bold text-slate-500 mb-1">
                    Original Resume Bullet:
                  </div>
                  <div className="rounded-lg bg-white p-3 text-xs text-slate-600 italic border border-slate-200">
                    "{b.originalResumeBullet}"
                  </div>
                </div>

                {/* Improved */}
                <div>
                  <div className="text-[11px] font-bold text-emerald-700 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> ATS-Optimized High-Impact Version:
                    </span>
                    <button
                      onClick={() => handleCopy(b.improvedVersion)}
                      className="text-slate-500 hover:text-slate-900 flex items-center gap-1 text-[10px] font-semibold"
                    >
                      <Copy className="h-3 w-3" /> Copy
                    </button>
                  </div>
                  <div className="rounded-lg bg-emerald-50/80 p-3 text-xs text-emerald-950 border border-emerald-300 font-semibold leading-relaxed shadow-xs">
                    {b.improvedVersion}
                  </div>
                </div>

                {/* Keywords Injected & Reason */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-[11px]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-slate-500 font-bold">Keywords injected:</span>
                    {b.keywordsInjected.map((kw, kIdx) => (
                      <span
                        key={kIdx}
                        className="rounded-md bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 text-indigo-700 font-mono text-[10px] font-bold"
                      >
                        +{kw}
                      </span>
                    ))}
                  </div>
                  <span className="text-slate-600 text-xs font-medium">{b.explanation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Custom Bullet Point Optimizer */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-xs">
            <Wand2 className="h-4 w-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 tracking-wide">
            Live Bullet Point Rewriter
          </h4>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Paste any line or bullet point from your draft to generate 3 tailored versions: Metrics-driven, Leadership-driven, and Deep Technical.
        </p>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customBullet}
              onChange={(e) => setCustomBullet(e.target.value)}
              placeholder="e.g. Responsible for building user dashboard and connecting APIs..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            <button
              onClick={handleOptimizeCustomBullet}
              disabled={isOptimizing || !customBullet.trim()}
              className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all shrink-0 ${
                customBullet.trim() && !isOptimizing
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isOptimizing ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Rewriting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Transform Bullet</span>
                </>
              )}
            </button>
          </div>

          {bulletError && (
            <p className="text-xs text-rose-600 font-semibold">{bulletError}</p>
          )}

          {optimizedResult && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 animate-fadeIn">
              {/* Option 1: Metrics */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-amber-600" /> Metrics-Driven
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                    {optimizedResult.metricsDriven}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(optimizedResult.metricsDriven)}
                  className="mt-3 text-[11px] text-amber-700 hover:text-amber-900 flex items-center gap-1 self-end font-bold"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>

              {/* Option 2: Leadership */}
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Award className="h-3 w-3 text-indigo-600" /> Leadership & Scope
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                    {optimizedResult.leadershipDriven}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(optimizedResult.leadershipDriven)}
                  className="mt-3 text-[11px] text-indigo-700 hover:text-indigo-900 flex items-center gap-1 self-end font-bold"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>

              {/* Option 3: Technical Depth */}
              <div className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-4 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Layers className="h-3 w-3 text-cyan-600" /> Technical Rigor
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                    {optimizedResult.technicalDepth}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(optimizedResult.technicalDepth)}
                  className="mt-3 text-[11px] text-cyan-700 hover:text-cyan-900 flex items-center gap-1 self-end font-bold"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
