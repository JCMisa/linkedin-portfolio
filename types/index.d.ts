declare interface UserType {
  id: number;
  userId: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
