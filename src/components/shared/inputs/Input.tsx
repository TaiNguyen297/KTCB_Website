import {
  InputAdornment,
  OutlinedInput,
  OutlinedInputProps,
} from "@mui/material";
import React from "react";
import { InputControl } from "./components/InputControl";

export type InputProps = {
  helperText?: string;
  error?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  label?: string;
  iconLabel?: string;
  startAdornmentIcon?: React.ReactNode;
} & OutlinedInputProps;

const Input: React.FC<InputProps> = ({
  required = false,
  fullWidth = false,
  helperText,
  error,
  label,
  iconLabel,
  startAdornmentIcon,
  ...props
}) => {
  return (
    <InputControl
      fieldError={error}
      fullWidth={fullWidth}
      label={label}
      iconLabel={iconLabel}
      required={required}
      helperText={helperText}
    >
      <OutlinedInput
        sx={{
          padding: "8px 12px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: 400,
          backgroundColor: "#fff",

          "& .MuiOutlinedInput-input": {
            padding: 0,
            display: "flex",
            alignItems: "center",
            height: "auto",
            borderColor: "transparent",
          },

          "& input[type=number]::-webkit-outer-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "& input[type=number]::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
        }}
        onWheel={(event: any) => event.target?.blur()}
        {...(startAdornmentIcon && {
          startAdornment: (
            <InputAdornment position="start">
              {startAdornmentIcon}
            </InputAdornment>
          ),
        })}
        {...(props?.type === "number" && {
          onKeyDown: (event) => {
            if (
              event?.key === "-" ||
              event?.key === "+" ||
              event?.key === "e" ||
              event?.key === "E"
            ) {
              event.preventDefault();
            }
          },
        })}
        {...props}
      />
    </InputControl>
  );
};

export { Input };
