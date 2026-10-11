export interface SkillToLearn {
  skill: string;
  category: 'Technical' | 'Framework & Tools' | 'Architecture & Systems' | 'Domain & Methodologies' | 'Leadership & Soft Skills';
  priority: 'Critical' | 'High' | 'Medium';
  whyItMatters: string;
  timeToLearn: string;
  recommendedProjectOrResource: string;
}

export interface KeywordAnalysis {
  missingKeywords: Array<{
    keyword: string;
    frequencyInJd: number;
    importance: 'High' | 'Medium' | 'Low';
    suggestedPlacement: string;
  }>;
  matchingKeywords: Array<{
    keyword: string;
    matchedInResume: string;
  }>;
  bulletEnhancements: Array<{
    originalResumeBullet: string;
    improvedVersion: string;
    keywordsInjected: string[];
    explanation: string;
  }>;
  atsSummaryRecommendation: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'Behavioral & STAR' | 'Technical Architecture' | 'Gap Probe' | 'Role Situational';
  question: string;
  interviewerIntent: string;
  keySignalsToConvey: string[];
  suggestedStrategy: string;
  sampleTalkingPoints: string[];
}

export interface CompatibilityAnalysisResult {
  overallScore: number;
  matchTier: 'Strong Match' | 'Competitive Contender' | 'Upskill Needed' | 'Significant Gap';
  headlineVerdict: string;
  executiveSummary: string;
  
  scoreBreakdown: {
    hardSkillsMatch: number;
    experienceRelevance: number;
    atsReadabilityAndKeywords: number;
    impactAndQuantification: number;
    seniorityAndScopeMatch: number;
  };

  keyStrengths: Array<{
    title: string;
    description: string;
    jdAlignment: string;
  }>;

  vulnerabilitiesAndGaps: Array<{
    title: string;
    description: string;
    severity: 'High' | 'Medium' | 'Low';
    howToMitigate: string;
  }>;

  skillsToLearn: SkillToLearn[];
  keywordOptimization: KeywordAnalysis;
  interviewQuestions: InterviewQuestion[];
  quickWinsChecklist: string[];
}

export interface InterviewFeedbackResult {
  score: number;
  verdict: string;
  strengths: string[];
  growthAreas: string[];
  starBreakdown: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  revisedModelAnswer: string;
}

export interface BulletOptimizationResult {
  metricsDriven: string;
  leadershipDriven: string;
  technicalDepth: string;
  analysis: string;
}
