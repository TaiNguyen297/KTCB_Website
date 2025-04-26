import { FormControl, FormControlProps, FormHelperText } from "@mui/material";
import Image from "next/image";
import { FieldError } from "react-hook-form";
import { FormLabel } from "./FormLabel";

export type AddControlProps = {
  helperText?: string | JSX.Element;
  label?: string;
  iconLabel?: string;
  fieldError?: FieldError | boolean;
};

export type InputControlProps = FormControlProps<"div", AddControlProps>;

const InputControl = ({
  fieldError,
  fullWidth,
  label,
  helperText,
  children,
  required,
  iconLabel,
  ...props
}: InputControlProps) => {
  return (
    <FormControl fullWidth={fullWidth} error={!!fieldError} {...props}>
      {
        <FormLabel>
          {iconLabel && (
            <Image
              src={iconLabel}
              alt="icon-label"
              width={20}
              height={20}
              style={{
                marginRight: "6px",
              }}
            />
          )}
          {label}
          {required ? (
            <span
              style={{
                marginLeft: "3px",
                color: "red",
                alignSelf: "flex-start",
              }}
            >
              *
            </span>
          ) : null}
        </FormLabel>
      }

      {children}

      {!!fieldError && (
        <FormHelperText
          error
          sx={{
            marginRight: 0,
            marginLeft: 0,
          }}
        >
          {typeof fieldError === "boolean" ? helperText : fieldError?.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export { InputControl };
