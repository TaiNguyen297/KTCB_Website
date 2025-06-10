import { INews } from "@/@types/news";
import { NextApiRequest, NextApiResponse } from "next";
import newsData from "@/utils/data/json/news.json";
import fs from "fs";
import path from "path";

export enum NewsStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface CreateNewsDto {
  title: string;
  description: string;
  banner_url: string;
  author: string;
  tags: string[];
  team: string;
  is_highlight?: boolean;
}

export interface UpdateNewsDto {
  slug: string;
  title: string;
  description: string;
  banner_url: string;
  author: string;
  tags: string[];
  team: string;
  is_highlight?: boolean;
}

export interface DeleteNewsDto {
  slug: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      // Get all news
      try {
        res.status(200).json({ data: newsData });
      } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra" });
      }
      break;
    case "POST":
      // Create a new news article
      try {
        const newsPath = path.join(process.cwd(), "src/utils/data/json/news.json");
        const data = req.body as CreateNewsDto;
        
        const newNews: INews = {
          ...data,
          time: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
          slug: generateSlug(data.title),
        };

        const updatedNewsData = [newNews, ...newsData];
        fs.writeFileSync(newsPath, JSON.stringify(updatedNewsData, null, 2));

        res.status(201).json({ message: "Tạo bài viết thành công", data: newNews });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Đã có lỗi xảy ra khi tạo bài viết" });
      }
      break;
    case "PUT":
      // Update a news article
      try {
        const newsPath = path.join(process.cwd(), "src/utils/data/json/news.json");
        const data = req.body as UpdateNewsDto;
        
        const updatedNewsData = (newsData as INews[]).map((news) => {
          if (news.slug === data.slug) {
            return {
              ...news,
              title: data.title,
              description: data.description,
              banner_url: data.banner_url,
              author: data.author,
              tags: data.tags,
              team: data.team,
              is_highlight: data.is_highlight,
            };
          }
          return news;
        });

        fs.writeFileSync(newsPath, JSON.stringify(updatedNewsData, null, 2));

        res.status(200).json({ message: "Cập nhật bài viết thành công" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Đã có lỗi xảy ra khi cập nhật bài viết" });
      }
      break;
    case "DELETE":
      // Delete a news article
      try {
        const newsPath = path.join(process.cwd(), "src/utils/data/json/news.json");
        const data = req.body as DeleteNewsDto;
        
        const updatedNewsData = (newsData as INews[]).filter((news) => news.slug !== data.slug);
        
        fs.writeFileSync(newsPath, JSON.stringify(updatedNewsData, null, 2));

        res.status(200).json({ message: "Xóa bài viết thành công" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Đã có lỗi xảy ra khi xóa bài viết" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
    .replace(/ì|í|ị|ỉ|ĩ/g, "i")
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
    .replace(/đ/g, "d")
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .trim();
}
