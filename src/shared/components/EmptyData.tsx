import { Car } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NoActivityProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

const NoActivity = ({ title, description, icon: Icon = Car }: NoActivityProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 max-w-md">
      <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-gray-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-center text-gray-500">{description}</p>
    </div>
  );
};

export default NoActivity;
