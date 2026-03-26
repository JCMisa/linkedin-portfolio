import { ProjectsType } from "@/config/schema";

export interface OptimizedProject extends ProjectsType {
  likesCount: number;
  hasLiked: boolean;
  commentsCount: number;
  latestCommenter: { name: string; image: string } | null;
}
