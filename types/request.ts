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
