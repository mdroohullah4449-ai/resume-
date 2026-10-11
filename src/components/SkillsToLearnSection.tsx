import React, { useState } from 'react';
import { SkillToLearn } from '../types/analyzer';
import { BookOpen, Clock, CheckSquare, Square, Compass } from 'lucide-react';

interface SkillsToLearnSectionProps {
  skills: SkillToLearn[];
}

export const SkillsToLearnSection: React.FC<SkillsToLearnSectionProps> = ({ skills }) => {
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completedSkills, setCompletedSkills] = useState<Record<string, boolean>>({});

  const toggleComplete = (skillName: string) => {
    setCompletedSkills((prev) => ({
      ...prev,
      [skillName]: !prev[skillName],
    }));
  };

  const categories = ['all', ...Array.from(new Set(skills.map((s) => s.category)))];
  const priorities = ['all', 'Critical', 'High', 'Medium'];

  const filteredSkills = skills.filter((s) => {
    const matchesPriority = selectedPriority === 'all' || s.priority === selectedPriority;
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesPriority && matchesCategory;
  });

  const completedCount = Object.values(completedSkills).filter(Boolean).length;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical':
        return 'text-cyan-800 bg-cyan-50 border-cyan-200';
      case 'Architecture & Systems':
        return 'text-indigo-800 bg-indigo-50 border-indigo-200';
      case 'Framework & Tools':
        return 'text-purple-800 bg-purple-50 border-purple-200';
      case 'Domain & Methodologies':
        return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      default:
        return 'text-amber-800 bg-amber-50 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-xs">
                <Compass className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-wide">
                Targeted Upskilling Roadmap
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              High-impact competencies and technical capabilities explicitly requested in the job description
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs text-slate-700 font-mono font-bold tabular-nums">
              {completedCount} / {skills.length} queued
            </span>
            <span className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs text-rose-700 font-bold font-mono">
              {skills.filter((s) => s.priority === 'Critical').length} Critical for Shortlist
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-semibold mr-1">Priority:</span>
            {priorities.map((p) => {
              const active = selectedPriority === p;
              return (
                <button
                  key={p}
                  onClick={() => setSelectedPriority(p)}
                  className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                    active
                      ? p === 'Critical'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : p === 'High'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : p === 'Medium'
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {p === 'all' ? 'All Priorities' : p}
                </button>
              );
            })}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 font-semibold mr-1">Category:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                  selectedCategory === c
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {c === 'all' ? 'All Categories' : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.map((item, idx) => {
          const isDone = !!completedSkills[item.skill];
          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                isDone
                  ? 'border-emerald-300 bg-emerald-50/50 opacity-85'
                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
              }`}
            >
              <div>
                {/* Top Row: Title, Category, Priority */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => toggleComplete(item.skill)}
                      className="text-slate-400 hover:text-emerald-600 transition-colors"
                      title={isDone ? 'Mark as incomplete' : 'Mark as in-progress / acquired'}
                    >
                      {isDone ? (
                        <CheckSquare className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Square className="h-5 w-5 hover:text-indigo-600" />
                      )}
                    </button>
                    <div>
                      <h4
                        className={`text-sm font-bold tracking-tight ${
                          isDone ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {item.skill}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold border ${getCategoryColor(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="flex items-center gap-1 font-mono text-slate-600 font-medium">
                          <Clock className="h-3 w-3 text-indigo-500" />
                          {item.timeToLearn}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Priority Badge */}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border ${
                      item.priority === 'Critical'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : item.priority === 'High'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                    }`}
                  >
                    {item.priority === 'Critical' && '● '}
                    {item.priority}
                  </span>
                </div>

                {/* Why it Matters */}
                <div className="mt-3.5 text-xs text-slate-600 leading-relaxed font-normal">
                  <span className="font-bold text-slate-800">Why it matters: </span>
                  {item.whyItMatters}
                </div>
              </div>

              {/* Learning Resource / Actionable Mini Project */}
              <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/70 -mx-5 -mb-5 p-4 rounded-b-2xl">
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-100 text-indigo-700 mt-0.5">
                    <BookOpen className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">
                      Recommended Proof Project:
                    </span>{' '}
                    <span className="text-slate-600">
                      {item.recommendedProjectOrResource}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-slate-200 bg-white">
          <p className="text-xs text-slate-500">No skills match the selected filter combination.</p>
        </div>
      )}
    </div>
  );
};
