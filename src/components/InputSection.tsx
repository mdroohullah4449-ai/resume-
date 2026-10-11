import React, { useRef, useState } from 'react';
import {
  FileText,
  Briefcase,
  Sliders,
  Sparkles,
  Upload,
  ArrowRight,
  Code2,
  TrendingUp,
  Brain,
  Check,
  Loader2,
  FileImage,
  FileCode,
  X,
  FileUp,
} from 'lucide-react';
import { SAMPLE_PRESETS, Preset } from '../data/samplePresets';

interface InputSectionProps {
  resumeText: string;
  setResumeText: (val: string) => void;
  jobDescription: string;
  setJobDescription: (val: string) => void;
  roleTitle: string;
  setRoleTitle: (val: string) => void;
  targetSeniority: string;
  setTargetSeniority: (val: string) => void;
  focusAreas: string[];
  setFocusAreas: (val: string[]) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onSelectPreset: (preset: Preset) => void;
  onExploreRadar?: () => void;
}

interface UploadedFileInfo {
  name: string;
  size: string;
  type: string;
  previewUrl?: string;
  status: 'processing' | 'done' | 'error';
  errorMessage?: string;
}

export const InputSection: React.FC<InputSectionProps> = ({
  resumeText,
  setResumeText,
  jobDescription,
  setJobDescription,
  roleTitle,
  setRoleTitle,
  targetSeniority,
  setTargetSeniority,
  focusAreas,
  setFocusAreas,
  onAnalyze,
  isAnalyzing,
  onSelectPreset,
  onExploreRadar,
}) => {
  const resumeFileInputRef = useRef<HTMLInputElement>(null);
  const jdFileInputRef = useRef<HTMLInputElement>(null);

  const [resumeFile, setResumeFile] = useState<UploadedFileInfo | null>(null);
  const [jdFile, setJdFile] = useState<UploadedFileInfo | null>(null);
  const [isResumeDragging, setIsResumeDragging] = useState(false);
  const [isJdDragging, setIsJdDragging] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processUploadedFile = async (
    file: File,
    target: 'resume' | 'jd'
  ) => {
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      const errInfo: UploadedFileInfo = {
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        status: 'error',
        errorMessage: 'File exceeds 15MB limit. Please upload a smaller file or paste text directly.',
      };
      if (target === 'resume') setResumeFile(errInfo);
      else setJdFile(errInfo);
      return;
    }

    const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(file.name);
    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
    const isText = file.type.startsWith('text/') || /\.(txt|md)$/i.test(file.name);

    // Initial state
    const fileInfo: UploadedFileInfo = {
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type || (isPdf ? 'application/pdf' : isImage ? 'image/jpeg' : 'text/plain'),
      previewUrl: isImage ? URL.createObjectURL(file) : undefined,
      status: 'processing',
    };

    if (target === 'resume') setResumeFile(fileInfo);
    else setJdFile(fileInfo);

    // Quick path for plain text
    if (isText) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target?.result as string) || '';
        const clean = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
        if (target === 'resume') {
          setResumeText(clean);
          setResumeFile((prev) => (prev ? { ...prev, status: 'done' } : null));
        } else {
          setJobDescription(clean);
          setJdFile((prev) => (prev ? { ...prev, status: 'done' } : null));
        }
      };
      reader.onerror = () => {
        const errInfo: UploadedFileInfo = {
          ...fileInfo,
          status: 'error',
          errorMessage: 'Failed to read text file. Please copy and paste directly.',
        };
        if (target === 'resume') setResumeFile(errInfo);
        else setJdFile(errInfo);
      };
      reader.readAsText(file);
      return;
    }

    // Multimodal / PDF / Image path via server API
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64Data = e.target?.result as string;
        const res = await fetch('/api/extract-document-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: base64Data,
            fileName: file.name,
            mimeType: file.type,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to extract text from document.');
        }

        const data = await res.json();
        const extractedText = (data.text || '').trim();

        if (!extractedText) {
          throw new Error('No legible text found in document. Please try a clearer scan or paste text.');
        }

        if (target === 'resume') {
          setResumeText(extractedText);
          setResumeFile((prev) => (prev ? { ...prev, status: 'done' } : null));
        } else {
          setJobDescription(extractedText);
          setJdFile((prev) => (prev ? { ...prev, status: 'done' } : null));
        }
      } catch (err: any) {
        console.error('File extraction failed:', err);
        const errInfo: UploadedFileInfo = {
          ...fileInfo,
          status: 'error',
          errorMessage: err.message || 'Could not parse document. Please paste text directly into the box.',
        };
        if (target === 'resume') setResumeFile(errInfo);
        else setJdFile(errInfo);
      }
    };
    reader.onerror = () => {
      const errInfo: UploadedFileInfo = {
        ...fileInfo,
        status: 'error',
        errorMessage: 'Error reading file data. Please paste text directly.',
      };
      if (target === 'resume') setResumeFile(errInfo);
      else setJdFile(errInfo);
    };
    reader.readAsDataURL(file);
  };

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file, 'resume');
    }
  };

  const handleJdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file, 'jd');
    }
  };

  const clearResumeFile = () => {
    setResumeFile(null);
    if (resumeFileInputRef.current) resumeFileInputRef.current.value = '';
  };

  const clearJdFile = () => {
    setJdFile(null);
    if (jdFileInputRef.current) jdFileInputRef.current.value = '';
  };

  const toggleFocus = (area: string) => {
    if (focusAreas.includes(area)) {
      setFocusAreas(focusAreas.filter((a) => a !== area));
    } else {
      setFocusAreas([...focusAreas, area]);
    }
  };

  const canAnalyze = resumeText.trim().length > 30 && jobDescription.trim().length > 30;

  const presetMeta = [
    {
      id: 'frontend-lead',
      icon: <Code2 className="h-4 w-4 text-cyan-600" />,
      tag: 'Tech Platform',
      color: 'from-cyan-50/90 via-sky-50/50 to-white border-cyan-200/90 hover:border-cyan-400 hover:shadow-md hover:shadow-cyan-100',
      badge: 'text-cyan-700 bg-cyan-100/70 border-cyan-300',
    },
    {
      id: 'product-manager',
      icon: <TrendingUp className="h-4 w-4 text-fuchsia-600" />,
      tag: 'Fintech Growth',
      color: 'from-fuchsia-50/90 via-purple-50/50 to-white border-fuchsia-200/90 hover:border-fuchsia-400 hover:shadow-md hover:shadow-fuchsia-100',
      badge: 'text-fuchsia-700 bg-fuchsia-100/70 border-fuchsia-300',
    },
    {
      id: 'ai-ml-engineer',
      icon: <Brain className="h-4 w-4 text-emerald-600" />,
      tag: 'GenAI & MLOps',
      color: 'from-emerald-50/90 via-teal-50/50 to-white border-emerald-200/90 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-100',
      badge: 'text-emerald-700 bg-emerald-100/70 border-emerald-300',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Preset Quick Loader Grid Cards */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Quick Start with Pre-Built Benchmarks
              </h3>
              <p className="text-xs text-slate-500">
                Populate a full candidate resume matched against an authentic enterprise job posting
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_PRESETS.map((preset) => {
            const meta = presetMeta.find((m) => m.id === preset.id);
            return (
              <button
                key={preset.id}
                onClick={() => {
                  clearResumeFile();
                  clearJdFile();
                  onSelectPreset(preset);
                }}
                type="button"
                className={`group relative text-left rounded-xl border p-4 bg-gradient-to-b transition-all duration-200 ${
                  meta?.color || 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {meta?.icon}
                    <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {preset.name}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${meta?.badge}`}
                  >
                    {meta?.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed font-normal">
                  {preset.roleTitle} · {preset.targetCompany}
                </p>
                <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-indigo-600">
                  <span>Load complete benchmark</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual-Column Input Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Candidate Resume */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsResumeDragging(true);
          }}
          onDragLeave={() => setIsResumeDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsResumeDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) processUploadedFile(file, 'resume');
          }}
          className={`relative group flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all ${
            isResumeDragging
              ? 'border-indigo-500 bg-indigo-50/30 ring-2 ring-indigo-200'
              : 'border-indigo-100 hover:shadow-md'
          }`}
        >
          {/* Header */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-xs">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-wide">
                  1. Candidate Resume / Experience
                </h2>
                <p className="text-xs text-slate-500">
                  Upload PDF, JPG, PNG, or paste plain text
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={resumeFileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md,image/png,image/jpeg,application/pdf"
                onChange={handleResumeFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => resumeFileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-colors shadow-xs"
                title="Upload PDF, Image (JPG/PNG), or Text document"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload PDF / Image</span>
              </button>
            </div>
          </div>

          {/* Uploaded File Chip / Status Indicator */}
          {resumeFile && (
            <div
              className={`mb-3 flex items-center justify-between gap-3 rounded-xl border p-3 text-xs transition-all ${
                resumeFile.status === 'processing'
                  ? 'border-sky-200 bg-sky-50 text-sky-900'
                  : resumeFile.status === 'done'
                  ? 'border-emerald-200 bg-emerald-50/80 text-emerald-900'
                  : 'border-rose-200 bg-rose-50 text-rose-800'
              }`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                {resumeFile.previewUrl ? (
                  <img
                    src={resumeFile.previewUrl}
                    alt="Preview"
                    className="h-9 w-9 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                ) : resumeFile.type.includes('pdf') || resumeFile.name.endsWith('.pdf') ? (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700 font-mono font-bold text-[10px]">
                    PDF
                  </div>
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                    <FileImage className="h-4 w-4" />
                  </div>
                )}

                <div className="truncate">
                  <div className="font-bold truncate text-xs flex items-center gap-1.5">
                    <span>{resumeFile.name}</span>
                    <span className="font-normal text-slate-500 text-[11px]">({resumeFile.size})</span>
                  </div>
                  <div className="text-[11px] mt-0.5">
                    {resumeFile.status === 'processing' && (
                      <span className="flex items-center gap-1 text-sky-700 font-semibold animate-pulse">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Scanning document & extracting text with AI OCR...
                      </span>
                    )}
                    {resumeFile.status === 'done' && (
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <Check className="h-3 w-3" />
                        Text successfully extracted into editor
                      </span>
                    )}
                    {resumeFile.status === 'error' && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-rose-700 font-semibold">
                          {resumeFile.errorMessage}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            clearResumeFile();
                            resumeFileInputRef.current?.click();
                          }}
                          className="font-bold underline text-rose-800 hover:text-rose-950"
                        >
                          Retry upload
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={clearResumeFile}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                title="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Text Area */}
          <div className="relative flex-1">
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your full resume here or upload a document (PDF, JPG, PNG, TXT)..."
              rows={14}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/70 p-4 font-mono text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-100 leading-relaxed transition-all"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>
                {resumeText.trim().length > 0
                  ? `${resumeText.trim().split(/\s+/).length} words · ${resumeText.length} characters`
                  : 'Supported formats: PDF, JPG, JPEG, PNG, TXT'}
              </span>
              {resumeText.length > 30 && (
                <span className="text-emerald-600 flex items-center gap-1 font-bold">
                  <Check className="h-3.5 w-3.5" /> Ready for analysis
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Target Job Description */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsJdDragging(true);
          }}
          onDragLeave={() => setIsJdDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsJdDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) processUploadedFile(file, 'jd');
          }}
          className={`relative group flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all ${
            isJdDragging
              ? 'border-purple-500 bg-purple-50/30 ring-2 ring-purple-200'
              : 'border-purple-100 hover:shadow-md'
          }`}
        >
          {/* Header */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200 shadow-xs">
                <Briefcase className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-wide">
                  2. Target Job Description
                </h2>
                <p className="text-xs text-slate-500">
                  Upload JD document, screenshot, or paste requirements
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={jdFileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md,image/png,image/jpeg,application/pdf"
                onChange={handleJdFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => jdFileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50/80 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 hover:border-purple-300 transition-colors shadow-xs"
                title="Upload PDF, Image (JPG/PNG), or Text document"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload JD File</span>
              </button>
            </div>
          </div>

          {/* Uploaded File Chip for JD */}
          {jdFile && (
            <div
              className={`mb-3 flex items-center justify-between gap-3 rounded-xl border p-3 text-xs transition-all ${
                jdFile.status === 'processing'
                  ? 'border-sky-200 bg-sky-50 text-sky-900'
                  : jdFile.status === 'done'
                  ? 'border-emerald-200 bg-emerald-50/80 text-emerald-900'
                  : 'border-rose-200 bg-rose-50 text-rose-800'
              }`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                {jdFile.previewUrl ? (
                  <img
                    src={jdFile.previewUrl}
                    alt="Preview"
                    className="h-9 w-9 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                ) : jdFile.type.includes('pdf') || jdFile.name.endsWith('.pdf') ? (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700 font-mono font-bold text-[10px]">
                    PDF
                  </div>
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                    <FileImage className="h-4 w-4" />
                  </div>
                )}

                <div className="truncate">
                  <div className="font-bold truncate text-xs flex items-center gap-1.5">
                    <span>{jdFile.name}</span>
                    <span className="font-normal text-slate-500 text-[11px]">({jdFile.size})</span>
                  </div>
                  <div className="text-[11px] mt-0.5">
                    {jdFile.status === 'processing' && (
                      <span className="flex items-center gap-1 text-sky-700 font-semibold animate-pulse">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Scanning job description with AI OCR...
                      </span>
                    )}
                    {jdFile.status === 'done' && (
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <Check className="h-3 w-3" />
                        Job requirements extracted successfully
                      </span>
                    )}
                    {jdFile.status === 'error' && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-rose-700 font-semibold">
                          {jdFile.errorMessage}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            clearJdFile();
                            jdFileInputRef.current?.click();
                          }}
                          className="font-bold underline text-rose-800 hover:text-rose-950"
                        >
                          Retry upload
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={clearJdFile}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                title="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Optional Meta fields */}
          <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Target Role Title (Optional)
              </label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Staff Frontend Engineer"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Target Seniority
              </label>
              <select
                value={targetSeniority}
                onChange={(e) => setTargetSeniority(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs text-slate-800 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 font-medium"
              >
                <option value="Auto-detect from JD">Auto-detect from JD</option>
                <option value="Entry / Junior (0-2 yrs)">Entry / Junior (0-2 yrs)</option>
                <option value="Mid-Level (2-5 yrs)">Mid-Level (2-5 yrs)</option>
                <option value="Senior (5-8 yrs)">Senior (5-8 yrs)</option>
                <option value="Staff / Principal (8+ yrs)">Staff / Principal (8+ yrs)</option>
                <option value="Engineering Manager / Director">Engineering Manager / Director</option>
              </select>
            </div>
          </div>

          {/* Text Area */}
          <div className="relative flex-1">
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here, or upload a document/screenshot..."
              rows={11}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/70 p-4 font-mono text-xs text-slate-800 placeholder-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-purple-100 leading-relaxed transition-all"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>
                {jobDescription.trim().length > 0
                  ? `${jobDescription.trim().split(/\s+/).length} words · ${jobDescription.length} characters`
                  : 'Supported formats: PDF, JPG, JPEG, PNG, TXT'}
              </span>
              {jobDescription.length > 30 && (
                <span className="text-emerald-600 flex items-center gap-1 font-bold">
                  <Check className="h-3.5 w-3.5" /> Ready for analysis
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Configuration & Trigger Bar */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Focus Dimensions Multi-select */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900 tracking-wide uppercase">
                Prioritize Diagnostic Focus Areas
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'ats-keywords', label: 'ATS Vector Keywords & Placement' },
                { id: 'technical-depth', label: 'Tech Stack & Deep Hard Skills' },
                { id: 'quantified-impact', label: 'Impact Metrics & ROI Formulation' },
                { id: 'interview-readiness', label: 'Interview Defense & STAR Prep' },
              ].map((area) => {
                const active = focusAreas.includes(area.id);
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => toggleFocus(area.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border ${
                      active
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-800 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {area.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onAnalyze}
              disabled={!canAnalyze || isAnalyzing}
              className={`w-full sm:w-auto relative flex items-center justify-center gap-2.5 rounded-2xl px-8 py-4 text-sm font-bold transition-all duration-300 ${
                canAnalyze && !isAnalyzing
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Synthesizing Compatibility Analysis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-white" />
                  <span>Run Precision Compatibility Analysis</span>
                  <ArrowRight className="h-4 w-4 text-white" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
