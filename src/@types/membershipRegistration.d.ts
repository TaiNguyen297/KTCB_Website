import { Prisma } from '@prisma/client';

export type MemberRegistrationWithPosition = Prisma.MemberRegistrationGetPayload<{
  include: { position: true , interview: true }
}>
