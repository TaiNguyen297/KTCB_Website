import { IExpense } from "@/@types/expense";
import React, { useMemo } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { useTable } from "@/libs/hooks/useTable";
import { ACTIONS, STATUS_OF_EXPENSE, TEXT_OF_STATUS } from "@/utils/constants";
import { ActionType } from "@/@types/common";

import { Actions } from "./components/Actions";
import {
  MODAL_TYPES,
  useGlobalModalContext,
} from "../../global-modal/GlobalModal";

const data: IExpense[] = [
  {
    title: "123",
    content: "Kentucky@gmail.com",
    date: "2022-10-10 10:10:10",
    img_url: "https://picsum.photos/200",
    status: STATUS_OF_EXPENSE["PENDING"],
  },
  {
    title: "123",
    content: "Ohio@gmail.com",
    date: "2022-10-10 10:10:10",
    img_url: "https://picsum.photos/200",
    status: STATUS_OF_EXPENSE["ACCEPTED"],
  },
  {
    title: "123",
    content: "West Virginia@gmail.com",
    date: "2022-10-10 10:10:10",
    img_url: "https://picsum.photos/200",
    status: STATUS_OF_EXPENSE["REJECTED"],
  },
  {
    title: "123",
    content: "Nebraska@gmail.com",
    date: "2022-10-10 10:10:10",
    img_url: "https://picsum.photos/200",
    status: STATUS_OF_EXPENSE["PENDING"],
  },
  {
    title: "123",
    content: "Nebraska@gmail.com",
    date: "2022-10-10 10:10:10",
    img_url: "https://picsum.photos/200",
    status: STATUS_OF_EXPENSE["PENDING"],
  },
];

const TEXT_TOAST = {
  [ACTIONS["ACCEPT"]]: "Xác nhận DUYỆT yêu cầu thu chi thành công!",
  [ACTIONS["REJECT"]]: "Xác nhận KHÔNG DUYỆT yêu cầu thu chi thành công",
  [ACTIONS["UN_ACCEPT"]]: "Xác nhận HOÀN DUYỆT yêu cầu thu chi thành công",
};

const TEXT_CONFIRM = {
  [ACTIONS["ACCEPT"]]: "Xác nhận DUYỆT yêu cầu thu chi",
  [ACTIONS["REJECT"]]: "Xác nhận KHÔNG DUYỆT yêu cầu thu chi",
  [ACTIONS["UN_ACCEPT"]]: "Xác nhận HOÀN DUYỆT yêu cầu thu chi",
};

export const ExpenseApprovalTable = () => {
  const { showModal, hideModal } = useGlobalModalContext();

  const columns = useMemo<MRT_ColumnDef<IExpense>[]>(
    () => [
      {
        accessorKey: "title",
        header: "TIÊU ĐỀ",
        size: 200,
      },
      {
        accessorKey: "date",
        header: "Ngày chi",
        size: 200,
      },
      {
        accessorKey: "content",
        header: "CHI TIẾT",
        size: 200,
      },
      {
        accessorKey: "img_url",
        header: "MINH CHỨNG YÊU CẦU",
        size: 200,
        Cell({ row }) {
          return (
            <a href={row.original.img_url} target="_blank">
              {row.original.img_url}
            </a>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        size: 200,
        Cell: ({ cell }) => {
          return TEXT_OF_STATUS[cell.getValue() as string];
        },
      },
    ],
    []
  );

  const handleOpenModal = (expense: IExpense, action: ActionType) => {
    showModal(MODAL_TYPES.MODAL_CONFIRM, {
      content: TEXT_CONFIRM[action as string],
      onConfirm: Function[action as string],
    });
  };

  const handleAccept = () => {
    showModal(MODAL_TYPES.MODAL_SUCCESS, {
      content: TEXT_TOAST[ACTIONS["ACCEPT"]],
    });
  };

  const handleReject = () => {
    showModal(MODAL_TYPES.MODAL_SUCCESS, {
      content: TEXT_TOAST[ACTIONS["REJECT"]],
    });
  };

  const handleUnAccept = () => {
    showModal(MODAL_TYPES.MODAL_SUCCESS, {
      content: TEXT_TOAST[ACTIONS["UN_ACCEPT"]],
    });
  };

  const Function = {
    [ACTIONS["ACCEPT"]]: handleAccept,
    [ACTIONS["REJECT"]]: handleReject,
    [ACTIONS["UN_ACCEPT"]]: handleUnAccept,
  };

  const table = useTable({
    columns,
    data,
    enableRowActions: true,
    renderTopToolbar: () => <div />,
    renderBottomToolbar: () => <div />,
    renderRowActions: ({ row }) => {
      return (
        <div className="flex items-center justify-center min-w-">
          <Actions
            status={row.original.status}
            handleOpenModal={(action: string) =>
              handleOpenModal(row.original, action as ActionType)
            }
          />
        </div>
      );
    },
    positionActionsColumn: "last",
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};
