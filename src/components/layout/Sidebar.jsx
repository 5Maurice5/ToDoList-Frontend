import { CheckSquare, Users, Tags, Folder } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

import { Link, useLocation } from "react-router-dom";

const items = [
  {
    title: "Tareas",
    url: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Categorías",
    url: "/categories",
    icon: Folder,
  },
  {
    title: "Etiquetas",
    url: "/tags",
    icon: Tags,
  },
];

function SidebarMenuApp() {
  const location = useLocation();

  return (
    <Sidebar>
      {/* Logo / Header */}
      <SidebarHeader className="border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <CheckSquare className="h-5 w-5" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold">Todo App</span>

            <span className="text-xs text-muted-foreground">
              Gestión de tareas
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Menú */}
      <SidebarContent>
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className="px-3 text-xs uppercase tracking-wider">
            Menú
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const Icon = item.icon;

                const isActive = location.pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link to={item.url} />}
                      isActive={isActive}
                      size="lg"
                      className="gap-3"
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default SidebarMenuApp;
