// import { INews } from "@/@types/news";
// import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
// import axios from "axios";
// import dynamic from "next/dynamic";
// import { FC, useEffect, useState } from "react";
// import "react-quill/dist/quill.snow.css";

// // Import ReactQuill dynamically to avoid SSR issues
// // const ReactQuill = dynamic(
// //   async () => {
// //     const { default: RQ } = await import("react-quill");
// //     return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
// //   },
// //   { ssr: false }
// // );

// interface NewsContentEditorProps {
//   isOpen: boolean;
//   onClose: () => void;
//   news: INews | null;
// }

// export const NewsContentEditor: FC<NewsContentEditorProps> = ({ isOpen, onClose, news }) => {
//   const [content, setContent] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isSaving, setIsSaving] = useState<boolean>(false);

//   useEffect(() => {
//     if (isOpen && news?.slug) {
//       loadContent();
//     } else {
//       setContent("");
//     }
//   }, [isOpen, news]);

//   const loadContent = async () => {
//     if (!news?.slug) return;
    
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`/api/news_content?slug=${news.slug}`);
//     //   setContent(response.data.htmlContent || "");
//     } catch (error) {
//       console.error("Error loading content:", error);
//       setContent("");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!news?.slug) return;
    
//     setIsSaving(true);
//     try {
//       await axios.post("/api/news_content", {
//         slug: news.slug,
//         htmlContent: content,
//       });
//       onClose();
//     } catch (error) {
//       console.error("Error saving content:", error);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const modules = {
//     toolbar: [
//       [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
//       [{size: []}],
//       ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//       [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
//       ['link', 'image', 'video'],
//       ['clean'],
//       [{ 'color': [] }, { 'background': [] }],
//       [{ 'align': [] }],
//     ],
//   };

//   const formats = [
//     'header', 'font', 'size',
//     'bold', 'italic', 'underline', 'strike', 'blockquote',
//     'list', 'bullet', 'indent',
//     'link', 'image', 'video',
//     'color', 'background', 'align'
//   ];

//   return (
//     <Dialog 
//       open={isOpen} 
//       onClose={onClose} 
//       maxWidth="lg" 
//       fullWidth
//       PaperProps={{
//         sx: {
//           minHeight: "80vh",
//           maxHeight: "90vh",
//           display: "flex",
//           flexDirection: "column",
//         },
//       }}
//     >
//       <DialogTitle>
//         {news ? `Chỉnh sửa nội dung - ${news.title}` : "Chỉnh sửa nội dung"}
//       </DialogTitle>
//       <DialogContent sx={{ flexGrow: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
//         {isLoading ? (
//           <div className="flex items-center justify-center h-full">
//             <p>Đang tải nội dung...</p>
//           </div>
//         ) : (
//           <div className="h-full flex flex-col">
//             <div className="mb-2">
//               <p className="text-gray-600 italic">
//                 Sử dụng trình soạn thảo để định dạng nội dung bài viết. Có thể chèn hình ảnh, video và định dạng văn bản.
//               </p>
//             </div>
//             <div className="flex-grow overflow-hidden">
//               {isOpen && ( // Only render when dialog is open to avoid SSR issues
//                 <ReactQuill
//                   theme="snow"
//                   value={content}
//                   onChange={setContent}
//                   modules={modules}
//                   formats={formats}
//                   style={{ height: "calc(100% - 42px)", overflow: "auto" }} // 42px is the height of the toolbar
//                 />
//               )}
//             </div>
//           </div>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Hủy</Button>
//         <Button 
//           onClick={handleSave} 
//           variant="contained" 
//           color="primary" 
//           disabled={isSaving}
//         >
//           {isSaving ? "Đang lưu..." : "Lưu nội dung"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };
