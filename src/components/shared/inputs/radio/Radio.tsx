import {
  RadioGroupProps,
  RadioGroup,
  Radio as MUIRadio,
  FormControlLabel,
} from "@mui/material";
import { InputControl } from "../components/InputControl";

type Props = {
  helperText?: string;
  error?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  label?: string;
  iconLabel?: string;
  startAdornmentIcon?: React.ReactNode;
} & { options: Array<{ value: number | string; label: string }> } & RadioGroupProps;

const Radio = ({
  required = false,
  fullWidth = false,
  helperText,
  error,
  label,
  iconLabel,
  startAdornmentIcon,
  options,
  ...props
}: Props) => {
  return (
    <InputControl
      fieldError={error}
      fullWidth={fullWidth}
      label={label}
      iconLabel={iconLabel}
      required={required}
      helperText={helperText}
    >
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        {...props}
      >
        {options.map((o: { value: number | string; label: string }, index) => {
          return (
            <FormControlLabel
              key={index}
              value={o.value}
              control={<MUIRadio />}
              label={o.label}
            />
          );
        })}
      </RadioGroup>
    </InputControl>
  );
};

export { Radio };
