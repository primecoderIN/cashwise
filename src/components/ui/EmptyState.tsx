import { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4 fade-in">
      <div className="w-16 h-16 rounded-2xl bg-surface-hover flex items-center justify-center text-muted border border-border">
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted mt-1">{description}</p>
      </div>
      {action}
    </div>
  );
}
