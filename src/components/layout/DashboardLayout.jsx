import { Outlet } from "react-router-dom";

import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

import SidebarMenuApp from "./Sidebar";

function DashboardLayout() {
  return (
    <SidebarProvider>
      <SidebarMenuApp />

      <main className="flex-1">
        <header className="flex h-16 items-center border-b px-6">
          <SidebarTrigger />
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}

export default DashboardLayout;
