export interface ArticleCreateRequest {
  title: string;
  username: string;
  tags: string[];
  content: string;
}

export interface BrandCreateRequest {
  name: string;
  workAmount: number;
  officialUrl: string;
  dissolution: boolean;
}

export interface SystemTodoCreateRequest {
  systemName: string;
  title: string;
  detail: string;
  status: number;
  deadline: string | null; // 為了後續處理所以這邊定義是string
  urgency: number;
  createdName: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TodoRequest {
  owner: string;
  topic: string;
  title: string;
  status: number;
  deadline: Date | null;
  createName: string;
  updateName: string;
}

export interface TodoTopicRequest {
  topicName: string;
  topicOwner: string;
  updatedAt: string | Date;
  updateName: string;
}

export interface UserUpdateRequest {
  id: number;
  username: string;
  email: string;
  exp: number;
  management: boolean;
  created_at: string | Date;
  updated_at: string | Date;
  update_name: string;
  avatar: string;
}

export interface TagCreateRequest {
  name: string;
  iconName: string;
}
