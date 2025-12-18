import { getPersonalInfo } from "@/lib/actions/profileInfo";
import { PersonalInfoType } from "@/config/schema";
import SkillsContent from "./SkillsContent";

const FALLBACK_SKILLS = [
  {
    id: "1",
    title: "Programming Languages",
    description: "",
    items: ["JavaScript", "TypeScript", "C#", "SQL", "Java", "PHP", "Python"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Frameworks & Libraries",
    description: "",
    items: [
      "Next.js",
      "React Native",
      ".NET Core MVC",
      ".NET Web API",
      "Spring Boot",
      "Pandas",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Databases & Tools",
    description: "",
    items: [
      "MySQL",
      "PostgreSQL",
      "SQL Server",
      "Neon Serverless DB",
      "Drizzle ORM",
      "Convex",
      "Excel",
      "Jupyter Notebook",
      "Google Colab",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Platforms & APIs",
    description: "",
    items: [
      "Vercel",
      "Clerk Auth",
      "Stripe",
      "Gemini API",
      "YouTube API",
      "Next Auth",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Soft Skills",
    description: "",
    items: [
      "Problem-solving",
      "Effective Communication",
      "Adaptability",
      "Time Management",
      "Creative Solution Design",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Virtual Assistance",
    description: "",
    items: [
      "Canva Design",
      "Social Media Management",
      "Video & Podcast Editing",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Data & Analytics",
    description: "",
    items: [
      "Excel (Basic-Intermediate)",
      "Google Colab (Data Analysis, Machine Learning)",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    title: "Web & Mobile Development",
    description: "",
    items: [
      "Next.js",
      "React Native",
      "No-Code (Lovable)",
      "Payment Integration (Stripe, Clerk, Lemonsqueezy)",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "9",
    title: "Administrative Support",
    description: "",
    items: [
      "Admin Dashboards",
      "Clickup (Minimal)",
      "Bookkeeping",
      "Financial Statements",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "10",
    title: "Communication",
    description: "",
    items: [
      "Client Connectivity",
      "Insights via YouTube, Email, Facebook, LinkedIn",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "11",
    title: "SEO",
    description: "",
    items: ["Keyword Implementation in Website Metadata (Next.js)"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "12",
    title: "Eagerness to Learn",
    description: "",
    items: [
      "CMS (WordPress, Wix)",
      "E-commerce (Shopify, GoHigh Level, Hubspot)",
      "Marketing Campaigns",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ProfileSkills = async ({ userRole }: { userRole: string }) => {
  const personalInfo: PersonalInfoType | null = await getPersonalInfo();

  if (!personalInfo) {
    return null;
  }

  // Use stored skills if they exist and the array is not empty
  const displaySkills =
    personalInfo.skills && personalInfo.skills.length > 0
      ? personalInfo.skills
      : FALLBACK_SKILLS;

  return <SkillsContent skills={displaySkills as any} userRole={userRole} />;
};

export default ProfileSkills;
