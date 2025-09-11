// src/components/form/Input.tsx
'use client';
import React, { forwardRef, InputHTMLAttributes } from 'react';

type Props = {
  label?: string;
  error?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className = '', ...rest }, ref) => {
    return (
      <div className="w-2/4 flex flex-col gap-2">
        {label && (
          <label className="text-lg font-medium text-color">
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={`w-full bg-white/70 rounded-2xl p-4 mt-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${className}`}
          {...rest}
        />

        {error && (
          <span className="text-red-500 text-xs mt-1">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
