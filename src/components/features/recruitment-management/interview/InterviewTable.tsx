import { useMemo, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { useTable } from "@/libs/hooks/useTable";
import { IconButton, Tooltip } from "@mui/material";
import { IMember } from "@/@types/member";
import { ModalConfirm } from "@/components/shared/modals";
import { ACTIONS } from "@/utils/constants";
import { useDisclosure } from "@/libs/hooks/useDisclosure";
import { ActionType } from "@/@types/common";
import { useRecruitment } from "../hooks/useRecuitment";
import { useDeleteRecruitment } from "../hooks/useDeleteRecruitment";
import { useTranferRecruitment } from "../hooks/useTranferRecruitment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ClearIcon from "@mui/icons-material/Clear";
import ToastSuccess from "@/components/shared/toasts/ToastSuccess";
import { InterviewDetail } from "./InterviewDetail";
import { EllipsisCell } from "@/components/shared/table";
import { MemberRegistrationWithPosition } from "@/@types/membershipRegistration";
import { MemberRegistrationStatus } from "@prisma/client";
import { useRouter} from "next/navigation";
import TestOptions from "@/utils/data/json/recruitment_test.json";


export interface PersonInterview extends IMember {
  date_time: string;
  test_id: number;
  link_gg_met: string;
}

export type ActionTypeAdd = ActionType | "accept_interview";

const TEXT_TOAST = {
  [ACTIONS["ACCEPT"]]: "Xác nhận thành viên chính thức thành công!",
  [ACTIONS["REJECT"]]: "Xác nhận loại đơn tuyển thành công",
};

const TEXT_CONFIRM = {
  [ACTIONS["ACCEPT"]]: "Xác nhận chuyển đơn tuyển sang THÀNH VIÊN CHÍNH THỨC",
  [ACTIONS["REJECT"]]: "Xác nhận LOẠI đơn tuyển",
};

const InterviewTable = (props: {data: MemberRegistrationWithPosition[] }) => {
  const {data} = props;
  const recruitment = useRecruitment();
  const deleteRecruitment = useDeleteRecruitment();
  const tranferRecruitment = useTranferRecruitment();
  const router = useRouter();

  const columns = useMemo<MRT_ColumnDef<MemberRegistrationWithPosition>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Họ và tên",
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
        accessorFn: (rowData: any) =>
          new Date(rowData.birthday).toLocaleDateString("vi"),
        id: "birthday",
        header: "Ngày sinh",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorKey: "linkGGmeet",
        header: "Link Google Meet",
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
          accessorFn: (rowData: any) =>
            new Date(rowData.interviewTime).toLocaleString("vi-VN"),
          id: "interviewTime",
          header: "Ngày giờ phỏng vấn",
          size: 200,
          Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorKey: "test",
        header: "Bài test",
        size: 200,
        Cell: (props) => {
          // Tìm label trong TestOptions tương ứng với value lưu trong database
          const label = TestOptions.find(option => option.name.toString() === props.row.original.test)?.content || 'Không xác định';
          return <EllipsisCell {...props} value={label} />;
        },
      },
    ],
    []
  );

  const [opened, { open, close }] = useDisclosure();
  const [openToast, setOpenToast] = useState(false);
  const [openedDetail, { open: openDetail, close: closeDetail }] =
    useDisclosure();

  const [rowSelected, setRowSelected] = useState<MemberRegistrationWithPosition>();
  const [action, setAction] = useState<ActionTypeAdd>();

  const handleOpenModal = (
    person: MemberRegistrationWithPosition, 
    action?: ActionTypeAdd
  ) => {
    action ? open() : openDetail();

    setRowSelected(person);
    setAction(action);
  };

  const handleConfirm = () => {
    if (action) {
      if (action === "reject") {
        // Gọi hàm deleteRecruitment để xóa bản ghi
        deleteRecruitment.mutateAsync({ id: rowSelected!.id });
      } else if (action === "accept") {
        // Gọi hàm tranferRecruitment để chuyển bản ghi
        tranferRecruitment.mutateAsync({
          id: rowSelected!.id,
          email: rowSelected!.email,
          fullName: rowSelected!.fullName,
          birthday: rowSelected!.birthday,
          phoneNumber: rowSelected!.phoneNumber,
          address: rowSelected!.address,
          workPlace: rowSelected!.workPlace,
        });
      }
    }
    setOpenToast(true);
    closeDetail();
    close();
  };

  const table = useTable({
    columns,
    data: data || [],
    enableRowActions: true,
    renderTopToolbar: () => <div />,
    renderBottomToolbar: () => <div />,
    renderRowActions: ({ row }) => (
      <div className="flex items-center justify-center min-w-">
        <Tooltip title="Xem hồ sơ của đơn tuyển">
          <IconButton onClick={() => handleOpenModal(row.original)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Chuyển đơn tuyển sang thành viên chính thức">
          <IconButton
            onClick={() =>
              handleOpenModal(row.original, ACTIONS["ACCEPT"] as ActionType)
            }
          >
            <PeopleAltIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Loại đơn tuyển">
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
    <>
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
        <InterviewDetail
          open={openedDetail}
          onClose={closeDetail}
          data={rowSelected!}
          handleOpenModal={handleOpenModal}
        />
      )}
    </>
  );
};

export { InterviewTable };
