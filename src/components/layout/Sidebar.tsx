import { NavLink } from "react-router-dom";
import {
  Home,
  LayoutGrid,
  PlugZap,
  Sparkles,
  Zap,
  Bell,
  Users,
  FileText,
  Home as HomeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MenuItem {
  to: string;
  icon: React.ComponentType<any>;
  label: string;
}

export interface SidebarProps {
  collapsed: boolean;
  className?: string;
}

const menuItems: MenuItem[] = [
  { to: "/", icon: Home, label: "首页总览" },
  { to: "/rooms", icon: LayoutGrid, label: "房间" },
  { to: "/devices", icon: PlugZap, label: "设备" },
  { to: "/scenes", icon: Sparkles, label: "场景" },
  { to: "/energy", icon: Zap, label: "能耗" },
  { to: "/alerts", icon: Bell, label: "告警" },
  { to: "/members", icon: Users, label: "成员" },
  { to: "/logs", icon: FileText, label: "日志" },
];

const Sidebar = ({ collapsed, className }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "h-full glass border-r border-[hsl(var(--border))]",
        "flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[260px]",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 px-4 h-16 border-b border-[hsl(var(--border))]",
          collapsed ? "justify-center px-0" : "px-5"
        )}
      >
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
            "bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))]",
            "shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
          )}
        >
          <HomeIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>

        <div
          className={cn(
            "flex flex-col overflow-hidden transition-all duration-300",
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}
        >
          <span className="font-bold text-base whitespace-nowrap animate-gradient-text">
            SmartHome
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            智能家居控制中枢
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center gap-3 rounded-xl transition-all duration-200",
                  collapsed ? "h-11 w-11 justify-center mx-auto" : "h-11 px-3",
                  isActive
                    ? "bg-gradient-to-r from-[hsl(var(--primary)/0.2)] to-[hsl(var(--accent)/0.15)] text-white shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.3)]"
                    : "text-muted-foreground hover:text-white hover:bg-[hsl(var(--muted)/0.5)]"
                )
              }
              title={collapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full",
                        "bg-gradient-to-b from-[hsl(var(--primary))] to-[hsl(var(--accent))]",
                        "shadow-[0_0_10px_hsl(var(--primary)/0.8)]",
                        collapsed ? "left-0" : "-left-3"
                      )}
                    />
                  )}

                  <div
                    className={cn(
                      "relative flex items-center justify-center shrink-0",
                      "transition-all duration-200",
                      isActive && [
                        "text-[hsl(var(--primary))]",
                        "drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]",
                      ]
                    )}
                  >
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  </div>

                  <span
                    className={cn(
                      "font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300",
                      collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    )}
                  >
                    {item.label}
                  </span>

                  {isActive && !collapsed && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-[hsl(var(--accent))] shadow-[0_0_8px_hsl(var(--accent))] animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div
        className={cn(
          "border-t border-[hsl(var(--border))] p-3",
          "transition-all duration-300"
        )}
      >
        <div
          className={cn(
            "glass rounded-xl overflow-hidden",
            collapsed ? "p-2 flex justify-center" : "p-3"
          )}
        >
          {collapsed ? (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--primary)/0.3)] to-[hsl(var(--accent)/0.3)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[hsl(var(--accent))]" />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[hsl(var(--accent))]" />
                <span className="text-xs font-semibold text-white">AI 助手</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                智能优化您的家居环境，节能省电
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
