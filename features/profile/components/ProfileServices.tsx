import React from "react";
import { getPersonalInfo } from "@/features/profile/queries";
import { PersonalInfoType } from "@/db/schema";
import { ServicesEditorDialog } from "@/features/profile/components/dialogs/admin-dialogs";
import { EmptyState } from "@/components/shared/EmptyState";
import { BriefcaseBusinessIcon } from "lucide-react";

const ProfileServices = async ({ userRole }: { userRole: string }) => {
  const personalInfo: PersonalInfoType | null = await getPersonalInfo();

  if (!personalInfo) {
    return null;
  }

  const isOwner = userRole === "admin" || userRole === "owner";
  const services = personalInfo.services || [];

  return (
    <div className="flex w-full flex-col rounded-lg bg-card p-[10px] px-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-medium">Services</h2>
        {isOwner && <ServicesEditorDialog currentServices={services} />}
      </div>
      <div className="mt-5 w-full">
        {services.length > 0 ? (
          <p className="text-sm leading-relaxed font-bold text-muted-foreground">
            {services.map((service, index) => (
              <React.Fragment key={service}>
                {service}
                {index < services.length - 1 && " 🟢 "}
              </React.Fragment>
            ))}
          </p>
        ) : (
          <EmptyState
            size="compact"
            icon={BriefcaseBusinessIcon}
            title="No services listed yet"
          />
        )}
      </div>
    </div>
  );
};

export default ProfileServices;
