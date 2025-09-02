import ProfessionalActivities from "@/app/_components/_activity/ProfessionalActivities";
import ProfileCard from "@/app/_components/_profile/ProfileCard";
import Footer from "@/components/custom/Footer";
import { Timeline } from "@/components/ui/timeline";
import Image from "next/image";
import React from "react";

const ExperiencesPage = () => {
  const data = [
    {
      id: 1,
      title: "2025 - Present",
      content: (
        <div key={1}>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            As a Frontend Developer at Philadelphia Truck Parts, I am building
            and enhancing dynamic, user-friendly interfaces. My focus is on
            translating UI/UX designs into high-quality, pixel-perfect, reusable
            code, ensuring an intuitive and responsive experience. I regularly
            utilize modern frontend technologies such as React, tailwindcss,
            Zustand, and TypeScript to deliver robust and scalable solutions.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {/* // todo: replace images links with this four soon */}
            {/* https://i.ibb.co/6c0SbCzh/ptp-ss-3.jpg
            https://i.ibb.co/2YPxF82M/ptp-ss-2.jpg
            https://i.ibb.co/mVXXtxc1/ptp-ss-1.jpg
            https://i.ibb.co/pq06WfZ/ptp-ss-4.jpg */}
            <Image
              src="https://assets.aceternity.com/templates/startup-1.webp"
              alt="startup template"
              width={500}
              height={500}
              className="blur h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
              placeholder="blur"
              blurDataURL="/blur.jpg"
            />
            <Image
              src="https://assets.aceternity.com/templates/startup-2.webp"
              alt="startup template"
              width={500}
              height={500}
              className="blur h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
              placeholder="blur"
              blurDataURL="/blur.jpg"
            />
            <Image
              src="https://assets.aceternity.com/templates/startup-3.webp"
              alt="startup template"
              width={500}
              height={500}
              className="blur h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
              placeholder="blur"
              blurDataURL="/blur.jpg"
            />
            <Image
              src="https://assets.aceternity.com/templates/startup-4.webp"
              alt="startup template"
              width={500}
              height={500}
              className="blur h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
              placeholder="blur"
              blurDataURL="/blur.jpg"
            />
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Early 2024",
      content: (
        <div key={2}>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            As a Freelance Web Developer, I helped students and individuals
            bring their web projects to life, specializing in creating
            functional and visually appealing websites. I focused on building
            responsive user interfaces and robust back-end systems that were
            tailored to their needs.
          </p>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            My tech stack is built on modern, efficient tools to deliver
            high-quality results. I utilized Next.js and TypeScript for dynamic
            front-end development, while .NET Web API provided a powerful
            back-end framework. For data management, I integrated Neon Database
            with Drizzle ORM to ensure a type-safe and efficient connection. I
            used GitHub for version control and leveraged Vercel for seamless
            deployment and continuous integration/continuous delivery (CI/CD).
            This comprehensive workflow allowed me to consistently deliver
            scalable and reliable web applications.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://i.ibb.co/tT6DqbgD/zeno-img.png"
              alt="hero template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
              placeholder="blur"
              blurDataURL="/blur.jpg"
            />
            <Image
              src="https://i.ibb.co/d4hGRZnD/meowgic-img.png"
              alt="feature template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
              placeholder="blur"
              blurDataURL="/blur.jpg"
            />
            <Image
              src="https://i.ibb.co/zV4x5WcC/loom-img.png"
              alt="bento template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
              placeholder="blur"
              blurDataURL="/blur.jpg"
            />
            <Image
              src="https://i.ibb.co/mCKKq7pp/rhu-img.png"
              alt="cards template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
              placeholder="blur"
              blurDataURL="/blur.jpg"
            />
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "2021 - 2023",
      content: (
        <div key={3}>
          <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Assisted students and individuals with their accounting assignments
            and projects remotely.
          </p>
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
              ✅ Balance Sheet
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
              ✅ Income Statement
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
              ✅ Cash Flow Statement
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
              ✅ Trial Balance
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
              ✅ Financial Statements Analysis
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://tse1.mm.bing.net/th/id/OIP.lRdtLjpAjMcnkblM8T7vegHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
              alt="hero template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
              placeholder="blur"
              blurDataURL="/blur.jpg"
            />
            <Image
              src="https://tse1.mm.bing.net/th/id/OIP.RQ2khwJb-DXbbYTXwhwhQAHaFj?rs=1&pid=ImgDetMain&o=7&rm=3"
              alt="feature template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
              placeholder="blur"
              blurDataURL="/blur.jpg"
            />
            <Image
              src="https://st.depositphotos.com/34422958/52268/i/450/depositphotos_522680612-stock-photo-businessman-points-inscription-financial-statements.jpg"
              alt="bento template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
              placeholder="blur"
              blurDataURL="/blur.jpg"
            />
            <Image
              src="https://accountsbalance.com/wp-content/uploads/2023/08/text-cash-flow-page-notepad-lying-financial-charts-office-desk_284815-5626.jpg"
              alt="cards template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
              placeholder="blur"
              blurDataURL="/blur.jpg"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="relative py-14 lg:py-18 px-6 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto relative flex flex-col lg:flex-row gap-6">
        {/* experiences timeline */}
        <div className="relative w-full overflow-clip rounded-lg">
          <Timeline data={data} />
        </div>

        {/* profile and latest certificates and footer - fixed */}
        <div className="w-full lg:w-[320px] rounded-lg flex flex-col gap-2">
          <ProfileCard />

          <div className="sticky top-[73px]">
            <ProfessionalActivities />
            <div className="mt-4">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ExperiencesPage;
