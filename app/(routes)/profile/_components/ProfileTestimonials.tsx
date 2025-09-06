import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export const testimonials = [
  {
    id: 1,
    name: "Creds",
    username: "@personal-portfolio1",
    body: "Great achievement John carlo Misa! You have hit a great milestone! Keep aiming for the highest and reaching for the stars! We are here to applaud your extraordinary efforts and celebrate with you! 🥳🥳🥳",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    id: 2,
    name: "GreatStack 🎓",
    username: "@netflix-clone1",
    body: "Awesome job! John 👏 Loved it. Keep up the great work.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    id: 3,
    name: "Krishna",
    username: "@netflix-clone2",
    body: "Like it 👏👏",
    img: "https://avatar.vercel.sh/john",
  },
  {
    id: 4,
    name: "Soumya",
    username: "@netflix-clone3",
    body: "Nice work 👍",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    id: 5,
    name: "GreatStack 🎓",
    username: "@dictionairy1",
    body: "Congratulations on launching dictionAIry John Carlo Misa! Excited to see how dictionAIry evolves! 🚀",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    id: 6,
    name: "Malavika",
    username: "@dictionairy2",
    body: "Have you tried integrating different APIs into your projects, and what challenges did you face?",
    img: "https://avatar.vercel.sh/john",
  },
  {
    id: 7,
    name: "JavaScript Mastery",
    username: "@curatech1",
    body: "Well done, John! Glad you enjoyed the tutorial! 🔥",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    id: 8,
    name: "JavaScript Mastery",
    username: "@applceclone1",
    body: "Amazing work! Well done, John - thanks for recommending us 🙌",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    id: 9,
    name: "JavaScript Mastery",
    username: "@animated-portfolio1",
    body: "Well done, John! 🔥",
    img: "https://avatar.vercel.sh/john",
  },
  {
    id: 10,
    name: "JavaScript Mastery",
    username: "@aora1",
    body: "Well done! 🔥",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    id: 11,
    name: "JavaScript Mastery",
    username: "@ignite1",
    body: "Well done for completing this project! 🔥",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    id: 12,
    name: "Jaffer",
    username: "@techtrail1",
    body: "The concept of personalized learning powered by AI is truly revolutionary, especially with the ability to generate custom reviewers for students.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    id: 13,
    name: "Jaffer",
    username: "@techtrail2",
    body: "John Carlo Misa Great insights, ! The prompt engineering techniques you're using with the Gemini AI model are really solid for ensuring the content is both relevant and tailored.",
    img: "https://avatar.vercel.sh/jack",
  },
];

// export const testimonials = [
//   {
//     name: "Jack",
//     username: "@jack",
//     body: "I've never seen anything like this before. It's amazing. I love it.",
//     img: "https://avatar.vercel.sh/jack",
//   },
//   {
//     name: "Jill",
//     username: "@jill",
//     body: "I don't know what to say. I'm speechless. This is amazing.",
//     img: "https://avatar.vercel.sh/jill",
//   },
//   {
//     name: "John",
//     username: "@john",
//     body: "I'm at a loss for words. This is amazing. I love it.",
//     img: "https://avatar.vercel.sh/john",
//   },
//   {
//     name: "Jane",
//     username: "@jane",
//     body: "I'm at a loss for words. This is amazing. I love it.",
//     img: "https://avatar.vercel.sh/jane",
//   },
//   {
//     name: "Jenny",
//     username: "@jenny",
//     body: "I'm at a loss for words. This is amazing. I love it.",
//     img: "https://avatar.vercel.sh/jenny",
//   },
//   {
//     name: "James",
//     username: "@james",
//     body: "I'm at a loss for words. This is amazing. I love it.",
//     img: "https://avatar.vercel.sh/james",
//   },
// ];

const ProfileTestimonials = () => {
  return (
    <div className="rounded-lg w-full dark:bg-dark flex flex-col p-[10px] px-5">
      <h2 className="text-2xl font-medium">Top Voices</h2>

      {/* testimonials carousel */}
      <Carousel className="mt-5 px-5">
        <CarouselContent>
          {testimonials
            .sort((a, b) => b.id - a.id)
            .slice(0, 6)
            .map((item, index) => (
              <CarouselItem key={index} className="basis-1/2 w-full">
                <div className="flex items-start gap-2">
                  <Image
                    src={item.img}
                    alt="profile"
                    width={1000}
                    height={1000}
                    className="object-cover w-10 h-10 rounded-full"
                  />

                  <div className="flex flex-col">
                    <h3 className="text-sm font-bold">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.body}</p>
                    <span className="text-xs text-muted-foreground italic">
                      ~ {item.username}
                    </span>
                  </div>
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="!-left-4" />
        <CarouselNext className="!-right-4" />
      </Carousel>
    </div>
  );
};

export default ProfileTestimonials;
