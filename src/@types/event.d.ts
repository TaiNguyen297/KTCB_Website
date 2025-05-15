import { Prisma } from "@prisma/client";
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

export interface IEventRegistration {
  id: number;
  fullName: string;
  birthday: string;
  phoneNumber: string;
  email: string;
  address: string;
  workPlace: string;
}

export type IEventRegistrationWithEvent = Prisma.EventRegistrationGetPayload<{
  include: {
    event: true;
  };
}>;
