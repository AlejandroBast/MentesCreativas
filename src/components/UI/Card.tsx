import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  actions?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ title, actions, children, className = "", ...rest }) => {
  return (
    <div
      className={`group relative rounded-2xl border border-sky-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-shadow duration-300 ${className}`}
      {...rest}
    >
      {(title || actions) && (
        <div className="flex items-start justify-between px-5 pt-4 pb-2">
          {title && (
            <h3 className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-200">
              {title}
            </h3>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={`px-5 pb-5 pt-2 ${title ? "" : "pt-5"}`}>{children}</div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-sky-200/60 dark:ring-slate-700/60 group-hover:ring-sky-300/50 dark:group-hover:ring-sky-400/40 transition" />
    </div>
  );
};

export default Card;