const baseUrl =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    : "";

export const getMemberList = async () => {
    const member = await fetch(
      `${baseUrl}/api/member_management`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      }
    );
  
    return member.json();
  };