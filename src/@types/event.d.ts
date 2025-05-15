export interface IEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  mapLink?: string;
  image?: string;
  description: string;
  status: "UPCOMING" | "ONGOING" | "FINISHED";
}