import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";

export function RadioOption({
  value,
  label,
  description,
  price,
}: {
  value: string;
  label: string;
  description: string;
  price?: number;
  name: string;
}) {
  return (
    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent transition-colors">
      <RadioGroupItem value={value} id={value} />
      <Label htmlFor={value} className="flex-1 cursor-pointer">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{label}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {price && (
            <Badge variant="outline" className="font-semibold">
              Rp {price.toLocaleString("id-ID")}
            </Badge>
          )}
        </div>
      </Label>
    </div>
  );
}
