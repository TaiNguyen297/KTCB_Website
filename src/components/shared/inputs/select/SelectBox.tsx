import { SyntheticEvent, useEffect, useState } from "react";
import { InputControl } from "../components/InputControl";
import classNames from "classnames";

export type SelectOption = {
  label: string;
  value: string | number;
};

type Props = {
  helperText?: string;
  error?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  label?: string;
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  disabled?: boolean;
  placeholder?: string;
  disabledClearable?: boolean;
};

const SelectBox = ({
  required = false,
  fullWidth = false,
  helperText,
  error,
  label,
  options,
  value,
  onChange,
  placeholder,
  disabledClearable = false,
  ...props
}: Props) => {
  const [_value, setValue] = useState<string | number | undefined>("");

  useEffect(() => {
    const option = options.find((option) => option?.value === value);

    setValue(option?.value);
  }, [options, value]);

  const handleChangeValue = (_event: SyntheticEvent<Element, Event>) => {
    const newValue = (_event.target as HTMLInputElement).value;
    if (!newValue) {
      onChange("");
      setValue(undefined);

      return;
    }

    onChange("" + newValue);
    setValue(newValue);
  };

  return (
    <InputControl
      fieldError={error}
      fullWidth={fullWidth}
      label={label}
      required={required}
      helperText={helperText}
    >
      <select
        value={_value as string | number}
        onChange={handleChangeValue}
        className={classNames(
          "rounded-md border min-w-[120px] border-gray-300 px-2 py-2 focus:border-[#556cd6] h-[40px] bg-transparent bg-white",
          {
            "border-red-600": error,
          }
        )}
        {...props}
      >
        {placeholder && (
          <option
            className="px-4 py-2 block whitespace-nowrap text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            value=""
            disabled
          >
            {placeholder}
          </option>
        )}
        {options.map((option) => {
          return (
            <option
              className="px-4 py-2 block whitespace-nowrap text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          );
        })}
      </select>
    </InputControl>
  );
};

export { SelectBox };
