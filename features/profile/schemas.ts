import { z } from "zod";

/** Dates inside JSON columns arrive as Date or ISO string; store as ISO string. */
const jsonDate = z.union([z.date(), z.string()]).transform((v) => new Date(v));

/** Free-text link fields (kept lenient: existing data may lack a protocol). */
const link = z.string().trim().max(500);

export const imageUrlSchema = z.object({
  imageUrl: z.url().nullable(),
});

export const nameSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
});

export const industryRoleSchema = z.object({
  industryRole: z.string().trim().min(1, "Role is required").max(150),
});

export const resumeSchema = z.object({
  itResumeLink: link,
  vaResumeLink: link,
});

export const contactInfoSchema = z.object({
  city: z.string().trim().max(100),
  province: z.string().trim().max(100),
  country: z.string().trim().max(100),
  email: z.email("Enter a valid email"),
  contactNumber: z.string().trim().max(30),
  linkedinLink: link,
  portfolioLink: link,
  githubLink: link,
  facebookLink: link,
  instagramLink: link,
  xLink: link,
});
export type ContactInfoInput = z.input<typeof contactInfoSchema>;

export const aboutSchema = z.object({
  about: z.string().trim().min(1, "About can't be empty").max(5000),
});

export const servicesSchema = z.object({
  services: z.array(z.string().trim().min(1).max(100)).max(50),
});

export const experienceSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(5000),
  bannerImg: z.string().trim().max(1000),
  dateFrom: z.string().max(50),
  dateTo: z.string().max(50),
  createdAt: jsonDate,
  updatedAt: jsonDate,
});
export const experiencesSchema = z.object({
  experiences: z.array(experienceSchema).max(100),
});

export const skillCategorySchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Category title is required").max(100),
  description: z.string().trim().max(1000),
  items: z.array(z.string().trim().min(1).max(100)).max(100),
  createdAt: jsonDate,
  updatedAt: jsonDate,
});
export const skillsSchema = z.object({
  skills: z.array(skillCategorySchema).max(50),
});

export const testimonialSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Name is required").max(100),
  profileImg: z.string().trim().max(1000),
  company: z.string().trim().max(150),
  comment: z.string().trim().min(1, "Testimonial can't be empty").max(2000),
  createdAt: jsonDate,
  updatedAt: jsonDate,
});
export const testimonialsSchema = z.object({
  topVoices: z.array(testimonialSchema).max(50),
});
