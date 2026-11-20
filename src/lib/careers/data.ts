// Career tracker data: expectations, resume snapshot, opportunities and skill gaps.
// Add new opportunities to OPPORTUNITIES (newest first). Each entry needs an `addedOn` date.

export const EXPECTATIONS = {
  roles: ["React Developer", "Frontend Developer", "Next.js / TypeScript Developer"],
  minMonthlyPay: 80000,
  minYearlyLpa: 9.6, // ₹80,000 × 12
  targetLpa: "12–16 LPA",
  minHeadcount: 200,
  locations: ["Ahmedabad", "Gandhinagar", "Remote (India)"],
  relocation: false,
  deadline: "31 December 2026",
  rule: "Get a written offer before resigning.",
} as const;

export const RESUME = {
  headline: "React Developer · about 3 years",
  experience: [
    { role: "React Developer", org: "DevineGlobe Technologies", period: "Jul 2024 – Present" },
    { role: "Web Developer", org: "Excellent Webworld", period: "Apr 2023" },
  ],
  education: "B.Tech, Silver Oak University",
  skills: [
    "React.js", "Next.js", "TypeScript", "JavaScript (ES6+)", "Redux-style state (Zustand, Context API)",
    "TanStack React Query", "Tailwind CSS", "Material UI", "Vite", "REST APIs", "Axios", "Firebase Auth",
    "Git", "Jira", "Agile/Scrum", "Postman", "AI tools (Claude, Copilot, Codex)",
  ],
} as const;

export type Opportunity = {
  id: string;
  addedOn: string; // YYYY-MM-DD, the day it was added here
  title: string;
  company: string;
  location: string;
  remote: boolean;
  posted: string;
  url: string;
  experience: string;
  headcount: number | null; // lower bound of employee count, null if unknown
  headcountLabel: string;
  yearlyLpa: number | null; // null if pay not listed
  payLabel: string;
  skills: string[];
};

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "hitachi-frontend-remote",
    addedOn: "2026-11-20",
    title: "Frontend Web Developer",
    company: "Hitachi Energy / Hitachi Vantara",
    location: "Remote",
    remote: true,
    posted: "Oct 9, 2026",
    url: "https://to.indeed.com/aarwbhslwd4r",
    experience: "7+ years (stretch)",
    headcount: 10000,
    headcountLabel: "10,000+",
    yearlyLpa: 17.3,
    payLabel: "~₹17.3 LPA average (one Indeed data point)",
    skills: ["JavaScript", "React", "Redux", "HTML5", "CSS3", "REST APIs", "Bootstrap / Material", "Linux"],
  },
  {
    id: "addact-fullstack-ahmedabad",
    addedOn: "2026-11-20",
    title: "Frontend Full Stack Developer",
    company: "Addact Technologies",
    location: "Ahmedabad",
    remote: false,
    posted: "Sep 24, 2026",
    url: "https://to.indeed.com/aabjy24rcj9r",
    experience: "4 years",
    headcount: null,
    headcountLabel: "Not listed",
    yearlyLpa: 7,
    payLabel: "₹6–7 LPA (below your floor)",
    skills: ["React", "Next.js", "Node.js", "Express / NestJS", "MongoDB / PostgreSQL", "GraphQL", "TypeScript", "Docker / CI-CD", "AI tools"],
  },
  {
    id: "arango-frontend-remote",
    addedOn: "2026-11-20",
    title: "Frontend Engineer",
    company: "Arango",
    location: "Remote (India)",
    remote: true,
    posted: "Oct 16, 2026",
    url: "https://to.indeed.com/aatskchcn9rl",
    experience: "5+ years",
    headcount: null,
    headcountLabel: "Not listed",
    yearlyLpa: null,
    payLabel: "Not listed",
    skills: ["JavaScript", "React", "TypeScript", "HTML", "CSS", "Figma", "Tailwind CSS", "Unit / E2E testing"],
  },
  {
    id: "infospry-react-remote",
    addedOn: "2026-11-20",
    title: "React Developer",
    company: "Infospry",
    location: "Remote",
    remote: true,
    posted: "Feb 27, 2026",
    url: "https://to.indeed.com/aafkt9yqnrvd",
    experience: "1+ years",
    headcount: null,
    headcountLabel: "Not listed",
    yearlyLpa: null,
    payLabel: "Not listed",
    skills: ["React", "Next.js", "Redux", "REST APIs", "TypeScript", "Jest / Cypress", "SEO"],
  },
  {
    id: "innovins-frontend-remote",
    addedOn: "2026-11-20",
    title: "Frontend Developer",
    company: "Innovins Technologies",
    location: "Remote",
    remote: true,
    posted: "Feb 28, 2026",
    url: "https://to.indeed.com/aamnvlcjhqwd",
    experience: "Not listed",
    headcount: null,
    headcountLabel: "Not listed",
    yearlyLpa: null,
    payLabel: "Not listed",
    skills: ["HTML5", "CSS3", "JavaScript", "WordPress", "Shopify", "React (preferred)", "Figma"],
  },
  {
    id: "skynet-react-ahmedabad",
    addedOn: "2026-11-20",
    title: "ReactJS Developer",
    company: "Skynet Technologies",
    location: "Ahmedabad",
    remote: false,
    posted: "Feb 19, 2026",
    url: "https://to.indeed.com/aatktjcbng7n",
    experience: "4+ years",
    headcount: 11,
    headcountLabel: "11–50",
    yearlyLpa: null,
    payLabel: "Not listed",
    skills: ["React", "Redux", "Context API", "REST APIs", "Jest", "Git"],
  },
  {
    id: "webs-frontend-ahmedabad",
    addedOn: "2026-11-20",
    title: "Frontend Developer (Angular & React)",
    company: "Webs Optimization Software Solution",
    location: "Sola, Ahmedabad (on-site)",
    remote: false,
    posted: "Feb 19, 2026",
    url: "https://to.indeed.com/aalhc7cgb9ym",
    experience: "2–3 years",
    headcount: 11,
    headcountLabel: "11–50",
    yearlyLpa: null,
    payLabel: "Not listed",
    skills: ["Angular", "React", "TypeScript", "NgRx / Redux", "Jest / Jasmine", "CI-CD", "Git"],
  },
  {
    id: "conceptserve-react-ahmedabad",
    addedOn: "2026-11-20",
    title: "React js Developer",
    company: "ConceptServe Technologies",
    location: "Ahmedabad",
    remote: false,
    posted: "Feb 19, 2026",
    url: "https://to.indeed.com/aa274mwz7ywd",
    experience: "Not listed",
    headcount: null,
    headcountLabel: "Not listed",
    yearlyLpa: null,
    payLabel: "Not listed",
    skills: ["React", "Redux", "Webpack", "Jest", "Enzyme", "Flux"],
  },
  {
    id: "excelptp-angular-react-ahmedabad",
    addedOn: "2026-11-20",
    title: "Angular / React.js Front-End Developer",
    company: "ExcelPTP",
    location: "Navrangpura, Ahmedabad",
    remote: false,
    posted: "Jul 30, 2026",
    url: "https://to.indeed.com/aarmg92lgwv8",
    experience: "6 months – 4 years",
    headcount: null,
    headcountLabel: "Not listed",
    yearlyLpa: null,
    payLabel: "Not listed",
    skills: ["Angular", "React", "TypeScript", "Bootstrap", "REST APIs", "Git"],
  },
];

/** Skills that show up in postings, whether the resume shows them, and whether the curriculum covers them. */
export const SKILL_GAPS: { skill: string; postings: number; onResume: boolean; inCurriculum: boolean; why: string }[] = [
  { skill: "TypeScript", postings: 6, onResume: true, inCurriculum: true, why: "Asked for in most postings. Show it in real components." },
  { skill: "Next.js", postings: 5, onResume: true, inCurriculum: true, why: "Core to the Next.js and full-stack roles." },
  { skill: "Testing (Jest, React Testing Library, Cypress)", postings: 5, onResume: false, inCurriculum: true, why: "Named in many postings. No testing on your resume yet." },
  { skill: "Redux", postings: 4, onResume: false, inCurriculum: true, why: "Your resume lists Zustand and Context. Redux shows up in several listings." },
  { skill: "Node.js / Express / NestJS", postings: 3, onResume: false, inCurriculum: false, why: "Needed for full-stack roles. Not in the current curriculum." },
  { skill: "Angular", postings: 2, onResume: false, inCurriculum: false, why: "Appears in two Ahmedabad listings. Not in the curriculum." },
  { skill: "GraphQL", postings: 1, onResume: false, inCurriculum: true, why: "Listed in one full-stack role." },
  { skill: "Docker / CI-CD", postings: 2, onResume: false, inCurriculum: true, why: "Listed as a plus in full-stack roles." },
  { skill: "Figma / UI design", postings: 3, onResume: false, inCurriculum: false, why: "Wanted in design-leaning frontend roles." },
];
