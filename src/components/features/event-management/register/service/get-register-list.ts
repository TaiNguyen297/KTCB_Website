export const getRegisterList = async () => {
    const register = await fetch(
      `/api/event_management?type=registration`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      }
    );
  
    return register.json();
  };