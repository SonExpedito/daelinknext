'use client';
import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  TextareaHTMLAttributes,
} from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  className?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'className'>;

export type TextareaAutoResizeRef = HTMLTextAreaElement | null;

const TextareaAutoResize = forwardRef<TextareaAutoResizeRef, Props>(
  ({ value, onChange, className = '', ...rest }, ref) => {
    const taRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => taRef.current!);

    const resize = () => {
      const el = taRef.current;
      if (!el) return;
      el.style.height = 'auto'; // reset
      el.style.height = `${el.scrollHeight}px`; // ajusta conforme conteúdo
    };

    useEffect(() => {
      resize();
    }, [value]);

    return (
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-2/4  bg-white/70 rounded-2xl p-4 mt-1 text-black ring-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${className}`}
        {...rest}
      />
    );
  }
);

TextareaAutoResize.displayName = 'TextareaAutoResize';
export default TextareaAutoResize;
