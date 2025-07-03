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
import EditIcon from "@mui/icons-material/Edit";
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
import { EventEditModal } from "./EventEditModal";
import { EventStatus } from "@prisma/client";
import { SelectBox } from "@/components/shared/inputs";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { EventCreationForm } from "./EventCreationForm";

export interface IEventManagement extends IEvent {
  id: number;
  title: string;
  status: EventStatus;
  date: string;
  location: string;
  mapLink: string;
  image: string;
  description: string;
  _count?: {
    eventRegistrations: number;
  };
  postId?: number; // Thêm trường postId nếu cần liên kết với bài viết
}

interface StatusOption {
  label: string;
  value: EventStatus;
}

const StatusEvent: StatusOption[] = [
  { label: "Sắp diễn ra", value: EventStatus.UPCOMING },
  { label: "Đang diễn ra", value: EventStatus.ONGOING },
  { label: "Đã kết thúc", value: EventStatus.FINISHED },
];

const TEXT_TOAST = {
  [ACTIONS["REJECT"]]: "Xóa sự kiện thành công",
};

const TEXT_CONFIRM = {
  [ACTIONS["REJECT"]]: "Bạn có chắc muốn xóa sự kiện này?",
};

const EventManagementTable = (props: { data: IEventManagement[] }) => {
  const { data } = props;
  // Tách riêng 2 loại sự kiện
  const volunteerEvents = (data || []).filter(e => e.type === "VOLUNTEER");
  const donationEvents = (data || []).filter(e => e.type === "DONATION");

  const { showModal } = useGlobalModalContext();
  const [opened, { open, close }] = useDisclosure();
  const [openedDetail, { open: openDetail, close: closeDetail }] = useDisclosure();
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure();
  const [openedCreate, { open: openCreate, close: closeCreate }] = useDisclosure();
  const [openToast, setOpenToast] = useState(false);
  const { mutateAsync: deleteEvent, isLoading: isDeletingEvent } = useDeleteEvent();
  const [rowSelected, setRowSelected] = useState<IEventManagement>();
  const [action, setAction] = useState<ActionType>();

  const handleRefreshEvents = () => {
    // This will be called after successfully creating a new event
    showModal(MODAL_TYPES.MODAL_SUCCESS, {
      content: "Tạo sự kiện thành công, danh sách đã được cập nhật",
    });
  };

  const handleOpenModal = (event: IEventManagement, action?: ActionType) => {
    openDetail();
    setRowSelected(event);
    setAction(action);
  };

  const handleOpenEditModal = (event: IEventManagement) => {
    setRowSelected(event);
    openEdit();
  };

  const handleEditSuccess = () => {
    showModal(MODAL_TYPES.MODAL_SUCCESS, {
      content: "Cập nhật sự kiện thành công",
    });
  };

  // Tách columns cho từng loại sự kiện
  const volunteerColumns = useMemo<MRT_ColumnDef<IEventManagement>[]>
  (
    () => [
      { accessorKey: "title", header: "Tên sự kiện", size: 200, Cell: (props) => <EllipsisCell {...props} /> },
      { accessorKey: "status", header: "Trạng thái", size: 120, Cell: (props) => <EllipsisCell {...props} /> },
      { accessorKey: "startDate", header: "Bắt đầu", size: 120, Cell: ({ cell }) => cell.getValue() ? new Date(cell.getValue<string>()).toLocaleDateString("vi") : "" },
      { accessorKey: "endDate", header: "Kết thúc", size: 120, Cell: ({ cell }) => cell.getValue() ? new Date(cell.getValue<string>()).toLocaleDateString("vi") : "" },
      { accessorKey: "location", header: "Địa điểm", size: 200, Cell: (props) => <EllipsisCell {...props} /> },
      { accessorKey: "_count.eventRegistrations", header: "Số người tham gia", enableEditing: false, size: 150, Cell: ({ row }) => row.original._count?.eventRegistrations || 0 },
    ],
    []
  );

  const donationColumns = useMemo<MRT_ColumnDef<IEventManagement>[]>
  (
    () => [
      { accessorKey: "title", header: "Tên chiến dịch", size: 200, Cell: (props) => <EllipsisCell {...props} /> },
      { accessorKey: "status", header: "Trạng thái", size: 120, Cell: (props) => <EllipsisCell {...props} /> },
      { accessorKey: "startDate", header: "Bắt đầu", size: 120, Cell: ({ cell }) => cell.getValue() ? new Date(cell.getValue<string>()).toLocaleDateString("vi") : "" },
      { accessorKey: "endDate", header: "Kết thúc", size: 120, Cell: ({ cell }) => cell.getValue() ? new Date(cell.getValue<string>()).toLocaleDateString("vi") : "" },
      { accessorKey: "goalAmount", header: "Mục tiêu (VNĐ)", size: 150, Cell: ({ cell }) => cell.getValue() ? Number(cell.getValue()).toLocaleString("vi-VN") : "" },
      { accessorKey: "amount", header: "Đã quyên góp (VNĐ)", size: 150, Cell: ({ cell }) => cell.getValue() ? Number(cell.getValue()).toLocaleString("vi-VN") : "" },
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

  const volunteerTable = useTable({
    columns: volunteerColumns,
    data: volunteerEvents,
    enableRowActions: true,
    enableEditing: true,
    renderRowActions: ({ row }) => (
      <div className="flex items-center justify-center">
        <Tooltip title="Xem chi tiết">
          <IconButton onClick={() => handleOpenModal(row.original)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Chỉnh sửa">
          <IconButton onClick={() => handleOpenEditModal(row.original)}>
            <EditIcon />
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

  const donationTable = useTable({
    columns: donationColumns,
    data: donationEvents,
    enableRowActions: true,
    enableEditing: true,
    renderRowActions: ({ row }) => (
      <div className="flex items-center justify-center">
        <Tooltip title="Xem chi tiết">
          <IconButton onClick={() => handleOpenModal(row.original)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Chỉnh sửa">
          <IconButton onClick={() => handleOpenEditModal(row.original)}>
            <EditIcon />
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
      <div className="flex items-center justify-between mb-2">
        <Typography variant="h5" fontWeight="bold">Sự kiện tình nguyện</Typography>
        <Button variant="contained" color="primary" onClick={openCreate}>
          + Tạo mới sự kiện
        </Button>
      </div>
      <MaterialReactTable table={volunteerTable} />
      <Typography variant="h5" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>Chiến dịch gây quỹ</Typography>
      <MaterialReactTable table={donationTable} />
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

      <EventEditModal
        open={openedEdit}
        onClose={closeEdit}
        event={rowSelected || null}
        onSuccess={handleEditSuccess}
      />

      <EventCreationForm
        open={openedCreate}
        onClose={closeCreate}
        onSuccess={handleRefreshEvents}
      />
    </div>
  );
};

export { EventManagementTable };
