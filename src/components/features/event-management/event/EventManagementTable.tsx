import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_Row,
  MRT_TableOptions,
  type MRT_ColumnDef,
} from "material-react-table";
import { useTable } from "@/libs/hooks/useTable";
import { IconButton, Tooltip, Typography, Button } from "@mui/material";
import { IEvent } from "@/@types/event";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ClearIcon from "@mui/icons-material/Clear";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { useDisclosure } from "@/libs/hooks/useDisclosure";
import { ActionType } from "@/@types/common";
import { ACTIONS } from "@/utils/constants";
import ToastSuccess from "@/components/shared/toasts/ToastSuccess";
import { ModalConfirm } from "@/components/shared/modals";
import { EllipsisCell } from "@/components/shared/table";
import { useUpdateEvent } from "../event/hooks/useUpdateEvent";
import { useDeleteEvent } from "../event/hooks/useDeleteEvent";
import { MODAL_TYPES, useGlobalModalContext } from "../../global-modal/GlobalModal";
import { EventManagementDetail } from "./EventManagementDetail";

export interface IEventManagement extends IEvent {
  id: number;
}

const TEXT_TOAST = {
  [ACTIONS["REJECT"]]: "Xóa sự kiện thành công",
};

const TEXT_CONFIRM = {
  [ACTIONS["REJECT"]]: "Bạn có chắc muốn xóa sự kiện này?",
};

const EventManagementTable = (props: { data: IEventManagement[] }) => {
  const { data } = props;
  const { showModal } = useGlobalModalContext();
  const [opened, { open, close }] = useDisclosure();
  const [openedDetail, { open: openDetail, close: closeDetail }] = useDisclosure();
  const [openToast, setOpenToast] = useState(false);
  const { mutateAsync: updateEvent, isLoading: isUpdatingEvent } = useUpdateEvent();
  const { mutateAsync: deleteEvent, isLoading: isDeletingEvent } = useDeleteEvent();
  const [rowSelected, setRowSelected] = useState<IEventManagement>();
  const [action, setAction] = useState<ActionType>();

  const handleOpenModal = (event: IEventManagement, action?: ActionType) => {
    openDetail();
    setRowSelected(event);
    setAction(action);
  };

  const columns = useMemo<MRT_ColumnDef<IEventManagement>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Tên sự kiện",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorFn: (rowData: any) =>
          new Date(rowData.date).toLocaleDateString("vi"),
        id: "date",
        header: "Ngày tổ chức",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorKey: "location",
        header: "Địa điểm",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
    ],
    []
  );

  const handleConfirm = () => {
    setOpenToast(true);
    closeDetail();
    close();
  };

  const handleDeleteEvent = async (row: MRT_Row<IEventManagement>) => {
    const eventId = row.original.id;
    if (!eventId) return;
    try {
      await deleteEvent({ id: eventId });
      showModal(MODAL_TYPES.MODAL_SUCCESS, {
        content: TEXT_TOAST[ACTIONS["REJECT"]],
      });
    } catch (error) {
      console.error("Lỗi khi xóa sự kiện:", error);
    }
  };

   const handleSaveEvent: MRT_TableOptions<IEventManagement>["onEditingRowSave"] =
    async ({ values, table }) => {
      console.log("values", values);
      await updateEvent({
        id: values.id,
        title: values.title,
        status: values.status,
        date: values.date,
        location: values.location,
      });
      table.setEditingRow(null); // Thoát chế độ chỉnh sửa
    };

  const table = useTable({
    columns,
    data: data || [],
    enableRowActions: true,
    onEditingRowSave: handleSaveEvent,
    renderTopToolbar: () => <div />,
    renderBottomToolbar: () => <div />,
    renderRowActions: ({ row }) => (
      <div className="flex items-center justify-center">
        <Tooltip title="Xem chi tiết">
          <IconButton onClick={() => handleOpenModal(row.original)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>

           <Tooltip title="Chỉnh sửa vị trí">
                  <IconButton onClick={() => table.setEditingRow(row)}>
                    <SyncAltIcon />
                  </IconButton>
                </Tooltip>

        <Tooltip title="Xóa sự kiện">
          <IconButton
            onClick={() => {
              showModal(MODAL_TYPES.MODAL_CONFIRM, {
                content: TEXT_CONFIRM[ACTIONS["REJECT"]],
                onConfirm: () => handleDeleteEvent(row),
              });
            }}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </div>
    ),
    positionActionsColumn: "last",
    
  });

  return (
    <div className="min-h-[520px] flex flex-col gap-4">
      <Typography fontSize={28} fontWeight="bold">
        Quản lý sự kiện
      </Typography>

       <div className="flex items-center justify-end">
              <Button
                variant="contained"
                sx={{
                  width: "fit-content",
                }}
                color="secondary"
              >
                Tạo mới sự kiện
              </Button>
            </div>

      <MaterialReactTable table={table} />

      <ToastSuccess
        open={openToast}
        onClose={() => setOpenToast(false)}
        heading="Thành công"
        content={`${TEXT_TOAST[action as ActionType]}`}
      />

      <ModalConfirm
        title={`Thông báo xác nhận`}
        open={opened}
        onClose={close}
        content={`${TEXT_CONFIRM[action as ActionType]}`}
        onConfirm={handleConfirm}
      />

      {rowSelected && (
        <EventManagementDetail
          open={openedDetail}
          onClose={closeDetail}
          data={rowSelected!}
        />
      )}
    </div>
  );
};

export { EventManagementTable };
