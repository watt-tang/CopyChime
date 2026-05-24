import React from "react";

interface Props {
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  danger?: boolean;
}

export function IconButton({ onClick, title, children, className, active, danger }: Props) {
  return (
    <button
      className={`icon-btn ${active ? "active" : ""} ${danger ? "danger" : ""} ${className || ""}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}
