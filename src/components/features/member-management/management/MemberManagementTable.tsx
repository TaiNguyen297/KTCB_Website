import { useMemo, useState } from "react";
import { MaterialReactTable, MRT_TableOptions, type MRT_ColumnDef } from "material-react-table";
import { useTable } from "@/libs/hooks/useTable";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { IOfficialMember } from "@/@types/member";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ClearIcon from "@mui/icons-material/Clear";
import { useDisclosure } from "@/libs/hooks/useDisclosure";
import { ActionType } from "@/@types/common";
import { ACTIONS } from "@/utils/constants";
import ToastSuccess from "@/components/shared/toasts/ToastSuccess";
import { ModalConfirm } from "@/components/shared/modals";
import { MemberManagementDetail } from "./MemberManagementDetail";
import { EllipsisCell } from "@/components/shared/table";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { MemberWithPosition } from "@/@types/member";
import { MODAL_TYPES, useGlobalModalContext } from "../../global-modal/GlobalModal";
import { useUpdateMember } from "../list/hooks/useUpdateMember";
import MemberPositionKTCB from "@/utils/data/json/position_ktcb.json";
import TeamKTCB from "@/utils/data/json/team.json";

import { SelectBox } from "@/components/shared/inputs/select/SelectBox";

export interface IMemberManagement extends IOfficialMember {
  team?: string;
  position?: string;
  positionId?: string;
  teamId?: string;
  id: string;
}


const TEXT_TOAST = {
  [ACTIONS["REJECT"]]: "Xác nhận yêu cầu thành viên rời đội thành công",
};

const TEXT_CONFIRM = {
  [ACTIONS["REJECT"]]: "Xác nhận yêu cầu thành viên RỜI ĐỘI",
};

const MemberManagementTable = (props: { data: MemberWithPosition[] }) => {
  const { data } = props;
  const { showModal } = useGlobalModalContext();
  const [opened, { open, close }] = useDisclosure();
  const [openedDetail, { open: openDetail, close: closeDetail }] =
    useDisclosure();

  const [openToast, setOpenToast] = useState(false);

  const [rowSelected, setRowSelected] = useState<MemberWithPosition>();
  const [action, setAction] = useState<ActionType>();

  const { mutateAsync: updateMember, isLoading: isUpdatingMember } =
    useUpdateMember();

  const handleOpenModal = (person: MemberWithPosition, action?: ActionType) => {
    openDetail();
    setRowSelected(person);
    setAction(action)
  };

  const columns = useMemo<MRT_ColumnDef<MemberWithPosition>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Họ và tên",
        enableEditing: false,
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorFn: (rowData: any) =>
          new Date(rowData.birthday).toLocaleDateString("vi"),
        id: "birthday",
        header: "Ngày sinh",
        enableEditing: false,
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
      {
        accessorKey: "team.name",
        header: "Team",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
        Edit: (props) => {
          const label = props.cell.getValue();

          return (
            <SelectBox
              value={
                TeamKTCB.find((p) => p.label === label)
                  ?.value as unknown as string
              }
              onChange={(value: string | number): void => {
                props.row._valuesCache = {
                  ...props.row._valuesCache,
                  teamId: Number(value),
                  id: props.row.original.id, // Ghi đè teamId bằng value mới
                };
                
              }}
              fullWidth
              options={TeamKTCB}
              placeholder="Chọn team ứng tuyển"
              {...props}
            />
          );
        },
      },
      {
        accessorKey: "position.name",
        header: "Vị trí",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
        Edit: (props) => {
          const label = props.cell.getValue();

          return (
            <SelectBox
              value={
                MemberPositionKTCB.find((p) => p.label === label)
                  ?.value as unknown as string
              }
              onChange={(value: string | number): void => {
                props.row._valuesCache = {
                  ...props.row._valuesCache,
                  positionId: Number(value),
                  id: props.row.original.id,
                };
            
              }}
              fullWidth
              options={MemberPositionKTCB}
              placeholder="Chọn vị trí"
              {...props}
            />
          );
        },
      },
    ],
    []
  );

  const handleConfirm = () => {
    setOpenToast(true);
    closeDetail();
    close();
  };

  const handleOutTeam = () => {
    showModal(MODAL_TYPES.MODAL_SUCCESS, {
      context: TEXT_TOAST[ACTIONS["REJECT"]],
    });
  };

  const handleSaveUser: MRT_TableOptions<MemberWithPosition>["onEditingRowSave"] =
  async ({ values, table }) => {
    await updateMember({
      id: Number(values.id),
      teamId: Number(values.teamId),
      positionId: Number(values.positionId),
    });
    table.setEditingRow(null); // Thoát chế độ chỉnh sửa
  };


  const table = useTable({
    columns,
    data: data || [],
    enableRowActions: true,
    onEditingRowSave: handleSaveUser,
    renderTopToolbar: () => <div />,
    renderBottomToolbar: () => <div />,
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
        Quản lý thành viên
      </Typography>

      <MaterialReactTable table={table} />

      <ToastSuccess
        open={openToast}
        onClose={() => setOpenToast(false)}
        heading="Xác nhận thành công"
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
        <MemberManagementDetail
          open={openedDetail}
          onClose={closeDetail}
          data={rowSelected!}
        />
      )}
    </div>
  );
};

export { MemberManagementTable };
