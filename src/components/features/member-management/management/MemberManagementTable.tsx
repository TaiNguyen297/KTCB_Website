import { useMemo, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
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

export interface IMemberManagement extends IOfficialMember {
  team?: string;
  position?: string;
}

const TEXT_TOAST = {
  [ACTIONS["REJECT"]]: "Xác nhận yêu cầu thành viên rời đội thành công",
};

const TEXT_CONFIRM = {
  [ACTIONS["REJECT"]]: "Xác nhận yêu cầu thành viên RỜI ĐỘI",
};

const data: IMemberManagement[] = [
  {
    full_name: "123",
    email: "Kentucky_dai_dai_dai_ktcb@gmail.com",
    birthday: "27/02/2001",
    phone_number: "0334455667",
    address: "144 Xuan Thuy",
    work_place: "144 Xuan Thuy",
    bank_account: "123456789",
    team: "Cùng bé trải nghiệm",
    position: "Tình nguyện viên",
    bank_name: "ACB",
  },
  {
    full_name: "123",
    email: "Ohio@gmail.com",
    birthday: "27/02/2001",
    phone_number: "0334455667",
    address: "144 Xuan Thuy",
    work_place: "144 Xuan Thuy",
    bank_account: "123456789",
    team: "Cùng bé trải nghiệm",
    position: "Tình nguyện viên",
    bank_name: "ACB",
  },
  {
    full_name: "123",
    email: "West Virginia@gmail.com",
    birthday: "27/02/2001",
    phone_number: "0334455667",
    address: "144 Xuan Thuy",
    work_place: "144 Xuan Thuy",
    bank_account: "123456789",
    team: "Cùng bé trải nghiệm",
    position: "Tình nguyện viên",
    bank_name: "ACB",
  },
  {
    full_name: "123",
    email: "Nebraska@gmail.com",
    birthday: "27/02/2001",
    phone_number: "0334455667",
    address: "144 Xuan Thuy",
    work_place: "144 Xuan Thuy",
    bank_account: "123456789",
    team: "Cùng bé trải nghiệm",
    position: "Tình nguyện viên",
    bank_name: "ACB",
  },
  {
    full_name: "Xin chào các bạn tên của tôi là Xuân Thủy",
    email: "Nebraska@gmail.com",
    birthday: "27/02/2001",
    phone_number: "0334455667",
    address: "144 Xuan Thuy",
    work_place: "144 Xuan Thuy",
    bank_account: "123456789",
    team: "Cùng bé trải nghiệm công viên thủy tinh",
    position: "Tình nguyện viên",
    bank_name: "ACB",
  },
];

const MemberManagementTable = () => {
  const [opened, { open, close }] = useDisclosure();
  const [openedDetail, { open: openDetail, close: closeDetail }] =
    useDisclosure();

  const [openToast, setOpenToast] = useState(false);

  const [rowSelected, setRowSelected] = useState<IMemberManagement>();
  const [action, setAction] = useState<ActionType>();

  const handleOpenModal = (person: IMemberManagement, action?: ActionType) => {
    action ? open() : openDetail();

    setRowSelected(person);
    setAction(action);
  };

  const columns = useMemo<MRT_ColumnDef<IMemberManagement>[]>(
    () => [
      {
        accessorKey: "full_name",
        header: "Họ và tên",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorKey: "birthday",
        header: "Ngày sinh",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorKey: "phone_number",
        header: "Số điện thoại",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorKey: "team",
        header: "Team",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorKey: "position",
        header: "Vị trí",
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

  const table = useTable({
    columns,
    data,
    enableRowActions: true,

    renderTopToolbar: () => <div />,
    renderBottomToolbar: () => <div />,
    renderRowActions: ({ row }) => (
      <div className="flex items-center justify-center min-w-">
        <Tooltip title="Xem hồ sơ">
          <IconButton onClick={() => handleOpenModal(row.original)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Rời đội">
          <IconButton
            onClick={() =>
              handleOpenModal(row.original, ACTIONS["REJECT"] as ActionType)
            }
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
          handleOpenModal={handleOpenModal}
        />
      )}
    </div>
  );
};

export { MemberManagementTable };
