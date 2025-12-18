import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { getPersonalInfo } from "@/lib/actions/profileInfo";
import { PersonalInfoType } from "@/config/schema";
import TestimonialsEditorDialog from "./dialogs/TestimonialsEditorDialog";

export const fallbackTestimonials = [
  {
    id: "1",
    name: "Creds",
    company: "@personal-portfolio1",
    comment:
      "Great achievement John carlo Misa! You have hit a great milestone! Keep aiming for the highest and reaching for the stars! We are here to applaud your extraordinary efforts and celebrate with you! 🥳🥳🥳",
    profileImg: "https://avatar.vercel.sh/jack",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "GreatStack 🎓",
    company: "@netflix-clone1",
    comment: "Awesome job! John 👏 Loved it. Keep up the great work.",
    profileImg: "https://avatar.vercel.sh/jill",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Krishna",
    company: "@netflix-clone2",
    comment: "Like it 👏👏",
    profileImg: "https://avatar.vercel.sh/john",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Soumya",
    company: "@netflix-clone3",
    comment: "Nice work 👍",
    profileImg: "https://avatar.vercel.sh/jack",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "GreatStack 🎓",
    company: "@dictionairy1",
    comment:
      "Congratulations on launching dictionAIry John Carlo Misa! Excited to see how dictionAIry evolves! 🚀",
    profileImg: "https://avatar.vercel.sh/jill",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Malavika",
    company: "@dictionairy2",
    comment:
      "Have you tried integrating different APIs into your projects, and what challenges did you face?",
    profileImg: "https://avatar.vercel.sh/john",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "JavaScript Mastery",
    company: "@curatech1",
    comment: "Well done, John! Glad you enjoyed the tutorial! 🔥",
    profileImg: "https://avatar.vercel.sh/jack",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "JavaScript Mastery",
    company: "@applceclone1",
    comment: "Amazing work! Well done, John - thanks for recommending us 🙌",
    profileImg: "https://avatar.vercel.sh/jill",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "9",
    name: "JavaScript Mastery",
    company: "@animated-portfolio1",
    comment: "Well done, John! 🔥",
    profileImg: "https://avatar.vercel.sh/john",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "10",
    name: "JavaScript Mastery",
    company: "@aora1",
    comment: "Well done! 🔥",
    profileImg: "https://avatar.vercel.sh/jack",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "11",
    name: "JavaScript Mastery",
    company: "@ignite1",
    comment: "Well done for completing this project! 🔥",
    profileImg: "https://avatar.vercel.sh/jill",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "12",
    name: "Jaffer",
    company: "@techtrail1",
    comment:
      "The concept of personalized learning powered by AI is truly revolutionary, especially with the ability to generate custom reviewers for students.",
    profileImg: "https://avatar.vercel.sh/john",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "13",
    name: "Jaffer",
    company: "@techtrail2",
    comment:
      "John Carlo Misa Great insights, ! The prompt engineering techniques you're using with the Gemini AI model are really solid for ensuring the content is both relevant and tailored.",
    profileImg: "https://avatar.vercel.sh/jack",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ProfileTestimonials = async ({ userRole }: { userRole: string }) => {
  const personalInfo: PersonalInfoType | null = await getPersonalInfo();

  if (!personalInfo) {
    return null;
  }

  const isOwner = userRole === "admin" || userRole === "owner";
  const displayTestimonials =
    personalInfo.topVoices && personalInfo.topVoices.length > 0
      ? personalInfo.topVoices
      : fallbackTestimonials;

  return (
    <div className="rounded-lg w-full bg-neutral-100 dark:bg-dark flex flex-col p-[10px] px-5 overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-medium">Top Voices</h2>
        {isOwner && (
          <TestimonialsEditorDialog
            currentTestimonials={personalInfo.topVoices || []}
          />
        )}
      </div>

      {/* testimonials carousel */}
      <Carousel className="mt-5 px-5 w-full">
        <CarouselContent>
          {displayTestimonials
            .sort((a, b) => {
              const idValA = parseInt(a.id) || 0;
              const idValB = parseInt(b.id) || 0;
              return idValB - idValA;
            })
            .slice(0, 10)
            .map((item, index) => (
              <CarouselItem
                key={index}
                className="basis-full md:basis-1/2 lg:basis-1/2"
              >
                <div className="flex items-start gap-2 h-full">
                  <Image
                    src={item.profileImg || "/empty-img.webp"}
                    alt="profile"
                    width={100}
                    height={100}
                    className="object-cover size-10 rounded-full shrink-0"
                  />

                  <div className="flex flex-col min-w-0 flex-1">
                    <h3 className="text-sm font-bold truncate">{item.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.comment}
                    </p>
                    <span className="text-[10px] text-muted-foreground italic truncate">
                      ~ {item.company}
                    </span>
                  </div>
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
        <div className="hidden sm:block">
          <CarouselPrevious className="!-left-4" />
          <CarouselNext className="!-right-4" />
        </div>
      </Carousel>
    </div>
  );
};

export default ProfileTestimonials;
