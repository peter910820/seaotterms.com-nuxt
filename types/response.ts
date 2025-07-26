export interface CommonResponse<T = null> {
  statusCode: number;
  errMsg: string;
  infoMsg: string;
  data: T;
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
