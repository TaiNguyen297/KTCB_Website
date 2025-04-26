import { useMemo, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";

import { MemberRegistrationWithPosition } from "@/@types/membershipRegistration";

import { useTable } from "@/libs/hooks/useTable";
import { IconButton, Tooltip } from "@mui/material";
import { ModalConfirm } from "@/components/shared/modals";
import { useDisclosure } from "@/libs/hooks/useDisclosure";
import { ActionType } from "@/@types/common";
import { ACTIONS } from "@/utils/constants";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MicIcon from "@mui/icons-material/Mic";
import ClearIcon from "@mui/icons-material/Clear";
import ToastSuccess from "@/components/shared/toasts/ToastSuccess";
import { SubmissionDetail } from "./SubmissionDetail";
import { EllipsisCell } from "@/components/shared/table";
import { useRecruitment } from "../hooks/useRecuitment";
import { useDeleteRecruitment } from "../hooks/useDeleteRecruitment";
import { useTranferRecruitment } from "../hooks/useTranferRecruitment";
import { MemberRegistrationStatus } from "@prisma/client";
import TestOptions from "@/utils/data/json/recruitment_test.json";
import { DatetimePicker, SelectTest } from "@/components/shared/inputs";


export type ActionTypeAdd = ActionType | "accept_interview";

const TEXT_TOAST = {
  [ACTIONS["ACCEPT"]]: "Xác nhận thành viên chính thức thành công!",
  [ACTIONS["REJECT"]]: "Xác nhận loại đơn tuyển thành công",
  [ACTIONS["ACCEPT_INTERVIEW"]]: "Xác nhận vòng phỏng vấn thành công!",
};

const TEXT_CONFIRM = {
  [ACTIONS["ACCEPT"]]: "Xác nhận chuyển đơn tuyển sang THÀNH VIÊN CHÍNH THỨC",
  [ACTIONS["REJECT"]]: "Xác nhận LOẠI đơn tuyển",
  [ACTIONS["ACCEPT_INTERVIEW"]]:
    "Xác nhận chuyển đơn tuyển sang VÒNG PHỎNG VẤN",
};

const SubmissionTable = (props: { data: MemberRegistrationWithPosition[] }) => {
  const { data } = props;
  const recruitment = useRecruitment();
  const deleteRecruitment = useDeleteRecruitment();
  const tranferRecruitment = useTranferRecruitment();

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
        accessorKey: "interviewTime",
        header: "Chọn ngày phỏng vấn",
        size: 200,
        Cell: (props) => <DatetimePicker
          onChange={(value) => { saveTimeToDatabase(props.row.original.id, value); }}
        />
      },
      {
        accessorKey: "test",
        header: "Chọn bài test",
        size: 200,
        Cell: (props) => <SelectTest
          options={TestOptions}
          name={""}
          onChange={(value) => {
            saveDataToDatabase(props.row.original.id, value);
          }}
          fullWidth
        />,
      },
    ],
    []
  );

  const saveTimeToDatabase = async (id: number, dateTime: Date | null) => {
    try {
      const response = await fetch('/api/save_interview_time', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, dateTime }), // Sửa đổi ở đây để khớp với API
      });
      if (!response.ok) throw new Error('Network response was not ok');
      console.log('Data successfully saved to the database');
    } catch (error) {
      console.error('Error saving data to the database:', error);
    }
  }

  const saveDataToDatabase = async (id: number, testId: string | number) => {
    try {
      const response = await fetch('/api/test_select', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, testId }), // Sửa đổi ở đây để khớp với API
      });
      if (!response.ok) throw new Error('Network response was not ok');
      console.log('Data successfully saved to the database');
    } catch (error) {
      console.error('Error saving data to the database:', error);
    }
  };

  const [opened, { open, close }] = useDisclosure();
  const [openToast, setOpenToast] = useState(false);
  const [openedDetail, { open: openDetail, close: closeDetail }] =
    useDisclosure();

  const [rowSelected, setRowSelected] =
    useState<MemberRegistrationWithPosition>();
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
      }else {
        recruitment.mutateAsync({
          id: rowSelected!.id,
          status: renderStatusByAction(action),
          interviewTime: rowSelected!.interviewTime,
          test: rowSelected!.test,
          email: rowSelected!.email,
          type: action === "accept_interview" ? "INTERVIEW" : "FORM",
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
    renderTopToolbar: () => <div />,
    renderBottomToolbar: () => <div />,
    enableRowActions: true,
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
              handleOpenModal(row.original, ACTIONS["ACCEPT"] as ActionTypeAdd)
            }
          >
            <PeopleAltIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Chuyển đơn tuyển sang vòng phỏng vấn">
          <IconButton
            onClick={() =>
              handleOpenModal(
                row.original,
                ACTIONS["ACCEPT_INTERVIEW"] as ActionTypeAdd
              )
            }
          >
            <MicIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Loại đơn tuyển">
          <IconButton
            onClick={() =>
              handleOpenModal(row.original, ACTIONS["REJECT"] as ActionTypeAdd)
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
        content={`${TEXT_TOAST[action as ActionTypeAdd]}`}
      />
      <ModalConfirm
        title={`Thông báo xác nhận`}
        open={opened}
        onClose={close}
        content={`${TEXT_CONFIRM[action as ActionTypeAdd]}`}
        onConfirm={handleConfirm}
      />

      {rowSelected && (
        <SubmissionDetail
          open={openedDetail}
          onClose={closeDetail}
          data={rowSelected!}
          handleOpenModal={handleOpenModal}
        />
      )}
    </>
  );
};

export { SubmissionTable };

export const renderStatusByAction = (action: ActionTypeAdd) => {
  switch (action) {
    case "accept":
      return MemberRegistrationStatus.PASSED;
    case "reject":
      return MemberRegistrationStatus.FAILED;
    case "accept_interview":
      return MemberRegistrationStatus.INTERVIEW;
    default:
      return MemberRegistrationStatus.REVIEWING;
  }
};