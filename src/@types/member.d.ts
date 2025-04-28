import { Prisma } from '@prisma/client';
export interface IMember {
  full_name: string;
  birthday: string;
  email: string;
  phone_number: string;
  address: string;
  work_place: string;
  has_social_activities: string;
  memories?: string;
  position: string;
  hope_to_receive: string;
}

export interface IOfficialMember {
  full_name: string;
  birthday: string;
  email: string;
  phone_number: string;
  address: string;
  work_place: string;
  bank_account: string;
  bank_name: string;
}

export interface IDonor {}
import { Prisma } from '@prisma/client';

export type MemberWithPosition = Prisma.MemberGetPayload<{
  include: { position: true, team: true }
}>
