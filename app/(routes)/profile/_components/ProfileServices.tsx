import React from "react";
import { getPersonalInfo } from "@/lib/actions/profileInfo";
import { PersonalInfoType } from "@/config/schema";
import ServicesEditorDialog from "./dialogs/ServicesEditorDialog";

const ProfileServices = async ({ userRole }: { userRole: string }) => {
  const personalInfo: PersonalInfoType | null = await getPersonalInfo();

  if (!personalInfo) {
    return null;
  }

  const isOwner = userRole === "admin" || userRole === "owner";
  const services = personalInfo.services || [];

  return (
    <div className="rounded-lg w-full bg-neutral-100 dark:bg-dark flex flex-col p-[10px] px-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-medium">Services</h2>
        {isOwner && <ServicesEditorDialog currentServices={services} />}
      </div>
      <div className="mt-5 w-full">
        {services.length > 0 ? (
          <p className="font-bold text-sm text-muted-foreground leading-relaxed">
            {services.map((service, index) => (
              <React.Fragment key={service}>
                {service}
                {index < services.length - 1 && " 🟢 "}
              </React.Fragment>
            ))}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No services listed yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileServices;
