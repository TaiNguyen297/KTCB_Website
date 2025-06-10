import { INews } from "@/@types/news";
import { DeleteNewsDto, UpdateNewsDto, CreateNewsDto } from "@/pages/api/news_management";
import axios from "axios";

export const getNewsList = async () => {
  try {
    const response = await axios.get("/api/news_management");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching news list:", error);
    throw error;
  }
};

export const createNews = async (data: CreateNewsDto) => {
  try {
    const response = await axios.post("/api/news_management", data);
    return response.data;
  } catch (error) {
    console.error("Error creating news:", error);
    throw error;
  }
};

export const updateNews = async (data: UpdateNewsDto) => {
  try {
    const response = await axios.put("/api/news_management", data);
    return response.data;
  } catch (error) {
    console.error("Error updating news:", error);
    throw error;
  }
};

export const deleteNews = async (slug: string) => {
  try {
    const data: DeleteNewsDto = { slug };
    const response = await axios.delete("/api/news_management", { data });
    return response.data;
  } catch (error) {
    console.error("Error deleting news:", error);
    throw error;
  }
};
