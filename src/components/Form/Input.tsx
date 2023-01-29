import React, { FC } from "react";
import { Controller } from "react-hook-form";

interface InputProps {
  name: string;
  type?: string;
  control: any;
  error: any;
  className?: string;
  placeholder?: string;
  rules?: any;
  showError?: boolean;
  label?: string;
}

const Input: FC<InputProps> = ({
  control,
  error,
  name,
  className = 'input input-bordered',
  placeholder = "",
  rules,
  showError = true,
  type = "text",
  label,
}) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <div className="form-control">
            {label && (
              <label className="label">
                <span className="label-text">{label}</span>
              </label>
            )}
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              className={className}
            />
          </div>
        )}
      />
      {showError && error && error[name] && error[name]?.message && (
        <p className="text-error text-sm">
          {error[name] && error[name].message}
        </p>
      )}
    </>
  );
};

export default Input;
