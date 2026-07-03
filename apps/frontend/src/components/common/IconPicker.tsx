import { Button } from "@/components/ui/button";
import { FolderGit2, Tags, Wallet, Plane, Utensils, ShoppingCart, Briefcase, Heart, Home } from "lucide-react";

export const ICONS = [
  { value: "folder", label: "Folder", icon: FolderGit2 },
  { value: "tags", label: "Tags", icon: Tags },
  { value: "wallet", label: "Wallet", icon: Wallet },
  { value: "plane", label: "Plane", icon: Plane },
  { value: "utensils", label: "Utensils", icon: Utensils },
  { value: "shopping-cart", label: "Shopping", icon: ShoppingCart },
  { value: "briefcase", label: "Briefcase", icon: Briefcase },
  { value: "heart", label: "Heart", icon: Heart },
  { value: "home", label: "Home", icon: Home },
];

export function getIconComponent(value: string) {
  const found = ICONS.find((i) => i.value === value);
  return found ? found.icon : FolderGit2;
}

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {ICONS.map((item) => (
        <Button
          key={item.value}
          type="button"
          variant="outline"
          className={`h-12 w-full p-0 flex items-center justify-center ${
            value === item.value ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground"
          }`}
          onClick={() => onChange(item.value)}
        >
          <item.icon className="w-5 h-5" />
        </Button>
      ))}
    </div>
  );
}
