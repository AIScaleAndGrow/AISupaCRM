import { Outlet } from "react-router-dom";
import { SettingsSubMenu } from "./SettingsSidebar";

export default function SettingsPageLayout() {
  return (
    <div className="flex h-full">
      <aside className="w-64 shrink-0">
        <SettingsSubMenu />
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
