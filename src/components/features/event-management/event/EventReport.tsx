import React, { useMemo, useState } from "react";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { useTable } from "@/libs/hooks/useTable";
import { IconButton, Tooltip, Dialog, DialogContent } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { useDisclosure } from "@/libs/hooks/useDisclosure";
import { useRouter } from "next/router";
import EventReportForm from "./EventReportForm";
import { Chip } from "@mui/material";
import { addEventReport } from "./service/add-event-report";
import { updateEventReport } from "./service/update-event-report";
import { MODAL_TYPES, useGlobalModalContext } from "../../global-modal/GlobalModal";

interface EventReportProps {
  data?: any[];
  onReportAdded?: () => void;
}

export const EventReport = ({ data, onReportAdded }: EventReportProps) => {
  const finishedEvents = data?.filter(e => e.status === "FINISHED") || [];
  const [openedDetail, { open: openDetail, close: closeDetail }] = useDisclosure();
  const [rowSelected, setRowSelected] = useState<any>();
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const { showModal } = useGlobalModalContext();

  const handleOpenModal = (event: any) => {
    openDetail();
    setRowSelected(event);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    closeDetail();
    setRowSelected(undefined);
  };

  const handleSubmitReport = async (formData: any) => {
    try {
      if (rowSelected?.eventResult?.id) {
        // Nếu là sửa báo cáo
        await updateEventReport({ ...formData, id: rowSelected.eventResult.id });
        showModal(MODAL_TYPES.MODAL_SUCCESS, { content: "Cập nhật báo cáo thành công" });
      } else {
        // Nếu là thêm mới
        await addEventReport(formData);
        showModal(MODAL_TYPES.MODAL_SUCCESS, { content: "Thêm báo cáo thành công" });
      }
      if (onReportAdded) onReportAdded();
    } catch (error) {
      showModal(MODAL_TYPES.MODAL_SUCCESS, { content: "Thao tác thất bại" });
    }
    setShowForm(false);
    closeDetail();
  };

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Tên sự kiện",
        size: 200,
      },
      {
        accessorKey: "type",
        header: "Loại sự kiện",
        size: 120,
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue() === "VOLUNTEER" ? "Tình nguyện" : "Quyên góp"}
            color={cell.getValue() === "VOLUNTEER" ? "primary" : "success"}
            size="small"
          />
        ),
      },
      {
        accessorKey: "endDate",
        header: "Ngày kết thúc",
        size: 120,
        Cell: ({ cell }) => cell.getValue() ? new Date(cell.getValue<string>()).toLocaleDateString() : "",
      },
      {
        accessorKey: "eventResult",
        header: "Đã có báo cáo?",
        size: 100,
        Cell: ({ cell }) => cell.getValue() ? "Có" : "Chưa có",
        enableSorting: false,
      },
    ],
    []
  );

  const table = useTable({
    columns,
    data: finishedEvents,
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row }) => {
      const event = row.original;
      return event.eventResult ? (
        <div className="flex items-center justify-center gap-2">
          <Tooltip title="Sửa báo cáo">
            <IconButton color="warning" onClick={() => handleOpenModal(event)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa báo cáo">
            <IconButton color="error">
              <ClearIcon />
            </IconButton>
          </Tooltip>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <Tooltip title="Thêm báo cáo mới">
            <IconButton color="primary" onClick={() => handleOpenModal(event)}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
      );
    },
  });

  return (
    <div className="min-h-[520px] flex flex-col gap-4">
      <Dialog open={showForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogContent>
          <EventReportForm 
            onSubmit={handleSubmitReport} 
            onCancel={handleCloseForm} 
            eventId={rowSelected?.id} 
            type={rowSelected?.type}
            initialValues={rowSelected?.eventResult}
          />
        </DialogContent>
      </Dialog>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default EventReport;
