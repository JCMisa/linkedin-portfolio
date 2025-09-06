"use client";

import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";

const skills = [
  {
    id: 1,
    title: "Programming Languages",
    skills: ["JavaScript", "TypeScript", "C#", "SQL", "Java", "PHP", "Python"],
  },
  {
    id: 2,
    title: "Frameworks & Libraries",
    skills: [
      "Next.js",
      "React Native",
      ".NET Core MVC",
      ".NET Web API",
      "Spring Boot",
      "Pandas",
    ],
  },
  {
    id: 3,
    title: "Databases & Tools",
    skills: [
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
  },
  {
    id: 4,
    title: "Platforms & APIs",
    skills: [
      "Vercel",
      "Clerk Auth",
      "Stripe",
      "Gemini API",
      "YouTube API",
      "Next Auth",
    ],
  },
  {
    id: 5,
    title: "Soft Skills",
    skills: [
      "Problem-solving",
      "Effective Communication",
      "Adaptability",
      "Time Management",
      "Creative Solution Design",
    ],
  },
  {
    id: 6,
    title: "Virtual Assistance",
    skills: [
      "Canva Design",
      "Social Media Management",
      "Video & Podcast Editing",
    ],
  },
  {
    id: 7,
    title: "Data & Analytics",
    skills: [
      "Excel (Basic-Intermediate)",
      "Google Colab (Data Analysis, Machine Learning)",
    ],
  },
  {
    id: 8,
    title: "Web & Mobile Development",
    skills: [
      "Next.js",
      "React Native",
      "No-Code (Lovable)",
      "Payment Integration (Stripe, Clerk, Lemonsqueezy)",
    ],
  },
  {
    id: 9,
    title: "Administrative Support",
    skills: [
      "Admin Dashboards",
      "Clickup (Minimal)",
      "Bookkeeping",
      "Financial Statements",
    ],
  },
  {
    id: 10,
    title: "Communication",
    skills: [
      "Client Connectivity",
      "Insights via YouTube, Email, Facebook, LinkedIn",
    ],
  },
  {
    id: 11,
    title: "SEO",
    skills: ["Keyword Implementation in Website Metadata (Next.js)"],
  },
  {
    id: 12,
    title: "Eagerness to Learn",
    skills: [
      "CMS (WordPress, Wix)",
      "E-commerce (Shopify, GoHigh Level, Hubspot)",
      "Marketing Campaigns",
    ],
  },
];

const ProfileSkills = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`rounded-lg w-full dark:bg-dark flex flex-col justify-between p-[10px] pb-0 px-5 overflow-hidden relative ${
        isExpanded ? "h-auto" : "h-[277px]"
      }`}
    >
      <h2 className="text-2xl font-medium">Skills</h2>

      <div className="mt-5 flex flex-col gap-2 w-full">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className={`w-full flex flex-col py-2 ${
              skill.id === skills.length - 1 ? "" : "border-b"
            }`}
          >
            <p className="font-bold text-sm">{skill.title}</p>
            <span className="text-xs italic text-muted-foreground">
              {skill.skills.join(", ")}
            </span>
          </div>
        ))}
      </div>

      <div
        className="cursor-pointer  flex items-center gap-1 justify-center h-10  border-t absolute bg-white dark:bg-dark z-10 bottom-0 w-full"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <p className="text-sm font-semibold hover:opacity-[0.5] transition-opacity duration-200 ease-linear">
          {isExpanded ? "See Less" : "Show all skills"}
        </p>
        <ArrowRightIcon className="size-5" />
      </div>
    </div>
  );
};

export default ProfileSkills;
