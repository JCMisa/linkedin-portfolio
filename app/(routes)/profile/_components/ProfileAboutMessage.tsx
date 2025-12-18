import { LinkPreview } from "@/components/ui/link-preview";
import { PersonalInfoType } from "@/config/schema";
import { getPersonalInfo } from "@/lib/actions/profileInfo";
import React from "react";
import EditAboutMessageDialog from "./dialogs/EditAboutMessageDialog";

const FALLBACK_ABOUT = `My journey in tech began with a passion for building things that matter. I've had the opportunity to develop responsive web and mobile applications for clients, achieving a 90% client retention rate by utilizing Next.js, React Native, and .NET frameworks. I enjoy architecting solutions from the ground up, whether it's optimizing database schemas with tools like MySQL and PostgreSQL or developing robust RESTful APIs with .NET Web API and FastAPI with Modal to ensure seamless service integration.

I also have a background in data analytics and simple bookkeeping, using tools like Python, Pandas, and Excel to deliver actionable insights that have increased client decision-making efficiency by 40%. My skills also extend to virtual assistance, where I've crafted designs with Canva, managed social media, and edited videos and podcasts to boost engagement and quality. I'm also a fast learner, always eager to explore new technologies, from CMS platforms like WordPress to e-commerce solutions like Shopify.

I'm constantly working on new projects that showcase my skills, like TechTrail, an AI-powered learning management system, Zeno, a real-time code editor, and Odeon, a web application that help users craft music powered by AI. I've also earned multiple certifications in areas such as AWS, Project Management, and Business Analytics.`;

const ProfileAboutMessage = async ({ userRole }: { userRole: string }) => {
  const personalInfo: PersonalInfoType | null = await getPersonalInfo();

  if (!personalInfo) {
    return null;
  }

  const displayAbout = personalInfo.about || FALLBACK_ABOUT;

  return (
    <div className="rounded-lg w-full bg-neutral-100 dark:bg-dark flex flex-col p-[10px] px-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between">
        <h2 className="text-2xl font-medium">About Me</h2>
        {(userRole === "admin" || userRole === "owner") && (
          <EditAboutMessageDialog currentAbout={personalInfo.about || ""} />
        )}
      </div>

      <div className="mt-5 w-full text-sm text-muted-foreground">
        <div className="whitespace-pre-wrap">{displayAbout}</div>
        <br />
        I&apos;m always looking for opportunities to learn and collaborate on
        innovative projects. Feel free to connect with me on{" "}
        <LinkPreview
          url={
            personalInfo.linkedinLink ||
            "https://www.linkedin.com/in/john-carlo-misa-80a1b5208/"
          }
          className="text-xs font-semibold !text-blue-500"
        >
          Linkedin
        </LinkPreview>{" "}
        or explore my works on my{" "}
        <LinkPreview
          url={
            personalInfo.portfolioLink || "https://jcm-portfolio.vercel.app/"
          }
          className="text-xs font-semibold !text-blue-500"
        >
          portfolio
        </LinkPreview>{" "}
        and{" "}
        <LinkPreview
          url={personalInfo.githubLink || "https://github.com/JCMisa"}
          className="text-xs font-semibold !text-blue-500"
        >
          github
        </LinkPreview>
        .
      </div>
    </div>
  );
};

export default ProfileAboutMessage;
