// TODO (Milestone 5+): Implement Tooltip component

import { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="tooltip-wrap" title={content}>
      {children}
    </div>
  );
}
