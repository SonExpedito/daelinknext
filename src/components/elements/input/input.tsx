'use client';
import React, {
  forwardRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  useRef,
  useImperativeHandle,
  useEffect,
} from 'react';

type BaseProps = {
  label?: string;
  error?: string;
  className?: string;
  wrapperClass?: string;
};

/* -------------------- Input -------------------- */
type InputProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'className'> & {
    value: string | number;
    onChange: (v: string) => void;
  };

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', value, onChange, wrapperClass = 'w-full', ...rest }, ref) => (
    <div className={`${wrapperClass} flex flex-col items-center gap-2 text-color`}>
      {label && (
        <label className="text-lg font-medium w-[80%] text-left">{label}</label>
      )}
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`input-background rounded-2xl p-3 text-color 
          focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${className}`}
        {...rest} // 🔹 required, type, etc. passam agora corretamente
      />
      {error && <span className="text-red-400 text-xs mt-1">{error}</span>}
    </div>
  )
);
Input.displayName = 'Input';

/* -------------------- Textarea AutoResize -------------------- */
type TextareaProps = BaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'className'> & {
    value: string;
    onChange: (v: string) => void;
  };

export type TextareaAutoResizeRef = HTMLTextAreaElement | null;

export const TextareaAutoResize = forwardRef<TextareaAutoResizeRef, TextareaProps>(
  ({ value, onChange, className = '', label, error, wrapperClass = 'w-full', placeholder, ...rest }, ref) => {
    const taRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => taRef.current!);

    const resize = () => {
      const el = taRef.current;
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    };

    useEffect(() => {
      resize();
    }, [value]);

    return (
      <div className={`${wrapperClass} flex flex-col items-center gap-2 text-color`}>
        {label && <label className="text-lg font-medium w-[80%] text-left">{label}</label>}
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} // 🔹 Suporte a placeholder
          className={`w-full input-background rounded-2xl p-3 mt-1 text-color placeholder-white/60 
            focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${className}`}
          {...rest} // 🔹 required, disabled, etc.
        />
        {error && <span className="text-red-400 text-xs mt-1">{error}</span>}
      </div>
    );
  }
);
TextareaAutoResize.displayName = 'TextareaAutoResize';

/* -------------------- Select -------------------- */
type SelectProps = BaseProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    value: string;
    onChange: (v: string) => void;
    children: React.ReactNode;
  };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = '', value, onChange, children, wrapperClass = 'w-full', ...rest }, ref) => (
    <div className={`${wrapperClass} flex flex-col items-center gap-2 text-color`}>
      {label && <label className="text-lg font-medium w-[80%] text-left">{label}</label>}
      <select
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`input-background rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${className}`}
        {...rest} // 🔹 required, disabled, etc.
      >
        {children}
      </select>
      {error && <span className="text-red-400 text-xs mt-1">{error}</span>}
    </div>
  )
);

Select.displayName = 'Select';
