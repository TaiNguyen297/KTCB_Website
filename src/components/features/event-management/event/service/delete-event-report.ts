const baseUrl = typeof window === "undefined"
  ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  : "";

export const deleteEventReport = async (id: number) => {
  const res = await fetch(`${baseUrl}/api/event_management?type=eventResult&id=${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Không thể xóa báo cáo sự kiện");
  return res.json();
};
