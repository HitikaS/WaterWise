import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white ml-12 lg:ml-0">
            {title}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-400" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full"></span>
          </Button>
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
              John Doe
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
