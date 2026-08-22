import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variants = {
    default: 'bg-zinc-900 text-zinc-400 border border-zinc-800',
    blue: 'bg-blue-950/30 text-blue-400 border border-blue-900/30',
    slate: 'bg-zinc-800/50 text-zinc-300 border border-zinc-700/50',
    emerald: 'bg-zinc-900 text-zinc-300 border border-zinc-800',
    amber: 'bg-amber-950/20 text-amber-400 border border-amber-900/20',
    red: 'bg-red-950/20 text-red-400 border border-red-900/20',
  };

  const getVariant = (val) => {
    if (typeof val !== 'string') return variant;
    const clean = val.toUpperCase();
    switch (clean) {
      case 'NEW':
      case 'PROSPECT':
        return 'blue';
      case 'SCREENING':
      case 'CONTACTED':
        return 'amber';
      case 'INTERVIEW':
      case 'QUALIFIED':
        return 'slate';
      case 'SELECTED':
      case 'CONVERTED':
      case 'ACTIVE':
      case 'COMPLETED':
        return 'slate';
      case 'REJECTED':
      case 'LOST':
      case 'INACTIVE':
      case 'FAILED':
        return 'red';
      case 'RINGING':
      case 'CONNECTED':
        return 'blue';
      default:
        return variant;
    }
  };

  const textVal = typeof children === 'string' ? children : '';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${variants[getVariant(textVal || variant)]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
