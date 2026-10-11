import type { CompatibilityAnalysisResult } from '../types/analyzer.ts';

// Common technical and professional keywords to check
const KNOWN_KEYWORDS = [
  'React', 'TypeScript', 'JavaScript', 'Next.js', 'Node.js', 'Python', 'Go', 'Java',
  'GraphQL', 'REST', 'RESTful', 'SQL', 'PostgreSQL', 'MongoDB', 'Redis',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform',
  'Microservices', 'Micro-frontends', 'Architecture', 'System Design', 'Scalability',
  'Performance', 'Optimization', 'Core Web Vitals', 'Testing', 'Jest', 'Vitest',
  'Playwright', 'Cypress', 'Git', 'Agile', 'Scrum', 'Leadership', 'Mentorship',
  'State Management', 'Zustand', 'Redux', 'TanStack Query', 'Tailwind CSS',
  'Security', 'OAuth', 'WebSockets', 'Observability', 'Datadog', 'Monitoring',
  'Machine Learning', 'PyTorch', 'TensorFlow', 'LLM', 'RAG', 'Vector Database',
  'A/B Testing', 'Product Strategy', 'Roadmap', 'Analytics', 'Conversion Rate'
];

export function generateHeuristicAnalysis(
  resumeText: string,
  jobDescription: string,
  roleTitle?: string,
  targetSeniority?: string
): CompatibilityAnalysisResult {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  // Find keywords present in JD
  const jdKeywords = KNOWN_KEYWORDS.filter(k => jdLower.includes(k.toLowerCase()));
  
  // Find which ones match in resume vs missing
  const matchingKeywordsList = jdKeywords.filter(k => resumeLower.includes(k.toLowerCase()));
  const missingKeywordsList = jdKeywords.filter(k => !resumeLower.includes(k.toLowerCase()));

  // Score calculation
  const totalKeywords = Math.max(jdKeywords.length, 1);
  const matchRatio = matchingKeywordsList.length / totalKeywords;

  // Check metrics & quantification in resume (numbers, %, $, x)
  const numbersCount = (resumeText.match(/\d+([.,]\d+)?%|\$\d+|\b\d{2,}\b|\b\d+x\b/gi) || []).length;
  const impactScore = Math.min(95, Math.max(50, Math.round(50 + (numbersCount * 4))));

  // Seniority detection
  const hasSeniorKeywords = /senior|lead|staff|principal|head|director|architect|managed|mentored/i.test(resumeText);
  const targetNeedsSenior = /senior|lead|staff|principal|director|head|architect/i.test(jobDescription + ' ' + (roleTitle || ''));
  const seniorityScore = targetNeedsSenior ? (hasSeniorKeywords ? 85 : 65) : 80;

  // Hard skills score
  const hardSkillsMatch = Math.min(96, Math.max(45, Math.round(matchRatio * 100)));
  const experienceRelevance = Math.min(92, Math.max(50, Math.round((matchRatio * 0.7 + (hasSeniorKeywords ? 0.3 : 0.1)) * 100)));
  const atsScore = Math.min(95, Math.max(45, Math.round(matchRatio * 85 + 15)));

  const overallScore = Math.round(
    hardSkillsMatch * 0.35 +
    experienceRelevance * 0.25 +
    atsScore * 0.15 +
    impactScore * 0.15 +
    seniorityScore * 0.10
  );

  let matchTier: 'Strong Match' | 'Competitive Contender' | 'Upskill Needed' | 'Significant Gap';
  if (overallScore >= 80) matchTier = 'Strong Match';
  else if (overallScore >= 68) matchTier = 'Competitive Contender';
  else if (overallScore >= 52) matchTier = 'Upskill Needed';
  else matchTier = 'Significant Gap';

  const role = roleTitle || 'Target Role';

  const headlineVerdict = overallScore >= 75
    ? `Strong candidate profile demonstrating core proficiencies aligned with ${role}, requiring minor keyword positioning for top ATS ranking.`
    : `Viable candidate with foundational transferable experience for ${role}, with targeted opportunities to demonstrate high-scale impact and specific tech stack parity.`;

  const executiveSummary = `Based on a comprehensive comparative analysis between your background and the target specifications for ${role}, your experience reflects substantial technical and execution capabilities. 

Your profile demonstrates strength in ${matchingKeywordsList.slice(0, 3).join(', ') || 'core domain competencies'}, signaling strong technical readiness for the day-to-day requirements. 

To maximize shortlisting probability, address the gaps identified in ${missingKeywordsList.slice(0, 3).join(', ') || 'advanced domain tooling'} and substantiate your accomplishments with quantified efficiency or scale outcomes.`;

  // Strengths
  const keyStrengths = matchingKeywordsList.slice(0, 3).map((kw) => ({
    title: `Demonstrated Experience in ${kw}`,
    description: `Your resume validates hands-on proficiency with ${kw}, which is explicitly highlighted as a core prerequisite for ${role}.`,
    jdAlignment: `Directly satisfies critical production requirements specified in the employer job posting.`
  }));

  if (keyStrengths.length === 0) {
    keyStrengths.push({
      title: 'Transferable Technical Foundation',
      description: 'Your background demonstrates foundational engineering rigor and software development lifecycle experience.',
      jdAlignment: 'Provides the essential baseline needed to adapt quickly to the team stack.'
    });
  }

  // Gaps
  const vulnerabilitiesAndGaps = (missingKeywordsList.length > 0 ? missingKeywordsList.slice(0, 3) : ['Advanced Architectural Scale']).map((kw) => ({
    title: `Unstated or Missing Requirement: ${kw}`,
    description: `The job description emphasizes ${kw}, but your resume does not explicitly highlight or document experience with it.`,
    severity: 'Medium' as const,
    howToMitigate: `Integrate ${kw} into your recent project narratives or highlight parallel concepts (e.g. analogous frameworks or architectures) in your summary.`
  }));

  // Skills to Learn
  const skillsToLearn = (missingKeywordsList.length > 0 ? missingKeywordsList.slice(0, 4) : ['Distributed Systems', 'Performance Auditing', 'Observability', 'CI/CD Automation']).map((skill, idx) => ({
    skill,
    category: (idx % 2 === 0 ? 'Technical' : 'Architecture & Systems') as any,
    priority: (idx === 0 ? 'Critical' : idx === 1 ? 'High' : 'Medium') as any,
    whyItMatters: `Explicitly called out in the job posting as a differentiator for ${role}.`,
    timeToLearn: idx === 0 ? '1-2 weeks' : '2-3 weeks',
    recommendedProjectOrResource: `Build a production-grade demo or case study incorporating ${skill} to showcase in your portfolio.`
  }));

  // Missing Keywords
  const missingKeywords = (missingKeywordsList.length > 0 ? missingKeywordsList.slice(0, 6) : ['Scalability', 'System Architecture', 'Performance Optimization']).map((kw, idx) => ({
    keyword: kw,
    frequencyInJd: Math.max(1, 4 - idx),
    importance: (idx < 2 ? 'High' : idx < 4 ? 'Medium' : 'Low') as any,
    suggestedPlacement: idx === 0 ? 'Professional Summary and Core Competencies' : 'Under your most recent work experience'
  }));

  // Matching Keywords
  const matchingKeywords = matchingKeywordsList.slice(0, 6).map((kw) => ({
    keyword: kw,
    matchedInResume: `Found in resume experience text`
  }));

  // Extract a bullet from resume or create a representative one
  const resumeLines = resumeText.split('\n').map(l => l.trim()).filter(l => l.startsWith('-') || l.startsWith('•') || l.length > 30);
  const sampleBullet = resumeLines[0]?.replace(/^[-•*]\s*/, '') || 'Responsible for building application features and collaborating with team members.';

  const bulletEnhancements = [
    {
      originalResumeBullet: sampleBullet,
      improvedVersion: `Architected and deployed high-performance features utilizing ${matchingKeywordsList[0] || 'core technologies'}, improving system throughput by 32% and reducing deployment cycle times.`,
      keywordsInjected: [matchingKeywordsList[0] || 'High-performance', 'Architecture'],
      explanation: 'Transforms generic responsibility into an XYZ-quantified accomplishment with measurable business ROI.'
    },
    {
      originalResumeBullet: resumeLines[1]?.replace(/^[-•*]\s*/, '') || 'Worked on improving website performance and user experience.',
      improvedVersion: `Optimized critical user-facing workflows and rendering pipelines, boosting page responsiveness by 28% and ensuring compliance with industry performance benchmarks.`,
      keywordsInjected: ['Optimization', 'Workflows', 'Performance'],
      explanation: 'Highlights performance engineering rigor and concrete percentage gains.'
    }
  ];

  const interviewQuestions = [
    {
      id: 'q1',
      category: 'Technical Architecture' as const,
      question: `How would you architect a production-grade system using ${matchingKeywordsList[0] || 'modern frameworks'} to ensure high availability and sub-second response times?`,
      interviewerIntent: 'Testing architectural depth, system design trade-offs, and practical scalability intuition.',
      keySignalsToConvey: ['Modular component architecture', 'Caching & state management', 'Failure boundaries and latency budgets'],
      suggestedStrategy: 'Outline the architecture from client request to data store, explaining key trade-offs made along the way.',
      sampleTalkingPoints: ['Decoupled services', 'Asynchronous data pipelines', 'Real-user telemetry monitoring']
    },
    {
      id: 'q2',
      category: 'Gap Probe' as const,
      question: `Our team relies heavily on ${missingKeywordsList[0] || 'advanced tooling'}. How quickly have you ramped up on unfamiliar technologies in past roles?`,
      interviewerIntent: 'Testing learning velocity, technical curiosity, and adaptability under delivery pressure.',
      keySignalsToConvey: ['Proactive research skills', 'Pragmatic experimentation', 'Fast time-to-first-commit'],
      suggestedStrategy: 'Use the STAR format to recount a specific instance where you mastered a new technology quickly.',
      sampleTalkingPoints: ['Audit documentation and sample repos', 'Build a quick proof-of-concept', 'Seek early feedback from peers']
    },
    {
      id: 'q3',
      category: 'Behavioral & STAR' as const,
      question: 'Describe a situation where you had to push back on unrealistic technical deadlines or navigate conflicting stakeholder priorities.',
      interviewerIntent: 'Evaluating professional maturity, communication, and risk management.',
      keySignalsToConvey: ['Data-driven negotiation', 'Transparent trade-off matrices', 'Focus on customer outcomes'],
      suggestedStrategy: 'Explain the business context, the trade-offs presented, and the collaborative resolution achieved.',
      sampleTalkingPoints: ['Scoped MVP vs future iterations', 'Communicated risk profiles to leadership', 'Delivered core functionality on schedule']
    },
    {
      id: 'q4',
      category: 'Role Situational' as const,
      question: `If our core application experiences a sudden degradation in performance during a critical period, walk us through your triage protocol.`,
      interviewerIntent: 'Testing incident management, observability proficiency, and calm under fire.',
      keySignalsToConvey: ['Observability & logs first', 'Mitigate customer impact before deep-diving', 'Blameless post-mortem follow-through'],
      suggestedStrategy: 'Structure your response into 3 phases: Rapid Containment, Root-Cause Isolation, and Permanent Prevention.',
      sampleTalkingPoints: ['Check APM and error dashboards', 'Roll back or toggle feature flags', 'Conduct systematic root-cause review']
    }
  ];

  const quickWinsChecklist = [
    `Align your professional title at the top of your resume with "${role}".`,
    `Weave top missing keywords (${missingKeywordsList.slice(0, 3).join(', ') || 'key technical terms'}) into your Summary section.`,
    'Quantify at least three bullet points with concrete percentages (%), dollar amounts ($), or hours saved.',
    'Eliminate generic verbs (e.g. "Worked on", "Helped with") and replace them with decisive action verbs like "Architected", "Engineered", or "Spearheaded".',
    'Ensure all section headers follow standard ATS conventions (Professional Experience, Technical Skills, Education).',
    'Review Core Competencies to reflect the exact phrasing found in the target job description.'
  ];

  return {
    overallScore,
    matchTier,
    headlineVerdict,
    executiveSummary,
    scoreBreakdown: {
      hardSkillsMatch,
      experienceRelevance,
      atsReadabilityAndKeywords: atsScore,
      impactAndQuantification: impactScore,
      seniorityAndScopeMatch: seniorityScore
    },
    keyStrengths,
    vulnerabilitiesAndGaps,
    skillsToLearn,
    keywordOptimization: {
      missingKeywords,
      matchingKeywords,
      bulletEnhancements,
      atsSummaryRecommendation: 'Adopt a clean, single-column ATS layout. Ensure clear semantic headers and keyword parity with the job posting.'
    },
    interviewQuestions,
    quickWinsChecklist
  };
}
