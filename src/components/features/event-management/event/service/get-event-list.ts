const baseUrl =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    : "";

export const getEventList = async () => {
    const event = await fetch(
      `${baseUrl}/api/event_management?type=event`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      }
    );
  
    return event.json();
  };