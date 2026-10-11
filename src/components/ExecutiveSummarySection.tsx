import React from 'react';
import { CompatibilityAnalysisResult } from '../types/analyzer';
import { CheckCircle2, AlertOctagon, Lightbulb, Zap, Building2, ArrowRight, Award } from 'lucide-react';

interface ExecutiveSummarySectionProps {
  result: CompatibilityAnalysisResult;
  onViewJobs?: () => void;
}

export const ExecutiveSummarySection: React.FC<ExecutiveSummarySectionProps> = ({
  result,
  onViewJobs,
}) => {
  const { executiveSummary, keyStrengths, vulnerabilitiesAndGaps, quickWinsChecklist, keywordOptimization } = result;

  const matchingCount = keywordOptimization?.matchingKeywords?.length || 0;

  return (
    <div className="space-y-8">
      {/* Executive Summary Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600" />
        
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-xs">
            <Lightbulb className="h-4 w-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 tracking-wide">
            Executive Candidacy Appraisal
          </h3>
        </div>
        <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line font-normal">
          {executiveSummary}
        </div>
      </div>

      {/* Recruiter Skill Match & Open Jobs Callout Card */}
      {onViewJobs && (
        <div className="relative overflow-hidden rounded-3xl border border-indigo-200/90 bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-white p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 text-indigo-800 px-3 py-0.5 text-xs font-bold border border-indigo-200">
              <Award className="h-3.5 w-3.5 text-indigo-600" />
              <span>Recruiting Intelligence</span>
            </div>
            <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-['Space_Grotesk']">
              Companies Currently Recruiting for Your {matchingCount} Matched Skills
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              We cross-referenced your verified competencies against live industry vacancies at Google, Stripe, Microsoft, Meta, Datadog and more with transparent salaries and stipends.
            </p>
          </div>

          <button
            type="button"
            onClick={onViewJobs}
            className="shrink-0 flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 text-xs font-bold transition-all shadow-md shadow-indigo-500/20 active:scale-[0.99]"
          >
            <Building2 className="h-4 w-4" />
            <span>View Available Jobs & Salaries</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Two Column Grid: Strengths vs Vulnerabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Strengths */}
        <div className="rounded-2xl border border-emerald-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-xs">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Competitive Advantages</h4>
            </div>
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs text-emerald-700 font-mono font-bold tabular-nums">
              {keyStrengths.length} Validated Strengths
            </span>
          </div>

          <div className="space-y-4">
            {keyStrengths.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50/80 hover:shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <h5 className="text-xs font-bold text-emerald-900">
                    {item.title}
                  </h5>
                </div>
                <p className="mt-1.5 text-xs text-slate-700 leading-relaxed font-normal">
                  {item.description}
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
                  <span className="font-mono text-emerald-600">Alignment:</span>
                  <span>{item.jdAlignment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vulnerabilities & Missing Requisites */}
        <div className="rounded-2xl border border-amber-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200 shadow-xs">
                <AlertOctagon className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Gaps & Risk Areas</h4>
            </div>
            <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs text-amber-700 font-mono font-bold tabular-nums">
              {vulnerabilitiesAndGaps.length} Actionable Gaps
            </span>
          </div>

          <div className="space-y-4">
            {vulnerabilitiesAndGaps.map((item, idx) => {
              const severityStyles = {
                High: 'border-rose-200 bg-rose-50/40 text-rose-800',
                Medium: 'border-amber-200 bg-amber-50/40 text-amber-800',
                Low: 'border-sky-200 bg-sky-50/40 text-sky-800',
              }[item.severity];

              return (
                <div
                  key={idx}
                  className="group relative rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition-all duration-200 hover:border-amber-300 hover:bg-white hover:shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-slate-900">
                      {item.title}
                    </h5>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${severityStyles}`}
                    >
                      {item.severity}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                  <div className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-amber-50/80 p-2.5 text-[11px] text-amber-900 border border-amber-100 font-medium">
                    <span className="font-bold text-amber-700 shrink-0">Remedy:</span>
                    <span>{item.howToMitigate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 24-Hour Quick Optimization Checklist */}
      {quickWinsChecklist && quickWinsChecklist.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200 shadow-xs">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 tracking-wide">
                24-Hour Quick Optimization Checklist
              </h4>
              <p className="text-xs text-slate-500">
                High-leverage tweaks you can execute immediately before submitting your application
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickWinsChecklist.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-xs text-slate-700 transition-colors hover:border-indigo-300 hover:bg-white"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-mono text-[10px] font-bold shadow-xs">
                  {idx + 1}
                </div>
                <span className="leading-relaxed font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
