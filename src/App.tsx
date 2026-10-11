import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { InputSection } from './components/InputSection';
import { ScoreOverviewCard } from './components/ScoreOverviewCard';
import { ExecutiveSummarySection } from './components/ExecutiveSummarySection';
import { SkillsToLearnSection } from './components/SkillsToLearnSection';
import { KeywordOptimizationSection } from './components/KeywordOptimizationSection';
import { InterviewPrepSection } from './components/InterviewPrepSection';
import { MarketVacanciesSection } from './components/MarketVacanciesSection';
import { ReportExportModal } from './components/ReportExportModal';
import { SAMPLE_PRESETS, Preset } from './data/samplePresets';
import { CompatibilityAnalysisResult } from './types/analyzer';
import {
  FileText,
  Compass,
  FileCode,
  HelpCircle,
  Download,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Building2,
  Globe2,
} from 'lucide-react';

export default function App() {
  // Global view state
  const [currentView, setCurrentView] = useState<'analyzer' | 'vacancies'>('analyzer');

  // Input states
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [roleTitle, setRoleTitle] = useState<string>('');
  const [targetSeniority, setTargetSeniority] = useState<string>('Auto-detect from JD');
  const [focusAreas, setFocusAreas] = useState<string[]>([
    'ats-keywords',
    'technical-depth',
    'quantified-impact',
  ]);

  // Analysis result & loading states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CompatibilityAnalysisResult | null>(null);

  // Tab navigation in report view
  const [activeTab, setActiveTab] = useState<
    'overview' | 'skills' | 'keywords' | 'interview' | 'jobs'
  >('overview');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Dynamically extract skills from either analysisResult or inputs for recruiting matches
  const candidateSkills = useMemo(() => {
    if (analysisResult) {
      const matching = analysisResult.keywordOptimization.matchingKeywords.map((k) => k.keyword);
      const toLearn = analysisResult.skillsToLearn.map((s) => s.skill);
      const missing = analysisResult.keywordOptimization.missingKeywords.map((k) => k.keyword);
      return Array.from(new Set([...matching, ...toLearn, ...missing])).slice(0, 8);
    }

    const detected = [
      'React',
      'TypeScript',
      'Next.js',
      'Node.js',
      'Python',
      'AWS',
      'GraphQL',
      'Docker',
      'System Design',
      'PostgreSQL',
    ].filter((k) => (resumeText + ' ' + jobDescription).toLowerCase().includes(k.toLowerCase()));

    return detected.length > 0 ? detected : ['React', 'TypeScript', 'Next.js', 'System Design'];
  }, [analysisResult, resumeText, jobDescription]);

  // Preset loader
  const handleSelectPreset = (preset: Preset) => {
    setResumeText(preset.resumeText);
    setJobDescription(preset.jobDescription);
    setRoleTitle(preset.roleTitle);
    setAnalysisError(null);
    setCurrentView('analyzer');
  };

  // Reset all
  const handleReset = () => {
    setResumeText('');
    setJobDescription('');
    setRoleTitle('');
    setAnalysisResult(null);
    setAnalysisError(null);
    setCurrentView('analyzer');
  };

  // Analysis API Call
  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setAnalysisError('Please provide both your resume and the target job description.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          roleTitle,
          targetSeniority,
          focusAreas,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to complete analysis.');
      }

      const data: CompatibilityAnalysisResult = await response.json();
      setAnalysisResult(data);
      setActiveTab('overview');
      setCurrentView('analyzer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans'] antialiased overflow-x-hidden">
      {/* Background Subtle Grid Texture */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Clean Ambient Top Highlight for Contrast */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/40 to-transparent pointer-events-none" />

      {/* Navbar */}
      <Navbar
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        hasResults={!!analysisResult}
        onNewAnalysis={() => {
          setAnalysisResult(null);
          setCurrentView('analyzer');
        }}
        currentView={currentView}
        onToggleView={(v) => setCurrentView(v)}
      />

      {/* Main Content Container */}
      <main className="relative z-10 flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {analysisError && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-900">Notice: </span>
                <span className="text-rose-800">{analysisError}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-xs"
              >
                Retry Analysis
              </button>
              <button
                onClick={() => setAnalysisError(null)}
                className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 font-semibold"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* STANDALONE VIEW: COMPANY VACANCIES RADAR */}
        {currentView === 'vacancies' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentView('analyzer')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Compatibility Analyzer</span>
              </button>
            </div>

            <MarketVacanciesSection
              resumeText={resumeText}
              onResumeChange={setResumeText}
              jobDescription={jobDescription}
              candidateSkills={candidateSkills}
              roleTitle={roleTitle}
              targetSeniority={targetSeniority}
            />
          </div>
        )}

        {/* ANALYZER VIEW: INPUTS & BENCHMARKS (WHEN NO REPORT YET) */}
        {currentView === 'analyzer' && !analysisResult && (
          <div className="space-y-6">
            {/* Hero / Value Statement */}
            <div className="text-center max-w-3xl mx-auto py-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-2xs mb-4">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Next-Generation Career Compatibility Intelligence</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-['Space_Grotesk'] text-balance text-slate-950">
                Precision Resume & Job{' '}
                <span className="text-blue-600">
                  Compatibility Analyzer
                </span>
              </h1>
              <p className="mt-3.5 text-sm text-slate-600 leading-relaxed text-balance font-medium max-w-2xl mx-auto">
                Evaluate your authentic experience against target roles. Upload PDF/images or paste plain text. Get optimization scores, extract missing ATS keywords, simulate interview questions, and discover recruiting companies hiring for your skills worldwide.
              </p>
            </div>

            <InputSection
              resumeText={resumeText}
              setResumeText={setResumeText}
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              roleTitle={roleTitle}
              setRoleTitle={setRoleTitle}
              targetSeniority={targetSeniority}
              setTargetSeniority={setTargetSeniority}
              focusAreas={focusAreas}
              setFocusAreas={setFocusAreas}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              onSelectPreset={handleSelectPreset}
            />

            {/* Quick Explore Banner for Live Company Vacancies */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                  <Globe2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-950">
                    Explore Companies Recruiting for Your Skills Worldwide
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Browse top tech employers, current job vacancies, and compensation benchmarks across target countries (US, UK, India, Canada, Germany, Singapore, Australia, etc.) and their major tech cities.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentView('vacancies')}
                className="shrink-0 flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-xs active:scale-95"
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>Open Vacancies Radar</span>
              </button>
            </div>
          </div>
        )}

        {/* ANALYZER VIEW: REPORT DASHBOARD (WHEN ANALYSIS RESULT IS READY) */}
        {currentView === 'analyzer' && analysisResult && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Return and Export Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <button
                onClick={() => setAnalysisResult(null)}
                className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 text-blue-600" />
                <span>Modify Inputs & Presets</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-medium">
                  Target Role: <strong className="text-slate-950 font-bold">{roleTitle || 'Job Opportunity'}</strong>
                </span>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => setIsExportOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-all shadow-xs"
                >
                  <Download className="h-3.5 w-3.5 text-blue-600" />
                  <span>Export Report (.md / PDF)</span>
                </button>
              </div>
            </div>

            {/* Score Overview Card */}
            <ScoreOverviewCard result={analysisResult} />

            {/* Tabbed Navigation Bar */}
            <div className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs">
              <nav className="flex space-x-2 overflow-x-auto text-xs font-bold">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === 'overview'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Executive Diagnosis</span>
                </button>

                <button
                  onClick={() => setActiveTab('skills')}
                  className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === 'skills'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Compass className="h-4 w-4" />
                  <span>Skills to Learn</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                      activeTab === 'skills'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-blue-700'
                    }`}
                  >
                    {analysisResult.skillsToLearn.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('keywords')}
                  className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === 'keywords'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <FileCode className="h-4 w-4" />
                  <span>ATS Keywords & Bullet Rewrites</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                      activeTab === 'keywords'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-rose-700'
                    }`}
                  >
                    {analysisResult.keywordOptimization.missingKeywords.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('interview')}
                  className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === 'interview'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Role Interview Simulation</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                      activeTab === 'interview'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-amber-700'
                    }`}
                  >
                    {analysisResult.interviewQuestions.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`flex items-center gap-2 py-2.5 px-4 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === 'jobs'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  <span>Target Companies & Vacancies</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                      activeTab === 'jobs'
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    Live Radar
                  </span>
                </button>
              </nav>
            </div>

            {/* Tab Contents */}
            <div>
              {activeTab === 'overview' && (
                <ExecutiveSummarySection result={analysisResult} />
              )}

              {activeTab === 'skills' && (
                <SkillsToLearnSection skills={analysisResult.skillsToLearn} />
              )}

              {activeTab === 'keywords' && (
                <KeywordOptimizationSection
                  keywordData={analysisResult.keywordOptimization}
                  roleTitle={roleTitle}
                />
              )}

              {activeTab === 'interview' && (
                <InterviewPrepSection
                  questions={analysisResult.interviewQuestions}
                  userExperienceSnippet={resumeText}
                  roleTitle={roleTitle}
                />
              )}

              {activeTab === 'jobs' && (
                <MarketVacanciesSection
                  resumeText={resumeText}
                  onResumeChange={setResumeText}
                  jobDescription={jobDescription}
                  candidateSkills={candidateSkills}
                  roleTitle={roleTitle}
                  targetSeniority={targetSeniority}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Export Report Modal */}
      {isExportOpen && analysisResult && (
        <ReportExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          result={analysisResult}
          roleTitle={roleTitle}
        />
      )}
    </div>
  );
}
