import type { UserGameErogs } from "@/types/response";
import type { UserGameErogsFlat } from "@/types/common";

export const flattenUserGameErogs = (data: UserGameErogs): UserGameErogsFlat => {
  return {
    userId: data.userId,
    gameErogsId: data.gameErogsId,
    hasPlayed: data.hasPlayed,
    inWish: data.inWish,
    completedAt: data.completedAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    gameName: data.gameErogs.name,
    brandId: data.gameErogs.brandErogs.id,
    brandName: data.gameErogs.brandErogs.name,
  };
};
