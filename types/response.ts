import type { UserType } from "@/types/userTypes";

export interface CommonResponse<T = null> {
  statusCode: number;
  errMsg: string;
  infoMsg: string;
  userInfo: UserType;
  data: T;
}

export interface ArticleQuery {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: TagQuery[];
}

export interface TagQuery {
  name: string;
  iconName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandQuery {
  id: number;
  name: string;
  workAmount: number;
  officialUrl: string;
  dissolution: boolean;
  createdAt: Date;
  createdName: string;
  updatedAt: Date;
  updatedName: string;
}

export interface GameQuery {
  id: number;
  name: string;
  chineseName: string;
  brandId: number;
  allAges: boolean;
  releaseDate: string; // Date
  OpUrl: string;
  gameDescription: string;
  createdAt: Date;
  createdName: string;
  updatedAt: Date;
  updatedName: string;
}

export interface TodoTopicQuery {
  topicName: string;
  topicOwner: string;
  updatedAt: Date;
  updateName: string | null;
}

export interface TodoQuery {
  id: number;
  owner: string;
  topic: string;
  title: string;
  status: number;
  deadline: Date | null;
  createdAt: Date;
  createName: string;
  updatedAt: Date | null;
  updateName: string | null;
}

export interface SystemTodoQuery {
  id: number;
  systemName: string;
  title: string;
  detail: string; // it may be an empty string
  status: number;
  deadline: Date | null;
  urgency: number;
  createdAt: Date;
  createdName: string;
  updatedAt: Date | null;
  updatedName: string | null;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  exp: number;
  management: boolean;
  created_at: Date;
  updated_at: Date;
  update_name: string;
  avatar: string;
  dataVersion: number;
}
