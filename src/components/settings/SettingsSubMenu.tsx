import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Account Settings",
    href: "/settings/your-account",
    description: "Manage your personal information and preferences",
  },
  {
    title: "Company Details",
    href: "/settings/company-details",
    description: "Update your company information",
  },
];

export function SettingsSubMenu() {
  const location = useLocation();

  return (
    <nav className="space-y-1">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col space-y-1 rounded-md px-3 py-2 hover:bg-accent",
              isActive && "bg-accent"
            )}
          >
            <span className="text-sm font-medium">{item.title}</span>
            <span className="text-xs text-muted-foreground">
              {item.description}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
