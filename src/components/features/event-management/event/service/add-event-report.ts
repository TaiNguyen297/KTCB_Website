const baseUrl = typeof window === "undefined"
  ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  : "";

export const addEventReport = async (data: any) => {
  const res = await fetch(`${baseUrl}/api/event_management?type=eventResult`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Không thể thêm báo cáo sự kiện");
  return res.json();
};
