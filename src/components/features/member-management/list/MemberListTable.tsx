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
import { useUpdateMember } from "./hooks/useUpdateMember";
import { Member } from "@prisma/client";

export interface IMemberList extends IOfficialMember {
  team?: string;
  position?: string;
}

const TEAM_OPTIONS = [
  {
    value: 1,
    label: "Cùng bé trải nghiệm",
  },
  {
    value: 2,
    label: "Kiến trúc sư tình nguyện",
  },
];


const TEXT_TOAST = {
  [ACTIONS["REJECT"]]: "Xác nhận yêu cầu thành viên rời đội thành công",
};

const TEXT_CONFIRM = {
  [ACTIONS["REJECT"]]: "Xác nhận yêu cầu thành viên RỜI ĐỘI",
};

const MemberListTable = (props: {data: Member[]}) => {
  const {data} = props;
  const { showModal } = useGlobalModalContext();
  const [openedDetail, { open: openDetail, close: closeDetail }] =
    useDisclosure();

  const [rowSelected, setRowSelected] = useState<Member>();

  const { mutateAsync: updateMember, isLoading: isUpdatingMember } =
    useUpdateMember();

  const handleOpenModal = (person: Member) => {
    openDetail();
    setRowSelected(person);
  };

  const columns = useMemo<MRT_ColumnDef<Member>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Họ và tên",
        size: 200,
        enableEditing: false,
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
        enableEditing: false,
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorKey: "phoneNumber",
        header: "Số điện thoại",
        enableEditing: false,
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      // {
      //   accessorKey: "team",
      //   header: "Team",
      //   size: 200,
      //   Cell: (props) => <EllipsisCell {...props} />,
      //   Edit: (props) => {
      //     const label = props.cell.getValue();

      //     return (
      //       <SelectBox
      //         value={
      //           TEAM_OPTIONS.find((p) => p.label === label)
      //             ?.value as unknown as string
      //         }
      //         onChange={(value: string | number): void => {
      //           console.log(value);
      //         }}
      //         fullWidth
      //         options={TEAM_OPTIONS}
      //         placeholder="Chọn team ứng tuyển"
      //         {...props}
      //       />
      //     );
      //   },
      // },
      // {
      //   accessorKey: "position",
      //   header: "Vị trí",
      //   size: 200,
      //   Cell: (props) => <EllipsisCell {...props} />,
      //   Edit: (props) => {
      //     const label = props.cell.getValue();

      //     return (
      //       <SelectBox
      //         value={
      //           PositionKTCB.find((p) => p.label === label)
      //             ?.value as unknown as string
      //         }
      //         onChange={(value: string | number): void => {
      //           console.log(value);
      //         }}
      //         fullWidth
      //         options={PositionKTCB}
      //         placeholder="Chọn vị trí"
      //         {...props}
      //       />
      //     );
      //   },
      // },
    ],
    []
  );

  const handleDownloadList = () => {
    console.log("download");
  };

  const handleOutTeam = () => {
    showModal(MODAL_TYPES.MODAL_SUCCESS, {
      content: TEXT_TOAST[ACTIONS["REJECT"]],
    });
  };

  // const handleSaveUser: MRT_TableOptions<Member>["onEditingRowSave"] =
  //   async ({ values, table }) => {
  //     console.log(values);

  //     await updateMember(values);
  //     table.setEditingRow(null); //exit editing mode
  //   };

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

        <Tooltip title="Chỉnh sửa vị trí">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <SyncAltIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Rời đội">
          <IconButton
            onClick={() =>
              showModal(MODAL_TYPES.MODAL_CONFIRM, {
                content: TEXT_CONFIRM[ACTIONS["REJECT"]],
                onConfirm: handleOutTeam,
              })
            }
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </div>
    ),
    positionActionsColumn: "last",
    state: {
      isSaving: isUpdatingMember,
    },
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
