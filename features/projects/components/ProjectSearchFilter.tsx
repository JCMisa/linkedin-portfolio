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
import { cn } from "@/lib/utils";

const categorizations = [
  {
    id: 1,
    title: "Software & AI",
    key: "software",
    icon: BrainCircuitIcon,
    iconClass: "text-success",
  },
  {
    id: 2,
    title: "Design & Assistance",
    key: "virtual",
    icon: PaletteIcon,
    iconClass: "text-primary",
  },
  {
    id: 3,
    title: "Others",
    key: "others",
    icon: LayoutDashboardIcon,
    iconClass: "text-warning",
  },
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
    <div className="flex w-full flex-col items-start gap-4 rounded-lg border bg-card px-5 py-3">
      {/* Search */}
      <div className="flex w-full items-center gap-2">
        {personalInfo?.profileImg ? (
          <Image
            src={personalInfo.profileImg}
            alt=""
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted">
            <UserIcon className="size-4 text-muted-foreground" />
          </div>
        )}

        <Input
          placeholder="Search projects"
          aria-label="Search projects"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-[48px] rounded-full border-input bg-transparent"
        />
      </div>

      {/* Category filter pills (LinkedIn search-filter style) */}
      <div
        role="group"
        aria-label="Filter by category"
        className="no-scrollbar -mx-1 flex w-full gap-2 overflow-x-auto px-1"
      >
        {categorizations.map((c) => {
          const Icon = c.icon;
          const active = category === c.key;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(active ? null : c.key)}
              className={cn(
                "flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground hover:bg-primary-hover"
                  : "border-input text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className={cn("size-4", !active && c.iconClass)} />
              {c.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
