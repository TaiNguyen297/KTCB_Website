export const getMemberList = async () => {
    const member = await fetch(
      `/api/member_management`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      }
    );
  
    return member.json();
  };