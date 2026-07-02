type BadgeProps = {
  color?: string;
  children: React.ReactNode;
  size?: "sm" | "md";
};

export default function Badge({ color = "#a855f7", children, size = "md" }: BadgeProps) {
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const sizeClasses = size === "sm"
    ? "px-2 py-0.5 text-xs gap-1"
    : "px-2.5 py-1 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center ${sizeClasses} rounded-full font-semibold`}
      style={{
        backgroundColor: `rgba(${r},${g},${b},0.12)`,
        color: color,
        border: `1px solid rgba(${r},${g},${b},0.25)`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      {children}
    </span>
  );
}
