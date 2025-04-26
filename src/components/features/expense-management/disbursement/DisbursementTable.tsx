import { IExpense } from "@/@types/expense";
import React, { useCallback, useMemo, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { useTable } from "@/libs/hooks/useTable";
import { IconButton, Tooltip } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import { UploadFile } from "@/components/shared/inputs/upload";
import { EllipsisCell } from "@/components/shared/table";
import {
  MODAL_TYPES,
  useGlobalModalContext,
} from "../../global-modal/GlobalModal";
import { STATUS_OF_EXPENSE, TEXT_OF_STATUS } from "@/utils/constants";

interface IDisbursement extends IExpense {
  id: string;
  img_disbursement?: string;
}

const data: IDisbursement[] = [
  {
    id: "1",
    title: "123",
    content: "Kentucky@gmail.com",
    date: "2022-10-10 10:10:10",
    img_url: "https://picsum.photos/200",
    status: STATUS_OF_EXPENSE["PENDING"],
  },
  {
    id: "2",
    title: "123",
    content: "Ohio@gmail.com",
    date: "2022-10-10 10:10:10",
    img_url: "https://picsum.photos/200",
    status: STATUS_OF_EXPENSE["PENDING"],
  },
  {
    id: "3",
    title: "123",
    content: "West Virginia@gmail.com",
    date: "2022-10-10 10:10:10",
    img_url: "https://picsum.photos/200",
    status: STATUS_OF_EXPENSE["PENDING"],
  },
  {
    id: "4",
    title: "123",
    content: "Nebraska@gmail.com",
    date: "2022-10-10 10:10:10",
    img_url: "https://picsum.photos/200",
    status: STATUS_OF_EXPENSE["PENDING"],
  },
  {
    id: "5",
    title: "123",
    content: "Nebraska@gmail.com",
    date: "2022-10-10 10:10:10",
    img_url: "https://picsum.photos/200",
    status: STATUS_OF_EXPENSE["PENDING"],
  },
];

interface FileAdded extends File {
  preview: string;
}

export const DisbursementTable = () => {
  const [dataDisbursement, setDataDisbursement] = useState<
    Pick<IDisbursement, "img_disbursement" | "id">[]
  >([]);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, boolean | undefined>
  >({});
  const { showModal, hideModal } = useGlobalModalContext();

  const handleOnChangeUpload = useCallback(
    (value: FileAdded | null, row: IDisbursement) => {
      setDataDisbursement((prev) => {
        if (prev.length === 0) {
          return [
            {
              id: row.id,
              img_disbursement: value?.preview || "",
            },
          ];
        }

        const index = prev.findIndex((item) => item.id === row.id);

        if (index === -1) {
          return [
            ...prev,
            {
              id: row.id,
              img_disbursement: value?.preview || "",
            },
          ];
        } else {
          return prev.map((item) =>
            item.id === row.id
              ? {
                  ...item,
                  img_disbursement: value?.preview || "",
                }
              : item
          );
        }
      });

      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[row.id];
        return newErrors;
      });
    },
    []
  );

  const columns = useMemo<MRT_ColumnDef<IDisbursement>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Tiêu đề",
        enableEditing: false,
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorKey: "date",
        header: "Ngày chi",
        enableEditing: false,
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorKey: "content",
        header: "Chi tiết",
        enableEditing: false,
        size: 200,
        Cell: (props) => <EllipsisCell {...props} />,
      },
      {
        accessorKey: "img_url",
        header: "Minh chứng yêu cầu",
        enableEditing: false,
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
        accessorKey: "img_disbursement",
        header: "Minh chứng giải ngân",
        size: 200,
        enableClickToCopy: false,
        Cell({ row }) {
          const message = validationErrors[row.original.id]
            ? "Vui lòng tải lên minh chứng"
            : undefined;

          return (
            <div className="flex justify-center">
              <UploadFile
                fullWidth
                name={"img_disbursement"}
                notShowText={true}
                onChange={(value) =>
                  handleOnChangeUpload(value as FileAdded, row.original)
                }
                error={!!message}
                helperText={message as string}
              />
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        enableEditing: false,
        size: 200,
        Cell: ({ cell }) => {
          return TEXT_OF_STATUS[cell.getValue() as string];
        },
      },
    ],
    [handleOnChangeUpload, validationErrors]
  );

  const handleDisburse = (disbursementId: string) => {
    if (dataDisbursement.some((item) => item.id == disbursementId)) {
      showModal(MODAL_TYPES.MODAL_SUCCESS, {
        content: "Giải ngân thành công",
      });
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        [disbursementId]: true,
      }));
      hideModal();
    }
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
          <Tooltip title="Xác nhận giải ngân">
            <IconButton
              onClick={() => {
                showModal(MODAL_TYPES.MODAL_CONFIRM, {
                  content: "Xác nhận giải ngân",
                  onConfirm: () => handleDisburse(row.original.id),
                });
              }}
            >
              <CheckIcon />
            </IconButton>
          </Tooltip>
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
