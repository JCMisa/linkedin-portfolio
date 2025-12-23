declare interface UserType {
  id: number;
  userId: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  remainingContactReq: number;
  createdAt: Date;
  updatedAt: Date;
}

declare interface ProjectType {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  githubLink?: string | null;
  liveLink?: string | null;
  techStacks?: string[] | null;
  category?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

declare interface ProjectInsertedDataType {
  title: string;
  description: string;
  imageUrl: string;
  githubUrl: string;
  liveUrl: string;
  category: string;
}

declare interface CommentUserType {
  id: number;
  name: string;
  image: string | null;
  role?: string | null;
}

declare interface CommentCreateResponse {
  id: string;
  content: string;
  createdAt: Date;
  userId: number;
}

declare interface CommentType {
  id: string;
  content: string;
  createdAt: Date;
  user: CommentUserType;
}

declare interface CommentWithOptionalUser {
  id: string;
  content: string;
  createdAt: Date;
  user: CommentUserType | null;
}

declare interface CertificateType {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  acquiredDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

declare interface CertificateInsertedDataType {
  title: string;
  description: string;
  imageUrl: string;
  acquiredDate: Date;
}

declare interface ChatErrorBody {
  response?: string;
  error?: string;
  retryAfterSeconds?: number;
}

declare interface ContactInfoType {
  id: string;
  city: string;
  province: string;
  country: string;
  email: string;
  contactNumber: string;
  linkedinLink: string;
  portfolioLink: string;
  githubLink: string;
  facebookLink: string;
  instagramLink: string;
  xLink: string;
}
