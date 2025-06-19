const baseUrl =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    : "";

export const getEventReportById = async (id: string | number) => {
  const res = await fetch(
    `${baseUrl}/api/event_management?type=event&id=${id}`,
    {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    }
  );
  if (!res.ok) throw new Error("Không lấy được dữ liệu báo cáo sự kiện");
  return res.json();
};
