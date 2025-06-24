const baseUrl =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    : "";

import { PostFormValues } from "../PostForm";

export const getPostList = async () => {
  const res = await fetch(`${baseUrl}/api/news_management`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  });
  if (!res.ok) throw new Error("Không lấy được danh sách bài viết");
  return res.json();
};

export const addPost = async (data: PostFormValues) => {
  const res = await fetch(`${baseUrl}/api/news_management`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Không thể thêm bài viết");
  return res.json();
};

export const updatePost = async (data: PostFormValues) => {
  const res = await fetch(`${baseUrl}/api/news_management`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Không thể cập nhật bài viết");
  return res.json();
};

export const deletePost = async (id: number) => {
  const res = await fetch(`${baseUrl}/api/news_management`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Không thể xóa bài viết");
};
