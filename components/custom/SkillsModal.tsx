import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ActivityIcon } from "lucide-react";
import { ArcTimeline } from "../magicui/arc-timeline";

const skills = [
  {
    time: "Web & Mobile Development",
    steps: [
      {
        icon: <span>💻</span>,
        content:
          "Full-Stack Development: Developed 5 websites and mobile apps using Next.js and React Native, optimizing performance by 25% and achieving an 85% retention rate[cite: 88].",
      },
      {
        icon: <span>🚀</span>,
        content:
          "RESTful APIs: Developed 5+ RESTful APIs with .NET Web API and Spring Boot, which enabled seamless integration with services like Stripe and Clerk, and improved transaction success rates by 85%[cite: 18].",
      },
      {
        icon: <span>🔒</span>,
        content:
          "Authentication: Implemented Clerk Auth for secure user management, which reduced unauthorized access incidents to 0%[cite: 38].",
      },
      {
        icon: <span>🔗</span>,
        content:
          "Database Optimization: Designed and optimized database schemas with MySQL, PostgreSQL, and Neon Serverless DB, reducing query execution time by 25% using Drizzle ORM[cite: 17].",
      },
    ],
  },
  {
    time: "Virtual Assistance",
    steps: [
      {
        icon: <span>🎨</span>,
        content:
          "Canva Design: Crafted 20+ designs, increasing visual engagement by 30% and achieving a 90% retention rate for personal projects and clients[cite: 83].",
      },
      {
        icon: <span>📱</span>,
        content:
          "Social Media Management: Managed social media for over 10 initiatives, growing follower bases by 25% with consistent scheduling[cite: 84].",
      },
      {
        icon: <span>🎬</span>,
        content:
          "Video & Podcast Editing: Edited 15+ videos and 10+ podcasts, improving content quality and reducing processing time by 20%[cite: 85].",
      },
    ],
  },
  {
    time: "Data & Analytics",
    steps: [
      {
        icon: <span>📊</span>,
        content:
          "Data Analysis: Utilized Excel for data tracking and Google Colab for analytics, delivering insights that enhanced project outcomes by 15%[cite: 87]. I also conducted data analysis with Python and Pandas, which increased client decision-making efficiency by 40%[cite: 19].",
      },
      {
        icon: <span>📈</span>,
        content:
          "Business Analytics: Completed a certificate in Business Analytics with Excel from Simplilearn SkillUp[cite: 93].",
      },
    ],
  },
  {
    time: "Administrative Support",
    steps: [
      {
        icon: <span>✅</span>,
        content:
          "Task Management: Managed admin dashboards for a university organization, boosting efficiency for over 50 members by 90%[cite: 89].",
      },
      {
        icon: <span>📚</span>,
        content:
          "Bookkeeping: Assisted with simple bookkeeping and financial statements, achieving 100% task completion while supporting 20+ colleagues remotely[cite: 90].",
      },
    ],
  },
  {
    time: "Communication & SEO",
    steps: [
      {
        icon: <span>🗣️</span>,
        content:
          "Client Communication: Supported 30+ individuals and 3 professional clients via chat and calls, maintaining a 95% client satisfaction rate[cite: 86].",
      },
      {
        icon: <span>🔍</span>,
        content:
          "SEO: Implemented keyword strategies in website metadata to optimize performance and improve retention rates[cite: 88].",
      },
    ],
  },
];

const SkillsModal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <div
          className={
            "w-[80px] h-[52px] flex flex-col items-center justify-center border-b text-muted-foreground cursor-pointer -ml-2"
          }
        >
          <ActivityIcon className="size-5" />
          <span className={"text-[12px] leading-none mt-1 "}>Skills</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="hidden">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <div>
          <ArcTimeline data={skills} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SkillsModal;
