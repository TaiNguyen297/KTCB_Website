import { MemberRegistrationStatus } from "@prisma/client";

interface Props {
  status?: MemberRegistrationStatus;
}

const baseUrl =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    : "";

export const getMemberRegistration = async ({ status }: Props) => {
  const registrations = await fetch(
    `${baseUrl}/api/member_registration${status ? `?status=${status}` : ""}`,
    {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    }
  );

  return registrations.json();
};

export const getPersonInterview = async ({ status }: Props) => {
  const interview = await fetch(
    `${baseUrl}/api/recruitment_management${status ? `?status=${status}` : ""}`,
    {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    }
  );

  return interview.json();
};
