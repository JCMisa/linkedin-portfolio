import { LinkPreview } from "@/components/ui/link-preview";
import React from "react";

const ProfileAboutMessage = () => {
  return (
    <div className="rounded-lg w-full bg-neutral-100 dark:bg-dark flex flex-col p-[10px] px-5">
      <h2 className="text-2xl font-medium">About</h2>

      <div className="mt-5 w-full text-sm text-muted-foreground">
        My journey in tech began with a passion for building things that matter.
        I&apos;ve had the opportunity to develop responsive web and mobile
        applications for clients, achieving a 90% client retention rate by
        utilizing Next.js, React Native, and .NET frameworks. I enjoy
        architecting solutions from the ground up, whether it&apos;s optimizing
        database schemas with tools like MySQL and PostgreSQL or developing
        robust RESTful APIs with .NET Web API and FastAPI with Modal to ensure
        seamless service integration.
        <br />
        <br />
        I also have a background in data analytics and simple bookkeeping, using
        tools like Python, Pandas, and Excel to deliver actionable insights that
        have increased client decision-making efficiency by 40%. My skills also
        extend to virtual assistance, where I&apos;ve crafted designs with
        Canva, managed social media, and edited videos and podcasts to boost
        engagement and quality. I&apos;m also a fast learner, always eager to
        explore new technologies, from CMS platforms like WordPress to
        e-commerce solutions like Shopify.
        <br />
        <br />
        I&apos;m constantly working on new projects that showcase my skills,
        like TechTrail, an AI-powered learning management system, Zeno, a
        real-time code editor, and Odeon, a web application that help users
        craft music powered by AI. I&apos;ve also earned multiple certifications
        in areas such as AWS, Project Management, and Business Analytics.
        <br />
        <br />
        I&apos;m always looking for opportunities to learn and collaborate on
        innovative projects. Feel free to connect with me on{" "}
        <LinkPreview
          url="https://www.linkedin.com/in/john-carlo-misa-80a1b5208/"
          className="text-xs font-semibold !text-blue-500"
        >
          Linkedin
        </LinkPreview>{" "}
        or explore my works on my{" "}
        <LinkPreview
          url="https://jcm-portfolio.vercel.app/"
          className="text-xs font-semibold !text-blue-500"
        >
          portfolio
        </LinkPreview>{" "}
        and{" "}
        <LinkPreview
          url="https://github.com/JCMisa"
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
