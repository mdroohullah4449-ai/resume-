import React from 'react';
import { CompatibilityAnalysisResult } from '../types/analyzer';
import { Sparkles } from 'lucide-react';

interface ScoreOverviewCardProps {
  result: CompatibilityAnalysisResult;
}

export const ScoreOverviewCard: React.FC<ScoreOverviewCardProps> = ({ result }) => {
  const { overallScore, matchTier, headlineVerdict, scoreBreakdown } = result;

  const getTierIndicator = (tier: string) => {
    switch (tier) {
      case 'Strong Match':
        return {
          text: 'Strong Match',
          color: 'text-emerald-700',
          badge: 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs',
          dot: 'bg-emerald-500',
        };
      case 'Competitive Contender':
        return {
          text: 'Competitive Contender',
          color: 'text-indigo-700',
          badge: 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs',
          dot: 'bg-indigo-500',
        };
      case 'Upskill Needed':
        return {
          text: 'Upskill Needed',
          color: 'text-amber-700',
          badge: 'bg-amber-50 border-amber-200 text-amber-700 shadow-xs',
          dot: 'bg-amber-500',
        };
      default:
        return {
          text: 'Significant Gap',
          color: 'text-rose-700',
          badge: 'bg-rose-50 border-rose-200 text-rose-700 shadow-xs',
          dot: 'bg-rose-500',
        };
    }
  };

  const tier = getTierIndicator(matchTier);

  const breakdownMetrics = [
    {
      label: 'Hard Skills & Tech Stack',
      value: scoreBreakdown.hardSkillsMatch,
      gradient: 'from-cyan-500 via-sky-500 to-blue-600',
      textColor: 'text-sky-600',
      description: 'Overlap between JD technical requirements and resume proficiencies',
    },
    {
      label: 'Experience Relevance',
      value: scoreBreakdown.experienceRelevance,
      gradient: 'from-violet-500 via-purple-500 to-indigo-600',
      textColor: 'text-indigo-600',
      description: 'Alignment of past domain responsibilities and day-to-day scope',
    },
    {
      label: 'ATS Readability & Keywords',
      value: scoreBreakdown.atsReadabilityAndKeywords,
      gradient: 'from-emerald-500 via-teal-500 to-green-600',
      textColor: 'text-emerald-600',
      description: 'Keyword density, parseability, and terminology parity for scanner algorithms',
    },
    {
      label: 'Impact & Quantification',
      value: scoreBreakdown.impactAndQuantification,
      gradient: 'from-amber-500 via-orange-500 to-amber-600',
      textColor: 'text-amber-600',
      description: 'Presence of measurable business metrics, percentages, and scale indicators',
    },
    {
      label: 'Seniority & Scope Match',
      value: scoreBreakdown.seniorityAndScopeMatch,
      gradient: 'from-fuchsia-500 via-pink-500 to-rose-600',
      textColor: 'text-fuchsia-600',
      description: 'Readiness for the required ownership level and architectural gravity',
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Big Circular Gauge / Score Display */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-slate-200/80 bg-slate-50/80 shadow-xs">
          <div className="relative flex items-center justify-center mb-3">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="scoreGaugeGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
              </defs>
              {/* Background track */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#e2e8f0"
                strokeWidth="7"
              />
              {/* Foreground progress with vibrant gradient */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="url(#scoreGaugeGradLight)"
                strokeWidth="7"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallScore / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black tracking-tight text-slate-900 font-mono tabular-nums">
                {overallScore}%
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mt-0.5">
                Match Score
              </span>
            </div>
          </div>

          {/* Tier badge with clean light styling */}
          <div
            className={`mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold border ${tier.badge}`}
          >
            <span className={`h-2 w-2 rounded-full ${tier.dot}`} />
            <span>{tier.text}</span>
          </div>

          <p className="mt-3 text-xs text-slate-600 leading-relaxed max-w-xs font-medium">
            "{headlineVerdict}"
          </p>
        </div>

        {/* Right Column: 5-Factor Weighted Score Breakdown */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 tracking-wide">
                  5-Factor Compatibility Breakdown
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Evaluation across screening algorithms, technical qualifications, and hiring standards
              </p>
            </div>
            <div className="hidden sm:block text-xs text-indigo-600 font-mono font-bold">
              Scale: 0–100
            </div>
          </div>

          <div className="space-y-3.5">
            {breakdownMetrics.map((metric) => (
              <div key={metric.label} className="group">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-800">
                    {metric.label}
                  </span>
                  <span className={`font-mono font-black tabular-nums ${metric.textColor}`}>
                    {metric.value}%
                  </span>
                </div>

                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${metric.gradient} transition-all duration-700 ease-out`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>

                <p className="mt-1 text-[11px] text-slate-500">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
