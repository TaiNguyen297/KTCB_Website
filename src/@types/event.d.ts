import { Prisma } from "@prisma/client";
export interface IEvent {
  id: number;
  title: string;
  type: "VOLUNTEER" | "DONATION";
  startDate: string;
  endDate: string;
  location: string;
  mapLink?: string;
  image?: string;
  description: string;
  status: "UPCOMING" | "ONGOING" | "FINISHED";
  eventRegistrations?: any[];
  eventResult?: {
    totalDonation?: number;
    totalParticipant?: number;
    summary?: string;
    resultImages?: string[];
  };
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
