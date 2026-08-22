import React from 'react';
import Loader from './Loader';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] text-xs uppercase tracking-wider font-semibold';
  
  const variants = {
    primary: 'bg-zinc-100 hover:bg-white text-zinc-950 shadow-sm border border-zinc-200',
    secondary: 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800',
    danger: 'bg-red-950/30 hover:bg-red-900/20 text-red-400 border border-red-900/30',
    ghost: 'hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-3.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader size="sm" className="mr-2" />
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
