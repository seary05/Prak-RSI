import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  emoji?: string;
  action?: ReactNode;
}

export default function EmptyState({ title, description, emoji = "🍽️", action }: Props) {
  return (
    <div className="rounded-3xl border border-dashed border-brand-200 bg-white px-6 py-16 text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-4xl">{emoji}</div>
      <p className="mt-5 text-lg font-bold">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}