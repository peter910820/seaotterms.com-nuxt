export interface MessageData {
  statusCode: number;
  content: string;
  errCode: string;
}

export interface UserGameErogsFlat {
  userId: string;
  gameErogsId: number;
  hasPlayed: boolean;
  inWish: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  gameName: string;
  brandId: number;
  brandName: string;
}
