import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  placeholder,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        placeholder={placeholder}
        className={`w-full bg-[#12131a] border ${
          error ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-purple-500'
        } rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all duration-200 focus:ring-2 ${
          error ? 'focus:ring-red-500/20' : 'focus:ring-purple-500/20'
        }`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-400 font-medium">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
