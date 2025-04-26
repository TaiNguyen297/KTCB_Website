import React from "react";

type Props = {
  helperText?: string;
  error?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  onChange: (value: Date | null) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

export const DatetimePicker: React.FC<Props> = ({
  helperText,
  error,
  onChange,
  ...props
}) => {
  // Convert onChange to handle native input event
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(new Date(event.target.value));
  };

  return (
    <input
      className={`border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md px-2 py-2 focus:border-[#556cd6] h-[40px] ${props.fullWidth ? 'w-full' : ''}`}
      type="datetime-local"
      onChange={handleChange}
      {...props}
    />
  );
};