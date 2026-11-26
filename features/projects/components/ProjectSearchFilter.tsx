import { Input } from "@/components/ui/input";
import { PersonalInfoType } from "@/db/schema";
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
  { id: 2, title: "Design & Assistance", key: "virtual", icon: PaletteIcon },
  { id: 3, title: "Others", key: "others", icon: LayoutDashboardIcon },
];

interface Props {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  category: string | null;
  setCategory: Dispatch<SetStateAction<string | null>>;
  personalInfo: PersonalInfoType;
}

export default function ProjectSearchFilter({
  search,
  setSearch,
  category,
  setCategory,
  personalInfo,
}: Props) {
  return (
    <div className="flex w-full flex-col items-start gap-4 rounded-lg bg-card px-5 py-3">
      {/* Search */}
      <div className="flex w-full items-center gap-2">
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
          <div className="flex h-[44px] w-[48px] items-center justify-center rounded-full bg-card">
            <UserIcon className="size-4 text-muted-foreground" />
          </div>
        )}

        <Input
          placeholder="Search projects"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-[48px] rounded-full border-input bg-transparent"
        />
      </div>

      {/* Category */}
      <div className="flex w-full flex-row items-center justify-between gap-3 px-5">
        {categorizations.map((c) => {
          const Icon = c.icon;
          const active = category === c.key;
          return (
            <button
              key={c.id}
              onClick={() => setCategory(active ? null : c.key)}
              className="flex cursor-pointer items-center gap-1 hover:opacity-80"
            >
              <Icon
                className={`size-4 ${
                  c.id === 1
                    ? "text-success"
                    : c.id === 2
                      ? "text-primary"
                      : "text-destructive"
                }`}
              />
              <p
                className={`hidden text-xs font-bold sm:block ${
                  active ? "text-foreground" : "text-muted-foreground"
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
