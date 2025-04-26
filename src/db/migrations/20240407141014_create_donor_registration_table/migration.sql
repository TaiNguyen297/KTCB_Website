-- CreateEnum
CREATE TYPE "kindOfDonation" AS ENUM ('MONEY', 'GOODS');

-- CreateTable
CREATE TABLE "DonorRegistration" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "kindOfDonation" "kindOfDonation" NOT NULL,
    "donationImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DonorRegistration_pkey" PRIMARY KEY ("id")
);
