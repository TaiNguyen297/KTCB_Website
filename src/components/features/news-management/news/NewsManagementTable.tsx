import { INews } from "@/@types/news";
import { TEAM_NAME } from "@/utils/constants";
import { Button, Stack } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { format } from "date-fns";
import React, { FC, useState } from "react";
import { NewsManagementDetail } from "./NewsManagementDetail";
import { NewsContentEditor } from "./NewsContentEditor";
import EditNoteIcon from "@mui/icons-material/EditNote";

interface Column {
  id: "title" | "time" | "author" | "teams" | "highlight" | "actions";
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
}

const columns: readonly Column[] = [
  { id: "title", label: "Tiêu đề", minWidth: 200 },
  { id: "time", label: "Thời gian đăng", minWidth: 100 },
  { id: "author", label: "Tác giả", minWidth: 100 },
  { id: "teams", label: "Teams", minWidth: 120 },
  { id: "highlight", label: "Bài viết nổi bật", minWidth: 100, align: "center" },
  { id: "actions", label: "Thao tác", minWidth: 100, align: "center" },
];

const getTeamDisplayName = (teamValue: string) => {
  switch (teamValue) {
    case TEAM_NAME.CUNG_BE_TRAI_NGHIEM:
      return "Cùng bé trải nghiệm";
    case TEAM_NAME.KIEN_TRUC_SU_TINH_NGUYEN:
      return "Kiến trúc sư tình nguyện";
    case TEAM_NAME.TRUYEN_THONG:
      return "Truyền thông";
    case TEAM_NAME.NOI_DUNG:
      return "Nội dung";
    case TEAM_NAME.QUY_KTCB:
      return "Quỹ KTCB";
    default:
      return teamValue;
  }
};

interface NewsManagementTableProps {
  data: INews[];
  onDelete: (slug: string) => void;
  onEdit: (news: INews) => void;
  onEditContent?: (news: INews) => void;
}

export const NewsManagementTable: FC<NewsManagementTableProps> = ({ 
  data, 
  onDelete, 
  onEdit,
  onEditContent 
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [contentEditorOpen, setContentEditorOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<INews | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Stack sx={{ width: "100%" }}>
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        }}
      >
        <TableContainer sx={{ maxHeight: "calc(100vh - 300px)" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  style={{
                    fontWeight: "600",
                    minWidth: 50,
                  }}
                >
                  STT
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || "left"}
                    style={{
                      minWidth: column.minWidth,
                      fontWeight: "600",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((news, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={news.slug}
                    >
                      <TableCell align="center">
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="line-clamp-2" title={news.title}>
                          {news.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(news.time), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        {news.author || "Không có"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {news.team.map((team, i) => (
                            <span 
                              key={i} 
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
                            >
                              {getTeamDisplayName(team)}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        {news.is_highlight ? (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                            Có
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                            Không
                          </span>
                        )}
                      </TableCell>                      <TableCell align="center">
                        <div className="flex items-center justify-center gap-2">
                          <NewsManagementDetail 
                            data={news} 
                            onDelete={onDelete} 
                            onEdit={onEdit} 
                          />
                          <Button
                            size="small"
                            startIcon={<EditNoteIcon />}
                            variant="outlined"
                            onClick={() => {
                              setSelectedNews(news);
                              setContentEditorOpen(true);
                            }}
                            title="Chỉnh sửa nội dung chi tiết"
                          >
                            Nội dung
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>      <NewsContentEditor 
        isOpen={contentEditorOpen}
        onClose={() => {
          setContentEditorOpen(false);
          setSelectedNews(null);
        }}
        news={selectedNews}
      />
    </Stack>
  );
};
