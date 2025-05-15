import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useTable } from "@/libs/hooks/useTable";
import { IconButton, Tooltip } from "@mui/material";
import { useDisclosure } from "@/libs/hooks/useDisclosure";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { EllipsisCell } from "@/components/shared/table";
import { format } from "date-fns";
import { RegisterDetail } from "./RegisterDetail";

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

export const RegisterTable = ({ data }: RegisterTableProps) => {
  const [openedDetail, { open: openDetail, close: closeDetail }] =
    useDisclosure();
  const [rowSelected, setRowSelected] = useState<IEventRegistration>();

  const handleOpenModal = (registration: IEventRegistration) => {
    openDetail();
    setRowSelected(registration);
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
      <div className="flex items-center justify-center">
        <Tooltip title="Xem chi tiết">
          <IconButton onClick={() => handleOpenModal(row.original)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      </div>
    ),
  });

  return (
    <div className="min-h-[520px] flex flex-col gap-4">
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
