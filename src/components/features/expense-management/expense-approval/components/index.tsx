import { IconButton, Tooltip } from "@mui/material";
import React, { useMemo } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { STATUS_OF_EXPENSE } from "@/utils/constants";

interface Props {
  onClick: () => void;
}

export const AcceptComponent = ({ onClick }: Props) => {
  return (
    <Tooltip title="Duyệt">
      <IconButton onClick={onClick}>
        <CheckIcon />
      </IconButton>
    </Tooltip>
  );
};

export const RejectComponent = ({ onClick }: Props) => {
  return (
    <Tooltip title="Không duyệt">
      <IconButton onClick={onClick}>
        <ClearIcon />
      </IconButton>
    </Tooltip>
  );
};

export const UnAcceptComponent = ({ onClick }: Props) => {
  return (
    <Tooltip title="Hoàn duyệt">
      <IconButton onClick={onClick}>
        <RadioButtonUncheckedIcon />
      </IconButton>
    </Tooltip>
  );
};
