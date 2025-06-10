const baseUrl =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    : "";

export const getRegisterList = async () => {
  const register = await fetch(
    `${baseUrl}/api/event_management?type=registration`,
    {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    }
  );

  return register.json();
};