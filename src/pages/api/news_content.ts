import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export interface SaveNewsContentDto {
  slug: string;
  htmlContent: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const { slug, htmlContent } = req.body as SaveNewsContentDto;
        
        if (!slug || !htmlContent) {
          return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
        }

        // Create directory if it doesn't exist
        const dirPath = path.join(process.cwd(), "src/utils/data/html");
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }

        // Write content to file
        const filePath = path.join(dirPath, `${slug}.ts`);
        fs.writeFileSync(filePath, `export default \`${htmlContent}\`;`);

        res.status(200).json({ message: "Lưu nội dung bài viết thành công" });
      } catch (error) {
        console.error("Error saving news content:", error);
        res.status(500).json({ message: "Đã có lỗi xảy ra khi lưu nội dung bài viết" });
      }
      break;
    case "GET":
      try {
        const { slug } = req.query;
        
        if (!slug || Array.isArray(slug)) {
          return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
        }

        const filePath = path.join(process.cwd(), `src/utils/data/html/${slug}.ts`);
        
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ message: "Không tìm thấy nội dung bài viết" });
        }

        // Read content from file
        const fileContent = fs.readFileSync(filePath, "utf8");
        // Remove export default and backticks
        const htmlContent = fileContent.replace(/export default `(.*)`;/, "$1");

        res.status(200).json({ htmlContent });
      } catch (error) {
        console.error("Error getting news content:", error);
        res.status(500).json({ message: "Đã có lỗi xảy ra khi lấy nội dung bài viết" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
