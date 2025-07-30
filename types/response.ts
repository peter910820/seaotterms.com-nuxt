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
