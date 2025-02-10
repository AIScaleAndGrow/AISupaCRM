import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { User, Building2, Lock, Plug, Bell, Users } from "lucide-react";

export const settingsNavItems = [
  {
    title: "Your Account",
    href: "/settings/your-account",
    icon: User,
  },
  {
    title: "Company Details",
    href: "/settings/company-details",
    icon: Building2,
  },
  {
    title: "Team Management",
    href: "/settings/team",
    icon: Users,
  },
  {
    title: "Permissions",
    href: "/settings/permissions",
    icon: Lock,
  },
  {
    title: "Integrations",
    href: "/settings/integrations",
    icon: Plug,
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
    icon: Bell,
  },
] as const;

export function SettingsSubMenu() {
  return (
    <nav className="space-y-1">
      {settingsNavItems.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start gap-2",
              isActive && "bg-muted"
            )
          }
        >
          <link.icon className="h-4 w-4" />
          {link.title}
        </NavLink>
      ))}
    </nav>
  );
}
