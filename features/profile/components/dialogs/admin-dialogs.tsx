"use client";

import dynamic from "next/dynamic";

/**
 * Owner-only profile editors, code-split so visitors never download them.
 * Named exports are mapped to the default export next/dynamic expects.
 */
export const ImageEditorDialog = dynamic(() =>
  import("./ImageEditorDialog").then((m) => m.ImageEditorDialog),
);
export const ExperiencesEditorDialog = dynamic(() =>
  import("./ExperiencesEditorDialog").then((m) => m.ExperiencesEditorDialog),
);
export const SingleExperienceEditorDialog = dynamic(() =>
  import("./SingleExperienceEditorDialog").then(
    (m) => m.SingleExperienceEditorDialog,
  ),
);
export const TextFieldEditorDialog = dynamic(() =>
  import("./TextFieldEditorDialog").then((m) => m.TextFieldEditorDialog),
);
export const ResumeEditorDialog = dynamic(() => import("./ResumeEditorDialog"));
export const ContactInfoEditorDialog = dynamic(
  () => import("./ContactInfoEditorDialog"),
);
export const EditAboutMessageDialog = dynamic(
  () => import("./EditAboutMessageDialog"),
);
export const ServicesEditorDialog = dynamic(
  () => import("./ServicesEditorDialog"),
);
export const SkillsEditorDialog = dynamic(() => import("./SkillsEditorDialog"));
export const TestimonialsEditorDialog = dynamic(
  () => import("./TestimonialsEditorDialog"),
);
