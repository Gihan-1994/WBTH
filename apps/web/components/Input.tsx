import React, { InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: FieldError;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, error, ...props }, ref) => {
    return (
      <div className="flex flex-col justify-start items-start gap-2 p-0 flex-grow basis-auto w-full type-desktop">
        <label
          htmlFor={id}
          className="block text-base font-roboto font-normal tracking-wide leading-none text-figma-rgb-12-20-33 text-10"
        >
          {label}
        </label>
        <div className="flex-grow-0 flex-shrink-1 basis-auto w-full relative input-11">
          <input
            id={id}
            ref={ref}
            {...props}
            className="w-full h-12 px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-300 text-figma-rgb-136-151-173 text-base text-13"
          />
        </div>
        {error && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-slide-in-down">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
