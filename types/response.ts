export interface CommonResponse<T = null> {
  statusCode: number;
  errMsg: string;
  infoMsg: string;
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
