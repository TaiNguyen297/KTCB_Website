interface Team {
  imgUrl: string;
  position: string;
}

export type TeamName =
  | "cung-be-trai-nghiem"
  | "kien-truc-su-tinh-nguyen"
  | "truyen-thong"
  | "noi-dung"
  | "quy-ktcb";

export interface QQuote {
  title: string;
  content: string;
  banner_url: string;
}

export interface QQuoteData {
  [key: string]: QQuote;
}
