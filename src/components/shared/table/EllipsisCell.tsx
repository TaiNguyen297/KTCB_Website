import { Box, Tooltip } from "@mui/material";
import {
  MRT_Cell,
  MRT_Column,
  MRT_Row,
  MRT_RowData,
  MRT_TableInstance,
} from "material-react-table";
import { ReactNode } from "react";

// Updated ReactTableCellProps to include an optional `value` property
export type ReactTableCellProps<TData extends MRT_RowData, TValue = unknown> = {
  table: MRT_TableInstance<TData>;
  row: MRT_Row<TData>;
  column: MRT_Column<TData, TValue>;
  cell: MRT_Cell<TData, TValue>;
  renderedCellValue: ReactNode;
  value?: string; // Optional `value` property added
};

function EllipsisCell<T extends MRT_RowData, TValue = unknown>({
  column,
  row,
  cell,
  value, // Destructure `value` from props
}: ReactTableCellProps<T, TValue>): JSX.Element {
  const width = column.columnDef?.size
    ? (column.columnDef?.size as number)
    : "auto";

  // Use `value` prop if provided, otherwise fallback to cell's value
  const originValue = value ?? (cell.getValue() as string);
  if (originValue === null || originValue === undefined) return <></>;
  if (originValue.length < 20) return <>{originValue}</>;

  return (
    <Box
      sx={{
        width: width + "!important",
      }}
    >
      <Tooltip
        sx={{
          wordBreak: "break-all",
          width: typeof width === "number" ? width : 250,
        }}
        title={originValue}
      >
        <Box
          width={typeof width === "number" ? width - 40 : "auto"}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {originValue}
        </Box>
      </Tooltip>
    </Box>
  );
}

export { EllipsisCell };