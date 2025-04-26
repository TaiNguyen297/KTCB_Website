export interface DataResponseInfinite<T extends any[]> {
  data: T;
  pageKey?: number;
}

export type ActionType = "accept" | "reject" | "un_accept";

export interface IBankVietQR {
  id: number;
  name: string;
  short_name: string;
  code: string;
  logo: string;
  created_at: string;
  updated_at: string;
}
