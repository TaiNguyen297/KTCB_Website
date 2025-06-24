const baseUrl =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    : "";

// Lấy thông tin vai trò của user
export const getUserRoles = async (userId: number) => {
  const res = await fetch(`${baseUrl}/api/user_roles?userId=${userId}`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  });
  if (!res.ok) throw new Error("Không lấy được thông tin vai trò");
  return res.json();
};

// Lấy tất cả vai trò
export const getAllRoles = async () => {
  const res = await fetch(`${baseUrl}/api/roles`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  });
  if (!res.ok) throw new Error("Không lấy được danh sách vai trò");
  return res.json();
};

// Lấy tất cả permissions
export const getAllPermissions = async () => {
  const res = await fetch(`${baseUrl}/api/permissions`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  });
  if (!res.ok) throw new Error("Không lấy được danh sách quyền hạn");
  return res.json();
};

// Cập nhật vai trò cho user
export const updateUserRole = async (userId: number, roleId: number) => {
  const res = await fetch(`${baseUrl}/api/user_roles`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, roleId }),
  });
  if (!res.ok) throw new Error("Không thể cập nhật vai trò");
  return res.json();
};
