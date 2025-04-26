import {
  MRT_ColumnDef,
  MRT_RowData,
  MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import { MRT_Localization_VI } from "material-react-table/locales/vi";

interface Props<T extends MRT_RowData> extends MRT_TableOptions<T> {
  columns: MRT_ColumnDef<T, any>[];
  data: T[];
}

export const useTable = <T extends MRT_RowData>({
  columns,
  data,
  ...props
}: Props<T>) => {
  const table = useMaterialReactTable({
    columns,
    data,
    localization: MRT_Localization_VI,
    enableDensityToggle: false,
    enableFilters: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableSorting: false,
    enablePagination: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableClickToCopy: true,
    enableRowNumbers: true,
    rowNumberDisplayMode: "static",
    mrtTheme: (theme) => ({
      baseBackgroundColor: theme.palette.background.default,
    }),
    defaultColumn: {
      minSize: 100,
      maxSize: 200,
    },
    muiTableBodyRowProps: { hover: false },
    muiTableProps: {
      sx: {
        boxShadow: "none",
        borderRadius: "none",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        border: "1px solid #ccc",
        fontWeight: "500",
        textTransform: "uppercase",
        justifyContent: "center",
        fontSize: "18px",
        flex: 1,

        "& .Mui-TableHeadCell-Content": {
          display: "flex",
          justifyContent: "center",

          "& .Mui-TableHeadCell-Content-Wrapper": {
            textAlign: "center",
          },
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: "1px solid #ccc",
        fontSize: "16px",
        fontWeight: "400",

        "& button": {
          fontWeight: "400",
        },
      },
    },

    ...props,
  });

  return table;
};
