export const getEventList = async () => {
    const event = await fetch(
      `/api/event_management?type=event`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      }
    );
  
    return event.json();
  };