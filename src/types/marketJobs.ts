export interface JobVacancy {
  id: string;
  title: string;
  roleType: 'Full-Time' | 'Internship' | 'Contract' | 'Early Career';
  department: string;
  workModel: 'Remote' | 'Hybrid' | 'Onsite';
  seniority: string;
  skillsMatched: string[];
  additionalSkills: string[];
  salaryOrStipend: string;
  compensationType: 'Annual Salary' | 'Monthly Stipend' | 'Hourly Stipend';
  experienceRequired: string;
  matchScore: number;
  matchReason: string;
  postedDate: string;
  location: string;
  externalSearchUrl: string;
  linkedInSearchUrl: string;
  applyUrl: string;
}

export interface RecruitingCompany {
  id: string;
  name: string;
  brandColor?: string;
  logoInitial: string;
  website: string;
  industry: string;
  tier: 'Top Tech / Big Tech' | 'High-Growth Unicorn' | 'Enterprise Leader' | 'AI / DeepTech';
  headquarters: string;
  hiringCity: string;
  hiringCountry: string;
  hiringMomentum: 'Surge Hiring' | 'Actively Recruiting' | 'Steady Growth' | 'Fast-Track';
  techStack: string[];
  whyMatch: string;
  estimatedEmployees: string;
  benefitsHighlight: string[];
  openVacancies: JobVacancy[];
  careersPageUrl: string;
  directSearchUrl: string;
}

export interface RecommendedJobRole {
  id: string;
  roleTitle: string;
  category: 'Best Current Fit' | 'Career Progression' | 'High-Demand Specialization' | 'Internship / Early Career';
  rationale: string;
  matchedResumeSkills: string[];
  skillsToAcquire: string[];
  estimatedCompensation: string;
  demandLevel: 'Surge' | 'High' | 'Steady';
}

export interface CandidateResumeProfile {
  summary: string;
  detectedSeniority: string;
  yearsOfExperienceEstimate: string;
  coreSkills: string[];
  topDomains: string[];
  resumeHighlights: string[];
}

export interface MarketVacanciesResponse {
  country: string;
  city: string;
  roleTarget: string;
  marketDemandTier: 'Very High' | 'High' | 'Moderate' | 'Growing';
  medianSalaryEstimate: string;
  internshipStipendEstimate: string;
  topSkillsInDemand: string[];
  totalVacanciesCount: number;
  candidateProfile?: CandidateResumeProfile;
  recommendedRoles?: RecommendedJobRole[];
  companies: RecruitingCompany[];
  hiringHubs: string[];
  dataSource: 'live-market-intelligence' | 'grounded-market-database';
}
