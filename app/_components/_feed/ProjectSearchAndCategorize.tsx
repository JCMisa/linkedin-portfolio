import { Input } from "@/components/ui/input";
import {
  BrainCircuitIcon,
  LayoutDashboardIcon,
  PaletteIcon,
} from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

const categorizations = [
  { id: 1, title: "Software & AI", key: "software", icon: BrainCircuitIcon },
  { id: 2, title: "Design & Assitance", key: "virtual", icon: PaletteIcon },
  { id: 3, title: "Others", key: "others", icon: LayoutDashboardIcon },
];

interface Props {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  category: string | null;
  setCategory: Dispatch<SetStateAction<string | null>>;
}

export default function ProjectSearchAndCategorize({
  search,
  setSearch,
  category,
  setCategory,
}: Props) {
  return (
    <div className="w-full dark:bg-dark flex flex-col items-start gap-4 rounded-lg py-3 px-5">
      {/* Search */}
      <div className="flex items-center gap-2 w-full">
        <Image
          src="/profile-img-3.png"
          alt="avatar"
          width={48}
          height={48}
          className="rounded-full"
        />
        <Input
          placeholder="Search a project"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent rounded-full border-black dark:border-white h-[48px]"
        />
      </div>

      {/* Category */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between px-5 w-full">
        {categorizations.map((c) => {
          const Icon = c.icon;
          const active = category === c.key;
          return (
            <button
              key={c.id}
              onClick={() => setCategory(active ? null : c.key)}
              className="flex items-center gap-1 cursor-pointer hover:opacity-80"
            >
              <Icon
                className={`size-4 ${
                  c.id === 1
                    ? "text-green-400"
                    : c.id === 2
                    ? "text-blue-400"
                    : "text-red-400"
                }`}
              />
              <p
                className={`font-bold text-xs ${
                  active ? "text-white" : "text-muted-foreground"
                }`}
              >
                {c.title}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
