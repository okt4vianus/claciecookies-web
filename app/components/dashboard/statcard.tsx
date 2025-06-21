export function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-center space-x-4">
        <div className={`p-4 rounded-xl bg-gradient-to-r ${color} shadow-lg`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-muted-foreground mb-1">
            {label}
          </div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
        </div>
      </div>
    </div>
  );
}
