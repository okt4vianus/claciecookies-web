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
    <div className={`p-4 rounded-lg bg-white border hover:shadow-md`}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${color}`}>{icon}</div>
        <div>
          <div className="text-sm text-gray-600">{label}</div>
          <div className="text-xl font-bold text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  );
}
