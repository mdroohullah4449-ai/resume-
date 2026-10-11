import React, { useState } from 'react';
import { InterviewQuestion, InterviewFeedbackResult } from '../types/analyzer';
import {
  HelpCircle,
  MessageSquare,
  ShieldAlert,
  Cpu,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Send,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface InterviewPrepSectionProps {
  questions: InterviewQuestion[];
  userExperienceSnippet?: string;
  roleTitle?: string;
}

export const InterviewPrepSection: React.FC<InterviewPrepSectionProps> = ({
  questions,
  userExperienceSnippet,
  roleTitle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    questions[0]?.id || null
  );

  // Practice Simulator State
  const [activePracticeQuestion, setActivePracticeQuestion] = useState<InterviewQuestion | null>(
    null
  );
  const [userDraftAnswer, setUserDraftAnswer] = useState<string>('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState<boolean>(false);
  const [feedbackResult, setFeedbackResult] = useState<InterviewFeedbackResult | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const categories = ['all', 'Technical Architecture', 'Behavioral & STAR', 'Gap Probe', 'Role Situational'];

  const filteredQuestions = questions.filter((q) => {
    if (selectedCategory === 'all') return true;
    return q.category === selectedCategory;
  });

  const getCategoryMeta = (category: string) => {
    switch (category) {
      case 'Technical Architecture':
        return {
          icon: <Cpu className="h-4 w-4 text-cyan-600" />,
          badge: 'text-cyan-800 bg-cyan-50 border-cyan-200',
          border: 'border-cyan-300',
        };
      case 'Behavioral & STAR':
        return {
          icon: <UserCheck className="h-4 w-4 text-emerald-600" />,
          badge: 'text-emerald-800 bg-emerald-50 border-emerald-200',
          border: 'border-emerald-300',
        };
      case 'Gap Probe':
        return {
          icon: <ShieldAlert className="h-4 w-4 text-rose-600" />,
          badge: 'text-rose-800 bg-rose-50 border-rose-200',
          border: 'border-rose-300',
        };
      default:
        return {
          icon: <MessageSquare className="h-4 w-4 text-amber-600" />,
          badge: 'text-amber-800 bg-amber-50 border-amber-200',
          border: 'border-amber-300',
        };
    }
  };

  const startPractice = (q: InterviewQuestion) => {
    setActivePracticeQuestion(q);
    setUserDraftAnswer('');
    setFeedbackResult(null);
    setFeedbackError(null);
  };

  const handleSubmitPractice = async () => {
    if (!activePracticeQuestion || !userDraftAnswer.trim()) return;
    setIsSubmittingAnswer(true);
    setFeedbackError(null);

    try {
      const res = await fetch('/api/evaluate-interview-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activePracticeQuestion.question,
          userExperience: userExperienceSnippet || '',
          answer: userDraftAnswer,
          roleTitle: roleTitle || 'Target Role',
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to evaluate answer. Please try again.');
      }

      const data = await res.json();
      setFeedbackResult(data);
    } catch (err: any) {
      setFeedbackError(err.message || 'Error evaluating answer.');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-xs">
                <HelpCircle className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-wide">
                Role-Specific Interview Simulation & Coaching
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Targeted questions derived directly from the intersection of your resume experience and this role's bar
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs text-indigo-700 font-bold shadow-xs">
              ✨ Interactive Practice Simulator
            </span>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {categories.map((c) => {
            const active = selectedCategory === c;
            return (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {c === 'all' ? 'All Question Types' : c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions Accordion List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const isExpanded = expandedQuestionId === q.id;
          const meta = getCategoryMeta(q.category);
          return (
            <div
              key={q.id}
              className={`relative overflow-hidden rounded-2xl border transition-all duration-200 ${
                isExpanded
                  ? `${meta.border} bg-white shadow-sm ring-1 ring-indigo-50`
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {/* Question Header */}
              <div
                onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                className="flex items-start justify-between gap-4 p-5 cursor-pointer"
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 rounded-xl bg-slate-50 p-2.5 border border-slate-200 shadow-xs">
                    {meta.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border ${meta.badge}`}
                      >
                        {q.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-relaxed">
                      "{q.question}"
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startPractice(q);
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-all shadow-xs"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Practice</span>
                  </button>
                  <button className="text-slate-400 hover:text-slate-700 p-1">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Guide */}
              {isExpanded && (
                <div className="border-t border-slate-100 p-5 space-y-4 bg-slate-50/60 rounded-b-2xl animate-fadeIn">
                  {/* Intent */}
                  <div className="text-xs">
                    <span className="font-bold text-indigo-700">Interviewer Hidden Intent: </span>
                    <span className="text-slate-700 font-medium">{q.interviewerIntent}</span>
                  </div>

                  {/* Key Signals */}
                  <div>
                    <div className="text-xs font-bold text-slate-800 mb-2">
                      Key Signals & Competencies to Project:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {q.keySignalsToConvey.map((signal, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-[11px] text-slate-700 shadow-xs"
                        >
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span className="font-semibold">{signal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Answering Strategy */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-xs text-slate-700">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800 mb-1.5">
                      <Lightbulb className="h-4 w-4 text-amber-600" />
                      <span>Recommended Response Structure:</span>
                    </div>
                    <p className="leading-relaxed text-slate-700">{q.suggestedStrategy}</p>

                    {q.sampleTalkingPoints && q.sampleTalkingPoints.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-amber-200/80">
                        <span className="font-bold text-amber-900">Suggested talking points:</span>
                        <ul className="mt-1 list-disc list-inside space-y-1 text-slate-700">
                          {q.sampleTalkingPoints.map((pt, pIdx) => (
                            <li key={pIdx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Practice & AI Bar Raiser Feedback Modal/Drawer */}
      {activePracticeQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
                  AI Bar Raiser Simulator · {activePracticeQuestion.category}
                </span>
                <h3 className="mt-1 text-sm font-bold text-slate-900">
                  "{activePracticeQuestion.question}"
                </h3>
              </div>
              <button
                onClick={() => setActivePracticeQuestion(null)}
                className="text-slate-400 hover:text-slate-700 text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Draft your verbal response (use Situation, Task, Action, Result framework):
                </label>
                <textarea
                  value={userDraftAnswer}
                  onChange={(e) => setUserDraftAnswer(e.target.value)}
                  placeholder="e.g. When I was leading the checkout migration at my previous company, our team faced a severe latency spike..."
                  rows={6}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 leading-relaxed"
                />
              </div>

              {feedbackError && (
                <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium">
                  {feedbackError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setActivePracticeQuestion(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPractice}
                  disabled={isSubmittingAnswer || !userDraftAnswer.trim()}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition-all ${
                    userDraftAnswer.trim() && !isSubmittingAnswer
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmittingAnswer ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Bar Raiser is Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Submit to AI Bar Raiser</span>
                    </>
                  )}
                </button>
              </div>

              {/* Feedback Display */}
              {feedbackResult && (
                <div className="mt-6 pt-5 border-t border-slate-100 space-y-4 animate-fadeIn">
                  {/* Score & Verdict */}
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-200 shadow-xs">
                    <div>
                      <div className="text-xs font-bold text-slate-500">Response Score</div>
                      <div className="text-2xl font-black font-mono text-indigo-600">
                        {feedbackResult.score} / 10
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 max-w-md text-right font-medium">
                      {feedbackResult.verdict}
                    </p>
                  </div>

                  {/* Strengths & Growth Areas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5">
                      <div className="font-bold text-emerald-800 mb-1 flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Strong Points:
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-slate-700">
                        {feedbackResult.strengths.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
                      <div className="font-bold text-amber-800 mb-1 flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Room for Growth:
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-slate-700">
                        {feedbackResult.growthAreas.map((g, idx) => (
                          <li key={idx}>{g}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* STAR Breakdown */}
                  {feedbackResult.starBreakdown && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs space-y-2">
                      <div className="font-bold text-slate-900 mb-2">STAR Structure Breakdown:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                        <div className="rounded-lg bg-cyan-50 border border-cyan-200 p-2.5">
                          <strong className="text-cyan-800 block mb-0.5">S (Situation):</strong>
                          <span className="text-slate-700">{feedbackResult.starBreakdown.situation}</span>
                        </div>
                        <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-2.5">
                          <strong className="text-indigo-800 block mb-0.5">T (Task):</strong>
                          <span className="text-slate-700">{feedbackResult.starBreakdown.task}</span>
                        </div>
                        <div className="rounded-lg bg-purple-50 border border-purple-200 p-2.5">
                          <strong className="text-purple-800 block mb-0.5">A (Action):</strong>
                          <span className="text-slate-700">{feedbackResult.starBreakdown.action}</span>
                        </div>
                        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5">
                          <strong className="text-emerald-800 block mb-0.5">R (Result):</strong>
                          <span className="text-slate-700">{feedbackResult.starBreakdown.result}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Revised Model Answer */}
                  {feedbackResult.revisedModelAnswer && (
                    <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 text-xs shadow-xs">
                      <div className="font-bold text-indigo-900 mb-1.5 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Elevated Model Answer (Tailored to your real background):</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed italic">
                        "{feedbackResult.revisedModelAnswer}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
