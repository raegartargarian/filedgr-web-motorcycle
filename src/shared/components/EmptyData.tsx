import { Bike } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NoActivityProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

const NoActivity = ({
  title,
  description,
  icon: Icon = Bike,
}: NoActivityProps) => {
  return (
    <div className="flex h-full max-w-md flex-col items-center justify-center p-8">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-steel-800">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>
      <h2 className="mb-2 text-xl">{title}</h2>
      <p className="text-center text-muted-foreground">{description}</p>
    </div>
  );
};

export default NoActivity;
