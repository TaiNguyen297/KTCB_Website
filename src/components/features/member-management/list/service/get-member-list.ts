export const getMemberList = async () => {
    const member = await fetch(
      `/api/member_list`,
      {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      }
    );
  
    return member.json();
  };