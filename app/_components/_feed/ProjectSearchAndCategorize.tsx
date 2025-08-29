"use client";

import { Input } from "@/components/ui/input";
import {
  BrainCircuitIcon,
  LayoutDashboardIcon,
  PaletteIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const categorizations = [
  {
    id: 1,
    title: "Automation & AI",
    icon: BrainCircuitIcon,
  },
  {
    id: 2,
    title: "Design & Creative",
    icon: PaletteIcon,
  },
  {
    id: 3,
    title: "Others",
    icon: LayoutDashboardIcon,
  },
];

const ProjectSearchAndCategorize = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  return (
    <div className="w-full dark:bg-dark flex flex-col items-start gap-4 rounded-lg py-3 px-5 overflow-hidden">
      {/* search */}
      <div className="flex items-center gap-2 w-full">
        <Image
          src={"/profile-img.jpg"}
          alt="cover-img"
          width={1000}
          height={1000}
          className="w-[48px] h-[48px] object-fill rounded-full"
        />
        <div className="rounded-full w-full h-[48px] border border-neutral-600  flex items-center justify-center">
          <Input
            className="bg-transparent text-gray-500 dark:text-gray-400 text-lg border-none focus:border-none focus:outline-none active:border-none"
            placeholder="Search a project"
            style={{ background: "none", boxShadow: "none" }}
          />
        </div>
      </div>

      {/* categorize */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between px-5 w-full">
        {categorizations.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              className="flex items-center gap-1 cursor-pointer hover:opacity-[0.8] transition-opacity duration-200 ease-in-out"
              onClick={() => setSelectedCategory(category.id)}
            >
              <Icon
                className={`size-4 ${
                  category.id === 1
                    ? "text-green-400"
                    : category.id === 2
                    ? "text-blue-400"
                    : "text-red-400"
                }`}
              />
              <p
                className={`font-bold text-xs truncate ${
                  selectedCategory === category.id
                    ? "text-white"
                    : "text-muted-foreground"
                }`}
              >
                {category.title}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectSearchAndCategorize;
