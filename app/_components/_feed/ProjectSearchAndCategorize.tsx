import { Input } from "@/components/ui/input";
import { PersonalInfoType } from "@/config/schema";
import {
  BrainCircuitIcon,
  LayoutDashboardIcon,
  PaletteIcon,
  UserIcon,
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
  personalInfo: PersonalInfoType;
}

export default function ProjectSearchAndCategorize({
  search,
  setSearch,
  category,
  setCategory,
  personalInfo,
}: Props) {
  return (
    <div className="w-full bg-neutral-100 dark:bg-dark flex flex-col items-start gap-4 rounded-lg py-3 px-5">
      {/* Search */}
      <div className="flex items-center gap-2 w-full">
        {personalInfo?.profileImg ? (
          <Image
            src={personalInfo.profileImg}
            alt={personalInfo.name || "avatar"}
            width={48} // real pixels
            height={44} // real pixels
            className="rounded-full object-cover"
            style={{ width: 48, height: 44, maxWidth: 48, maxHeight: 44 }}
            draggable={false}
          />
        ) : (
          <div className="w-[48px] h-[44px] rounded-full bg-neutral-100 dark:bg-dark flex items-center justify-center">
            <UserIcon className="size-4 text-neutral-500 dark:text-neutral-400" />
          </div>
        )}

        <Input
          placeholder="Search a project"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent rounded-full border-black dark:border-white h-[48px]"
        />
      </div>

      {/* Category */}
      <div className="flex flex-row gap-3 items-center justify-between px-5 w-full">
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
                className={`font-bold text-xs hidden sm:block ${
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
