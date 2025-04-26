-- AlterTable
ALTER TABLE "MemberRegistration" ADD COLUMN     "interviewId" INTEGER;

-- CreateTable
CREATE TABLE "Interview" (
    "id" SERIAL NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "linkGGmeet" TEXT NOT NULL,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemberRegistration" ADD CONSTRAINT "MemberRegistration_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE SET NULL ON UPDATE CASCADE;
