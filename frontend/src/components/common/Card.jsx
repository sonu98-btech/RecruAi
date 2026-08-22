import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  hoverable = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-xl p-6 ${
        hoverable ? 'glass-panel-hover cursor-pointer' : ''
      } ${className}`}
    >
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between mb-4 gap-4">
          <div>
            {title && <h4 className="text-base font-semibold text-zinc-100">{title}</h4>}
            {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card;
