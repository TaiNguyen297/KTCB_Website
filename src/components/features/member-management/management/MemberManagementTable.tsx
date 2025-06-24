import { useMemo, useState } from "react";
import { MaterialReactTable, MRT_Row, MRT_TableOptions, type MRT_ColumnDef } from "material-react-table";
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
import { useDeleteMember } from "../list/hooks/useDeleteMember";
import MemberPositionKTCB from "@/utils/data/json/position_ktcb.json";
import TeamKTCB from "@/utils/data/json/team.json";
import SecurityIcon from '@mui/icons-material/Security';

import { SelectBox } from "@/components/shared/inputs/select/SelectBox";
import GrantAccountForm from "../GrantAccountForm";
import RolePermissionForm from "../RolePermissionForm";
import Dialog from "@mui/material/Dialog";

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
  const [openGrantAccount, setOpenGrantAccount] = useState(false);
  const [openRolePermission, setOpenRolePermission] = useState(false);

  const [rowSelected, setRowSelected] = useState<MemberWithPosition>();
  const [action, setAction] = useState<ActionType>();
  const [grantAccountMemberId, setGrantAccountMemberId] = useState<number | null>(null);
  const [rolePermissionUserId, setRolePermissionUserId] = useState<number | null>(null);

  const { mutateAsync: updateMember, isLoading: isUpdatingMember } =
    useUpdateMember();
 
  const { mutateAsync: deleteMember, isLoading: isDeletingMember } =
    useDeleteMember();
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

  const handleOutTeam = async (row: MRT_Row<MemberWithPosition>) => {
    const memberId = row.original.id;
    if (!memberId) {
      console.error("ID không tồn tại trong row.original");
      return;
    }
    try {
      await deleteMember({ id: memberId });
      showModal(MODAL_TYPES.MODAL_SUCCESS, {
        content: TEXT_TOAST[ACTIONS["REJECT"]],
      });  
      
    } catch (error) {
      console.error("Lỗi khi xóa thành viên:", error);
    }
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
            onClick={() => {
              showModal(MODAL_TYPES.MODAL_CONFIRM, {
                content: TEXT_CONFIRM[ACTIONS["REJECT"]],
                onConfirm: () => handleOutTeam(row),
              });
            }}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cấp tài khoản">
          <IconButton
            onClick={() => {
              setGrantAccountMemberId(Number(row.original.id));
              setOpenGrantAccount(true);
            }}
          >
            <span role="img" aria-label="grant-account">🔑</span>
          </IconButton>
        </Tooltip>
        <Tooltip title="Phân quyền">
          <IconButton
            onClick={() => {
              // Get User ID associated with this member
              const memberId = Number(row.original.id);
              // Giả sử có API lấy user từ memberId
              fetch(`/api/member_management/get_user?memberId=${memberId}`)
                .then(res => res.json())
                .then(data => {
                  if (data.userId) {
                    setRolePermissionUserId(data.userId);
                    setOpenRolePermission(true);
                  } else {
                    alert('Thành viên này chưa có tài khoản. Vui lòng cấp tài khoản trước.');
                  }
                })
                .catch(err => {
                  console.error('Lỗi khi lấy thông tin User:', err);
                  alert('Không thể lấy thông tin người dùng. Vui lòng thử lại sau.');
                });
            }}
          >
            <SecurityIcon />
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

      <Dialog open={openGrantAccount} onClose={() => setOpenGrantAccount(false)}>
        <div style={{ padding: 24, minWidth: 400 }}>
          <h3 style={{ marginBottom: 16 }}>Cấp tài khoản cho thành viên</h3>
          {grantAccountMemberId && (
            <GrantAccountForm
              memberId={grantAccountMemberId}
              onSuccess={() => setOpenGrantAccount(false)}
            />
          )}
        </div>
      </Dialog>

      <Dialog open={openRolePermission} onClose={() => setOpenRolePermission(false)}>
        <div style={{ padding: 24, minWidth: 500 }}>
          <h3 style={{ marginBottom: 16 }}>Phân quyền người dùng</h3>
          {rolePermissionUserId && (
            <RolePermissionForm
              userId={rolePermissionUserId}
              onSuccess={() => setOpenRolePermission(false)}
            />
          )}
        </div>
      </Dialog>
    </div>
  );
};

export { MemberManagementTable };
