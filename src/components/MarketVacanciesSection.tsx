import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  MapPin,
  Briefcase,
  ExternalLink,
  Search,
  Sparkles,
  TrendingUp,
  Globe2,
  DollarSign,
  CheckCircle2,
  Flame,
  ArrowUpRight,
  RefreshCw,
  SlidersHorizontal,
  GraduationCap,
  Layers,
  Award,
  Clock,
  ShieldCheck,
  Building,
  Check,
  FileText,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
} from 'lucide-react';
import type {
  MarketVacanciesResponse,
  RecruitingCompany,
  JobVacancy,
  RecommendedJobRole,
} from '../types/marketJobs';
import { SUPPORTED_COUNTRIES } from '../data/marketCompaniesData';

interface MarketVacanciesSectionProps {
  resumeText?: string;
  onResumeChange?: (text: string) => void;
  jobDescription?: string;
  candidateSkills: string[];
  roleTitle?: string;
  targetSeniority?: string;
}

const SAMPLE_SENIOR_RESUME = `Alex Rivera | alex.rivera@email.com | San Francisco, CA
Senior Full-Stack Engineer with 5+ years of experience building high-scale web platforms and cloud microservices.

EXPERIENCE:
Senior Software Engineer - CloudScale Technologies (2022 - Present)
- Architected next-generation React & TypeScript frontend application serving 450,000+ monthly active enterprise users.
- Designed distributed Node.js and Go microservices handling 25,000 requests/sec with Redis caching and PostgreSQL.
- Optimized frontend rendering and bundle splitting, reducing Core Web Vitals Largest Contentful Paint (LCP) by 42%.
- Deployed containerized applications with Docker and Kubernetes on AWS (EKS, CloudFront, RDS).

Software Engineer - Apex Digital (2020 - 2022)
- Built interactive merchant checkout dashboards using React, Next.js, and GraphQL.
- Automated CI/CD deployment pipelines using GitHub Actions, cutting release cycles by 50%.

SKILLS:
React, TypeScript, Next.js, Node.js, Go, Python, GraphQL, PostgreSQL, Redis, AWS, Docker, Kubernetes, CI/CD, System Design, Web Performance`;

const SAMPLE_INTERN_RESUME = `Jordan Chen | jordan.chen@university.edu | New York, NY
Computer Science Junior (Expected Graduation: 2026) seeking a Software Engineering Internship.

EDUCATION:
B.S. in Computer Science, GPA: 3.8/4.0

PROJECTS & EXPERIENCE:
Campus Event Hub (React, TypeScript, Node.js, PostgreSQL)
- Developed responsive web application for 12,000 students to discover and register for campus activities.
- Built RESTful API endpoints and integrated user authentication with JWT.

Algorithmic Trading Simulator (Python, Pandas, FastAPI)
- Built backtesting engine analyzing real-time financial market trends and historical pricing data.

SKILLS:
React, TypeScript, JavaScript, Python, Node.js, SQL, Git, Data Structures, Algorithms, HTML/CSS`;

export const MarketVacanciesSection: React.FC<MarketVacanciesSectionProps> = ({
  resumeText = '',
  onResumeChange,
  jobDescription = '',
  candidateSkills,
  roleTitle,
  targetSeniority,
}) => {
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [selectedCity, setSelectedCity] = useState('San Francisco, CA');
  const [selectedWorkModel, setSelectedWorkModel] = useState<string>('All');
  const [selectedRoleType, setSelectedRoleType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [marketData, setMarketData] = useState<MarketVacanciesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResumeEditorOpen, setIsResumeEditorOpen] = useState(false);
  const [localResumeInput, setLocalResumeInput] = useState(resumeText);
  const [activeRoleFilter, setActiveRoleFilter] = useState<string | null>(null);

  const countryConfig = useMemo(() => {
    return (
      SUPPORTED_COUNTRIES.find((c) => c.country === selectedCountry) || SUPPORTED_COUNTRIES[0]
    );
  }, [selectedCountry]);

  const fetchVacancies = async (country: string, city: string, workModel: string, currentResume: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/market-vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: currentResume,
          jobDescription,
          skills: candidateSkills,
          roleTitle: roleTitle || 'Senior Software Engineer',
          country,
          city,
          workModel,
          seniority: targetSeniority,
        }),
      });

      if (!res.ok) throw new Error('Failed to load market data.');
      const data: MarketVacanciesResponse = await res.json();
      setMarketData(data);
    } catch (err) {
      console.error('Error fetching market vacancies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setLocalResumeInput(resumeText);
  }, [resumeText]);

  useEffect(() => {
    fetchVacancies(selectedCountry, selectedCity, selectedWorkModel, resumeText);
  }, [selectedCountry, selectedCity, selectedWorkModel, resumeText, candidateSkills, roleTitle]);

  const handleCountryChange = (newCountry: string) => {
    setSelectedCountry(newCountry);
    const newConfig = SUPPORTED_COUNTRIES.find((c) => c.country === newCountry) || SUPPORTED_COUNTRIES[0];
    setSelectedCity(newConfig.popularCities[0]);
  };

  const handleApplyResumeUpdate = () => {
    if (onResumeChange) {
      onResumeChange(localResumeInput);
    }
    fetchVacancies(selectedCountry, selectedCity, selectedWorkModel, localResumeInput);
    setIsResumeEditorOpen(false);
  };

  const handleLoadSample = (sample: string) => {
    setLocalResumeInput(sample);
    if (onResumeChange) {
      onResumeChange(sample);
    }
    fetchVacancies(selectedCountry, selectedCity, selectedWorkModel, sample);
    setIsResumeEditorOpen(false);
  };

  // Filter companies and their vacancies based on active filters, text search, and role recommendation filter
  const filteredCompanies = useMemo(() => {
    if (!marketData?.companies) return [];

    return marketData.companies
      .map((comp) => {
        const matchingVacancies = comp.openVacancies.filter((v) => {
          // Role recommendation quick filter
          if (activeRoleFilter) {
            const normalizedFilter = activeRoleFilter.toLowerCase();
            const matchesRole =
              v.title.toLowerCase().includes(normalizedFilter) ||
              v.department.toLowerCase().includes(normalizedFilter) ||
              (normalizedFilter.includes('intern') && (v.roleType === 'Internship' || v.roleType === 'Early Career')) ||
              (normalizedFilter.includes('frontend') && v.title.toLowerCase().includes('frontend')) ||
              (normalizedFilter.includes('staff') && v.seniority.toLowerCase().includes('staff')) ||
              (normalizedFilter.includes('full-stack') && v.title.toLowerCase().includes('stack'));
            if (!matchesRole) return false;
          }

          // Role Type filter
          if (selectedRoleType === 'Full-Time' && v.roleType !== 'Full-Time') return false;
          if (
            selectedRoleType === 'Internship' &&
            v.roleType !== 'Internship' &&
            v.roleType !== 'Early Career'
          )
            return false;

          // Work Model filter
          if (selectedWorkModel !== 'All' && v.workModel !== selectedWorkModel) return false;

          // Text Search query
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchesTitle = v.title.toLowerCase().includes(q);
            const matchesDept = v.department.toLowerCase().includes(q);
            const matchesCompName = comp.name.toLowerCase().includes(q);
            const matchesSkills = [...v.skillsMatched, ...v.additionalSkills].some((s) =>
              s.toLowerCase().includes(q)
            );
            return matchesTitle || matchesDept || matchesCompName || matchesSkills;
          }

          return true;
        });

        return {
          ...comp,
          openVacancies: matchingVacancies,
        };
      })
      .filter((comp) => comp.openVacancies.length > 0);
  }, [marketData, selectedRoleType, selectedWorkModel, searchQuery, activeRoleFilter]);

  const totalVisibleVacancies = useMemo(() => {
    return filteredCompanies.reduce((acc, c) => acc + c.openVacancies.length, 0);
  }, [filteredCompanies]);

  const hasResume = Boolean(resumeText && resumeText.trim().length > 30);
  const profile = marketData?.candidateProfile;
  const recommendedRoles = marketData?.recommendedRoles || [];

  return (
    <div className="space-y-6">
      {/* Top Value Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Resume-Grounded Job Role & Company Vacancy Radar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 font-['Space_Grotesk']">
              Personalized Vacancies & Recommended Job Roles
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              We analyze your provided resume to recommend career tracks, role levels, and match you with real recruiting companies actively hiring for your skills with verified salary brackets and internship stipends.
            </p>
          </div>

          {/* Clean Metric Cards */}
          {marketData && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Full-Time Median
                </span>
                <span className="text-sm sm:text-base font-black text-slate-950 mt-1 block">
                  {marketData.medianSalaryEstimate.split('+')[0].trim()}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Based on your seniority</span>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-center">
                <span className="block text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  Internship Stipend
                </span>
                <span className="text-sm sm:text-base font-black text-emerald-950 mt-1 block">
                  {marketData.internshipStipendEstimate.split('(')[0].trim()}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">Paid student track</span>
              </div>

              <div className="col-span-2 sm:col-span-1 rounded-2xl border border-blue-200 bg-blue-50 p-3.5 text-center">
                <span className="block text-[10px] uppercase font-bold text-blue-800 tracking-wider">
                  Matched Vacancies
                </span>
                <span className="text-sm sm:text-base font-black text-blue-950 mt-1 flex items-center justify-center gap-1">
                  <Flame className="h-4 w-4 text-blue-600" />
                  {totalVisibleVacancies} Openings
                </span>
                <span className="text-[10px] text-blue-700 font-medium">Across {filteredCompanies.length} companies</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Resume Profile & Alignment Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-950">
                  Candidate Profile Driving Recommendations
                </span>
                <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                  {hasResume ? 'Active Resume Grounded' : 'General Skill Profile'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {profile?.summary || 'Tailoring vacancies and salary bands to your background.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsResumeEditorOpen(!isResumeEditorOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors shadow-2xs"
            >
              <FileText className="h-3.5 w-3.5 text-blue-600" />
              <span>{isResumeEditorOpen ? 'Hide Resume Text' : hasResume ? 'Inspect / Change Resume' : 'Paste Your Resume'}</span>
              {isResumeEditorOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>
        </div>

        {/* Profile Pill Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 shadow-2xs">
            <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Detected Seniority & Tenure
            </span>
            <span className="font-black text-slate-900 text-sm block">
              {profile?.detectedSeniority || 'Mid-Senior Software Engineer'}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Experience bracket: {profile?.yearsOfExperienceEstimate || '3-5 years'}
            </span>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 shadow-2xs">
            <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Specialization Domains
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {profile?.topDomains.map((domain) => (
                <span
                  key={domain}
                  className="rounded-lg bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700"
                >
                  {domain}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 shadow-2xs">
            <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Core Skills Matched in Vacancies
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {profile?.coreSkills.map((s) => (
                <span
                  key={s}
                  className="rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Collapsible Resume Editor / Loader Drawer */}
        {isResumeEditorOpen && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-blue-600" />
                <span>Resume Input (Paste Plain Text or Choose Sample)</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadSample(SAMPLE_SENIOR_RESUME)}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Load Sample Senior Resume
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample(SAMPLE_INTERN_RESUME)}
                  className="rounded-lg bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 text-[11px] font-bold hover:bg-blue-100 transition-colors"
                >
                  Load Sample Student / Intern Resume
                </button>
              </div>
            </div>

            <textarea
              rows={6}
              value={localResumeInput}
              onChange={(e) => setLocalResumeInput(e.target.value)}
              placeholder="Paste your plain resume text here to tailor recommended job roles, company vacancies, and compensation benchmarks..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs font-mono text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsResumeEditorOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyResumeUpdate}
                className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs"
              >
                Update Vacancies & Recommendations
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RECOMMENDED JOB ROLES CAROUSEL / GRID */}
      {recommendedRoles.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span>Job Roles Recommended for Your Resume</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Click any role to filter company vacancies below directly for that role track.
              </p>
            </div>

            {activeRoleFilter && (
              <button
                type="button"
                onClick={() => setActiveRoleFilter(null)}
                className="self-start sm:self-center text-xs font-bold text-blue-600 hover:text-blue-800 underline"
              >
                Clear Role Filter ({activeRoleFilter})
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {recommendedRoles.map((role) => {
              const isActive = activeRoleFilter === role.roleTitle;
              const categoryBadge = {
                'Best Current Fit': 'bg-emerald-50 text-emerald-800 border-emerald-200',
                'Career Progression': 'bg-blue-50 text-blue-800 border-blue-200',
                'High-Demand Specialization': 'bg-amber-50 text-amber-800 border-amber-200',
                'Internship / Early Career': 'bg-sky-50 text-sky-800 border-sky-200',
              }[role.category] || 'bg-slate-100 text-slate-800 border-slate-200';

              return (
                <div
                  key={role.id}
                  onClick={() => setActiveRoleFilter(isActive ? null : role.roleTitle)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all flex flex-col justify-between ${
                    isActive
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-2 ring-blue-100'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold border ${categoryBadge}`}>
                        {role.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {role.demandLevel} Demand
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-950 leading-snug">
                      {role.roleTitle}
                    </h4>

                    <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                      {role.rationale}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-bold uppercase text-[9px]">Market Rate</span>
                      <span className="font-black text-emerald-800">{role.estimatedCompensation}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {role.matchedResumeSkills.map((s) => (
                        <span key={s} className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Control Filters Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <SlidersHorizontal className="h-4 w-4 text-blue-600" />
            <span>Select Target Geography, Role Type & Preferences</span>
          </div>
          <button
            type="button"
            onClick={() => fetchVacancies(selectedCountry, selectedCity, selectedWorkModel, resumeText)}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Live Market</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Country Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-slate-400" />
              <span>Target Country</span>
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {SUPPORTED_COUNTRIES.map((c) => (
                <option key={c.country} value={c.country}>
                  {c.country} ({c.currency})
                </option>
              ))}
            </select>
          </div>

          {/* City Hub Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>Tech Metro Hub</span>
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {countryConfig.popularCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Role Type Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
              <span>Role & Compensation Track</span>
            </label>
            <select
              value={selectedRoleType}
              onChange={(e) => setSelectedRoleType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Tracks (Salaried + Stipends)</option>
              <option value="Full-Time">Full-Time (Annual Salary + Equity)</option>
              <option value="Internship">Internship (Monthly/Hourly Stipend)</option>
            </select>
          </div>

          {/* Work Model Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-slate-400" />
              <span>Work Model</span>
            </label>
            <select
              value={selectedWorkModel}
              onChange={(e) => setSelectedWorkModel(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Models (Remote, Hybrid, Onsite)</option>
              <option value="Remote">Remote Only</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>
        </div>

        {/* Popular City Quick-Select Chips */}
        <div className="pt-1 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 mr-1">Popular Hubs:</span>
          {countryConfig.popularCities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setSelectedCity(city)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                selectedCity === city
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* In-Results Search Bar */}
        <div className="relative pt-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company name, job role (e.g. Frontend, Backend, Intern), or skill (e.g. React, Go, Python)..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-9 pr-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Companies and Authentic Vacancy Listings */}
      <div className="space-y-6">
        {filteredCompanies.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No matching vacancies found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Try clearing role filters or switching to "All Tracks" to expand available companies.
            </p>
          </div>
        ) : (
          filteredCompanies.map((company) => {
            const momentumBadge = {
              'Surge Hiring': 'bg-amber-50 text-amber-800 border-amber-200',
              'Actively Recruiting': 'bg-emerald-50 text-emerald-800 border-emerald-200',
              'Fast-Track': 'bg-blue-50 text-blue-800 border-blue-200',
              'Steady Growth': 'bg-sky-50 text-sky-800 border-sky-200',
            }[company.hiringMomentum];

            return (
              <div
                key={company.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all"
              >
                {/* Company Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white font-black text-lg shadow-2xs">
                      {company.logoInitial}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black text-slate-950 tracking-tight">
                          {company.name}
                        </h3>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200">
                          {company.tier}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${momentumBadge}`}
                        >
                          {company.hiringMomentum}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="font-semibold text-slate-700">{company.industry}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {company.hiringCity}, {company.hiringCountry}
                        </span>
                        <span>·</span>
                        <span>{company.estimatedEmployees} Employees</span>
                      </div>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <a
                      href={company.directSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors shadow-2xs"
                    >
                      <Search className="h-3.5 w-3.5" />
                      <span>Google Jobs</span>
                    </a>
                    <a
                      href={company.careersPageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors shadow-2xs"
                    >
                      <span>Careers Portal</span>
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </a>
                  </div>
                </div>

                {/* Company Why Match & Benefits Strip */}
                <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl bg-blue-50/50 p-3.5 border border-blue-100">
                    <span className="block text-[11px] font-bold text-blue-950 mb-1">
                      Why Your Profile Matches {company.name}:
                    </span>
                    <p className="text-[11px] text-blue-900 leading-relaxed font-normal">
                      {company.whyMatch}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                    <span className="block text-[11px] font-bold text-slate-700 mb-1">
                      Highlights & Compensation Perks:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600 font-medium">
                      {company.benefitsHighlight.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-1.5 truncate">
                          <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Available Roles & Compensation Cards */}
                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-blue-600" />
                      Available Job Roles & Compensation in {company.hiringCity}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {company.openVacancies.length} Position{company.openVacancies.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5">
                    {company.openVacancies.map((vacancy) => {
                      const isIntern = vacancy.roleType === 'Internship' || vacancy.roleType === 'Early Career';

                      return (
                        <div
                          key={vacancy.id}
                          className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 hover:border-blue-400 hover:shadow-xs transition-all"
                        >
                          {/* Role Details */}
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm sm:text-base font-bold text-slate-950 group-hover:text-blue-600 transition-colors">
                                {vacancy.title}
                              </h4>

                              {/* Role Type Pill */}
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                                  isIntern
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                }`}
                              >
                                {vacancy.roleType}
                              </span>

                              {/* Work Model */}
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                {vacancy.workModel}
                              </span>

                              {/* Match Score */}
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                <Award className="h-3 w-3 text-emerald-600" />
                                {vacancy.matchScore}% Match
                              </span>
                            </div>

                            {/* Department & Experience required */}
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                              <span className="font-semibold text-slate-700">{vacancy.department}</span>
                              <span>·</span>
                              <span>{vacancy.seniority}</span>
                              <span>·</span>
                              <span>Req: {vacancy.experienceRequired}</span>
                            </div>

                            {/* Resume Match Rationale */}
                            <p className="text-[11px] text-slate-600 font-medium">
                              <span className="font-bold text-blue-700">Resume Alignment: </span>
                              {vacancy.matchReason}
                            </p>

                            {/* Matched vs Additional Skills */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[10px] font-bold text-slate-400 mr-1">Skills:</span>
                              {vacancy.skillsMatched.map((s) => (
                                <span
                                  key={s}
                                  className="rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold"
                                  title="Matched from your candidate resume"
                                >
                                  ✓ {s}
                                </span>
                              ))}
                              {vacancy.additionalSkills.map((s) => (
                                <span
                                  key={s}
                                  className="rounded-md bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 text-[10px] font-medium"
                                >
                                  + {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Salary / Stipend and Direct Actions */}
                          <div className="flex md:flex-col items-start md:items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                            {/* Prominent Salary or Stipend Tag */}
                            <div className="text-left md:text-right">
                              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                {vacancy.compensationType}
                              </span>
                              <div className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs sm:text-sm font-black text-emerald-950 shadow-2xs mt-0.5">
                                <DollarSign className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                <span>{vacancy.salaryOrStipend}</span>
                              </div>
                            </div>

                            {/* Direct External Application Links */}
                            <div className="flex items-center gap-2">
                              <a
                                href={vacancy.externalSearchUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors shadow-2xs"
                                title="Search this opening on Google Jobs"
                              >
                                <span>View Vacancy</span>
                                <ArrowUpRight className="h-3 w-3" />
                              </a>
                              <a
                                href={vacancy.applyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-xs"
                                title="Apply on Company Careers portal"
                              >
                                <span>Apply</span>
                                <ExternalLink className="h-3 w-3 text-slate-300" />
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
