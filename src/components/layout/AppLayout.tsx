import { useState, useEffect, useMemo, ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import Topbar, { House, UserInfo } from "./Topbar";
import { useHouseStore } from "@/store/useHouseStore";
import { useAppStore } from "@/store/useAppStore";
import { useAlertStore } from "@/store/useAlertStore";
import { useMemberStore } from "@/store/useMemberStore";
import { useDeviceStore } from "@/store/useDeviceStore";
import { useSceneStore } from "@/store/useSceneStore";
import { useEnergyStore } from "@/store/useEnergyStore";
import { useLogStore } from "@/store/useLogStore";
import { roleInfo } from "@/mock/members";

export interface AppLayoutProps {
  children?: ReactNode;
  defaultCollapsed?: boolean;
  className?: string;
  houses?: House[];
  currentHouse?: House;
  onHouseChange?: (house: House) => void;
  user?: UserInfo;
  unreadAlerts?: number;
  onLogout?: () => void;
  onSettings?: () => void;
  onProfile?: () => void;
}

const AppLayout = ({
  children,
  defaultCollapsed = false,
  className,
  houses: propHouses,
  currentHouse: propCurrentHouse,
  onHouseChange: propOnHouseChange,
  user: propUser,
  unreadAlerts: propUnreadAlerts,
  onLogout,
  onSettings,
  onProfile,
}: AppLayoutProps) => {
  const { houses, setCurrentHouse: setHouseStoreCurrentHouse } = useHouseStore();
  const { currentHouseId, setCurrentHouseId } = useAppStore();
  const { unreadCount, fetchAlerts } = useAlertStore();
  const { members, fetchMembers } = useMemberStore();
  const { fetchDevices } = useDeviceStore();
  const { fetchScenes } = useSceneStore();
  const { fetchEnergy } = useEnergyStore();
  const { fetchLogs } = useLogStore();

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-collapsed");
      return saved !== null ? saved === "true" : defaultCollapsed;
    }
    return defaultCollapsed;
  });

  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (currentHouseId) {
      setHouseStoreCurrentHouse(currentHouseId);
      fetchDevices(currentHouseId);
      fetchScenes(currentHouseId);
      fetchEnergy(currentHouseId);
      fetchAlerts(currentHouseId);
      fetchMembers(currentHouseId);
      fetchLogs(currentHouseId);
    }
  }, [currentHouseId, setHouseStoreCurrentHouse, fetchDevices, fetchScenes, fetchEnergy, fetchAlerts, fetchMembers, fetchLogs]);

  const currentHouse = useMemo((): House => {
    if (propCurrentHouse) return propCurrentHouse;
    const found = houses.find((h) => h.id === currentHouseId);
    if (found) return { id: found.id, name: found.name, location: found.address };
    if (houses.length > 0) return { id: houses[0].id, name: houses[0].name, location: houses[0].address };
    return { id: 'default', name: '加载中...', location: '' };
  }, [propCurrentHouse, houses, currentHouseId]);

  const displayHouses = useMemo(() => {
    if (propHouses && propHouses.length > 0) return propHouses;
    return houses.map((h) => ({
      id: h.id,
      name: h.name,
      location: h.address,
    }));
  }, [propHouses, houses]);

  const displayUnreadAlerts = propUnreadAlerts !== undefined ? propUnreadAlerts : unreadCount;

  const currentUser = useMemo((): UserInfo => {
    if (propUser) return propUser;
    const owner = members.find((m) => m.houseId === currentHouseId && m.role === "owner");
    if (owner) {
      return {
        name: owner.name,
        role: roleInfo[owner.role].label,
        avatar: owner.avatar,
      };
    }
    return { name: '用户', role: '家庭成员' };
  }, [propUser, members, currentHouseId]);

  const handleHouseChange = (house: House) => {
    if (propOnHouseChange) {
      propOnHouseChange(house);
    } else {
      setCurrentHouseId(house.id);
      setHouseStoreCurrentHouse(house.id);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const content = children || <Outlet />;

  return (
    <div className={cn("h-screen w-screen flex flex-col overflow-hidden", className)}>
      {isMobile && mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div className="flex h-full w-full">
        <div
          className={cn(
            "z-50 shrink-0 transition-all duration-300 ease-in-out",
            isMobile
              ? cn(
                  "fixed left-0 top-0 h-full",
                  mobileSidebarOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-full opacity-0 pointer-events-none"
                )
              : "relative h-full"
          )}
        >
          <Sidebar collapsed={isMobile ? false : collapsed} />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="shrink-0 relative z-30">
            <div className="relative">
              <Topbar
                houses={displayHouses}
                currentHouse={currentHouse}
                onHouseChange={handleHouseChange}
                user={currentUser}
                unreadAlerts={displayUnreadAlerts}
                onLogout={onLogout}
                onSettings={onSettings}
                onProfile={onProfile}
                onToggleSidebar={toggleSidebar}
              />

              {!isMobile && (
                <button
                  onClick={toggleSidebar}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 z-10",
                    "w-7 h-14 rounded-r-xl flex items-center justify-center",
                    "glass border border-l-0 border-[hsl(var(--border))]",
                    "text-muted-foreground hover:text-white",
                    "transition-all duration-300 ease-in-out",
                    "hover:bg-[hsl(var(--primary)/0.1)] hover:border-[hsl(var(--primary)/0.4)] hover:shadow-[0_0_15px_hsl(var(--primary)/0.2)]",
                    collapsed ? "-left-1" : "-left-7"
                  )}
                  title={collapsed ? "展开侧边栏" : "折叠侧边栏"}
                >
                  {collapsed ? (
                    <PanelLeft className="w-4 h-4" />
                  ) : (
                    <PanelLeftClose className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>

          <main className="flex-1 overflow-auto relative">
            <div
              className="absolute inset-0 opacity-[0.02] pointer-events-none bg-grid-pattern"
              aria-hidden="true"
            />
            <div
              className={cn(
                "relative z-10 min-h-full p-4 md:p-6 lg:p-8",
                "transition-all duration-300 ease-in-out"
              )}
            >
              {content}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
