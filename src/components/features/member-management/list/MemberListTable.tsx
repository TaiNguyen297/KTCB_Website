import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_TableOptions,
  type MRT_ColumnDef,
} from "material-react-table";
import { useTable } from "@/libs/hooks/useTable";
import { IOfficialMember } from "@/@types/member";
import { Button, IconButton, Tooltip, Typography } from "@mui/material";
import { useDisclosure } from "@/libs/hooks/useDisclosure";
import { MemberDetail } from "./MemberDetail";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { EllipsisCell } from "@/components/shared/table";
import { ClearIcon } from "@mui/x-date-pickers";
import { ACTIONS } from "@/utils/constants";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import {
  MODAL_TYPES,
  useGlobalModalContext,
} from "../../global-modal/GlobalModal";
import { SelectBox } from "@/components/shared/inputs";
// import { useUpdateMember } from "./hooks/useUpdateMember";
import { MemberWithPosition } from "@/@types/member";

export interface IMemberList extends IOfficialMember {
  id: string;
  team?: string;
  position?: string;
}

const MemberListTable = (props: {data: MemberWithPosition[]}) => {
  const {data} = props;
  const { showModal } = useGlobalModalContext();
  const [openedDetail, { open: openDetail, close: closeDetail }] =
    useDisclosure();

  const [rowSelected, setRowSelected] = useState<MemberWithPosition>();

  const handleOpenModal = (person: MemberWithPosition) => {
    openDetail();
    setRowSelected(person);
  };

  const columns = useMemo<MRT_ColumnDef<MemberWithPosition>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Họ và tên",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorFn: (rowData: any) =>
          new Date(rowData.birthday).toLocaleDateString("vi"),
        id: "birthday",
        header: "Ngày sinh",
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
        accessorKey: "phoneNumber",
        header: "Số điện thoại",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
    ],
    []
  );

  const handleDownloadList = () => {
    console.log("download");
  };

  const table = useTable({
    columns,
    data: data || [],
    renderTopToolbar: () => <div />,
    renderBottomToolbar: () => <div />,
    enableRowActions: true,
    editDisplayMode: "row",
    enableEditing: true,

    onEditingRowCancel: () => console.log("cancel"),
    // onEditingRowSave: handleSaveUser,

    renderRowActions: ({ row }) => (
      <div className="flex items-center justify-center min-w-">
        <Tooltip title="Xem hồ sơ">
          <IconButton onClick={() => handleOpenModal(row.original)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      </div>
    ),
    positionActionsColumn: "last",
  });

  return (
    <div className="min-h-[520px] flex flex-col gap-4">
      <Typography fontSize={28} fontWeight={"bold"}>
        Danh sách thành viên
      </Typography>
      <MaterialReactTable table={table} />

      <div className="flex items-center justify-end">
        <Button
          variant="contained"
          sx={{
            width: "fit-content",
          }}
          color="secondary"
          onClick={handleDownloadList}
        >
          Tải về danh sách thành viên
        </Button>
      </div>

      {rowSelected && (
        <MemberDetail
          open={openedDetail}
          onClose={closeDetail}
          data={rowSelected!}
        />
      )}
    </div>
  );
};

export { MemberListTable };
