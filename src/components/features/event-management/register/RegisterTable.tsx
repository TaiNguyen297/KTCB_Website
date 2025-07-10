import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_Row,
  type MRT_ColumnDef,
} from "material-react-table";
import { useTable } from "@/libs/hooks/useTable";
import { IconButton, Tooltip, Typography, Button } from "@mui/material";
import { useDisclosure } from "@/libs/hooks/useDisclosure";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { EllipsisCell } from "@/components/shared/table";
import { format } from "date-fns";
import { RegisterDetail } from "./RegisterDetail";
import ToastSuccess from "@/components/shared/toasts/ToastSuccess";
import { ModalConfirm } from "@/components/shared/modals";
import { useEventRegistrationAction } from "./hooks/useEventRegistrationAction";
import { ActionType } from "@/@types/common";
import { ACTIONS } from "@/utils/constants";
import { MODAL_TYPES, useGlobalModalContext } from "../../global-modal/GlobalModal";


export interface IEventRegistration {
  id: number;
  fullName: string;
  birthday: string;
  phoneNumber: string;
  email: string;
  address: string;
  workPlace: string;
  eventId: number;
  event: {
    title: string;
  };
}

interface RegisterTableProps {
  data: IEventRegistration[];
}

const TEXT_TOAST = {
  [ACTIONS["ACCEPT"]]: "Duyệt đăng ký thành công",
  [ACTIONS["REJECT"]]: "Từ chối đăng ký thành công",
};

const TEXT_CONFIRM = {
  [ACTIONS["ACCEPT"]]: "Bạn có chắc muốn duyệt đăng ký này?",
  [ACTIONS["REJECT"]]: "Bạn có chắc muốn từ chối đăng ký này?",
};

export const RegisterTable = ({ data }: RegisterTableProps) => {
  const { showModal } = useGlobalModalContext();
  const [openedDetail, { open: openDetail, close: closeDetail }] = useDisclosure();
  const [rowSelected, setRowSelected] = useState<IEventRegistration>();
  const [action, setAction] = useState<ActionType>();

  // Sử dụng custom hook
  const { mutateAsync: registrationAction, isLoading: isProcessing } = useEventRegistrationAction();

  const handleOpenModal = (registration: IEventRegistration) => {
    openDetail();
    setRowSelected(registration);
  };

  const handleApproveRegistration = async (row: MRT_Row<IEventRegistration>) => {
    const registrationId = row.original.id;
    if (!registrationId) return;
    
    try {
      await registrationAction({
        id: registrationId,
        action: "approve"
      });
      
      showModal(MODAL_TYPES.MODAL_SUCCESS, {
        content: TEXT_TOAST[ACTIONS["ACCEPT"]],
      });
    } catch (error) {
      console.error("Lỗi khi duyệt đăng ký:", error);
      showModal(MODAL_TYPES.MODAL_SUCCESS, {
        content: "Có lỗi xảy ra khi duyệt đăng ký. Vui lòng thử lại.",
      });
    }
  };

  const handleRejectRegistration = async (row: MRT_Row<IEventRegistration>) => {
    const registrationId = row.original.id;
    if (!registrationId) return;
    
    try {
      await registrationAction({
        id: registrationId,
        action: "reject"
      });
      
      showModal(MODAL_TYPES.MODAL_SUCCESS, {
        content: TEXT_TOAST[ACTIONS["REJECT"]],
      });
    } catch (error) {
      console.error("Lỗi khi từ chối đăng ký:", error);
      showModal(MODAL_TYPES.MODAL_SUCCESS, {
        content: "Có lỗi xảy ra khi từ chối đăng ký. Vui lòng thử lại.",
      });
    }
  };

  const columns = useMemo<MRT_ColumnDef<IEventRegistration>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Họ và tên",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorFn: (row) => format(new Date(row.birthday), "dd/MM/yyyy"),
        id: "birthday",
        header: "Ngày sinh",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorKey: "phoneNumber",
        header: "Số điện thoại",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorKey: "workPlace",
        header: "Nơi công tác",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorKey: "event.title",
        header: "Sự kiện đăng ký",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
    ],
    []
  );

  const table = useTable({
    columns,
    data: data || [],
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <Tooltip title="Xem chi tiết">
          <IconButton onClick={() => handleOpenModal(row.original)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Duyệt">
          <IconButton 
            color="success" 
            disabled={isProcessing}
            onClick={() => {
              showModal(MODAL_TYPES.MODAL_CONFIRM, {
                content: TEXT_CONFIRM[ACTIONS["ACCEPT"]],
                onConfirm: () => handleApproveRegistration(row),
              });
            }}
          >
            <CheckIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Từ chối">
          <IconButton 
            color="error" 
            disabled={isProcessing}
            onClick={() => {
              showModal(MODAL_TYPES.MODAL_CONFIRM, {
                content: TEXT_CONFIRM[ACTIONS["REJECT"]],
                onConfirm: () => handleRejectRegistration(row),
              });
            }}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </div>
    ),
  });

  return (
    <div className="min-h-[520px] flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <Typography variant="h5" fontWeight="bold">
          Quản lý đăng ký sự kiện
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tổng cộng: {data?.length || 0} đăng ký
        </Typography>
      </div>
      
      <MaterialReactTable table={table} />
      
      {rowSelected && openedDetail && (
        <RegisterDetail
          open={openedDetail}
          onClose={closeDetail}
          data={rowSelected}
        />
      )}
    </div>
  );
};
