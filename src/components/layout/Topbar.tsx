import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import {
  ChevronDown,
  Search,
  Bell,
  Settings,
  LogOut,
  User as UserIcon,
  Shield,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface House {
  id: string;
  name: string;
  location?: string;
}

export interface UserInfo {
  name: string;
  role: string;
  avatar?: string;
}

export interface TopbarProps {
  onToggleSidebar?: () => void;
  houses?: House[];
  currentHouse?: House;
  onHouseChange?: (house: House) => void;
  user?: UserInfo;
  unreadAlerts?: number;
  onLogout?: () => void;
  onSettings?: () => void;
  onProfile?: () => void;
  className?: string;
}

const defaultHouses: House[] = [
  { id: "1", name: "温馨家园", location: "北京市朝阳区" },
  { id: "2", name: "度假别墅", location: "三亚市海棠湾" },
  { id: "3", name: "办公空间", location: "上海市浦东新区" },
];

const defaultUser: UserInfo = {
  name: "管理员",
  role: "超级管理员",
};

const Topbar = ({
  onToggleSidebar,
  houses = defaultHouses,
  currentHouse,
  onHouseChange,
  user = defaultUser,
  unreadAlerts = 3,
  onLogout,
  onSettings,
  onProfile,
  className,
}: TopbarProps) => {
  const [now, setNow] = useState(dayjs());
  const [houseDropdownOpen, setHouseDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const houseDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const selectedHouse = currentHouse || houses[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (houseDropdownRef.current && !houseDropdownRef.current.contains(e.target as Node)) {
        setHouseDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        "h-16 glass border-b border-[hsl(var(--border))]",
        "flex items-center px-4 gap-4 shrink-0",
        className
      )}
    >
      <button
        onClick={onToggleSidebar}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-white hover:bg-[hsl(var(--muted)/0.5)] transition-all duration-200 lg:hidden"
      >
        <MenuIcon className="w-5 h-5" />
      </button>

      <div className="relative" ref={houseDropdownRef}>
        <button
          onClick={() => setHouseDropdownOpen(!houseDropdownOpen)}
          className={cn(
            "flex items-center gap-2 h-10 px-4 rounded-xl transition-all duration-200",
            "bg-[hsl(var(--muted)/0.4)] border border-transparent",
            "hover:bg-[hsl(var(--muted)/0.6)] hover:border-[hsl(var(--primary)/0.3)]",
            houseDropdownOpen && [
              "bg-[hsl(var(--primary)/0.1)] border-[hsl(var(--primary)/0.4)]",
              "shadow-[0_0_20px_hsl(var(--primary)/0.15)]",
            ]
          )}
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center">
            <div className="w-3 h-3 rounded-sm bg-white/90" />
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-semibold text-white leading-none">
              {selectedHouse.name}
            </span>
            {selectedHouse.location && (
              <span className="text-xs text-muted-foreground leading-none mt-0.5 hidden sm:block">
                {selectedHouse.location}
              </span>
            )}
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200",
              houseDropdownOpen && "rotate-180"
            )}
          />
        </button>

        {houseDropdownOpen && (
          <div
            className={cn(
              "absolute top-full left-0 mt-2 w-72 glass rounded-2xl overflow-hidden z-50",
              "border border-[hsl(var(--border))] shadow-[0_20px_60px_rgba(0,0,0,0.5)]",
              "animate-in fade-in slide-in-from-top-2 duration-200"
            )}
          >
            <div className="p-2">
              {houses.map((house) => (
                <button
                  key={house.id}
                  onClick={() => {
                    onHouseChange?.(house);
                    setHouseDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                    selectedHouse.id === house.id
                      ? "bg-[hsl(var(--primary)/0.15)] shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.3)]"
                      : "hover:bg-[hsl(var(--muted)/0.5)]"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      selectedHouse.id === house.id
                        ? "bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] shadow-[0_0_15px_hsl(var(--primary)/0.4)]"
                        : "bg-[hsl(var(--muted))]"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-sm",
                        selectedHouse.id === house.id ? "bg-white/90" : "bg-muted-foreground/40"
                      )}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div
                      className={cn(
                        "text-sm font-semibold",
                        selectedHouse.id === house.id ? "text-white" : "text-white/80"
                      )}
                    >
                      {house.name}
                    </div>
                    {house.location && (
                      <div className="text-xs text-muted-foreground">{house.location}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        className={cn(
          "relative flex-1 max-w-md transition-all duration-300",
          searchFocused && "max-w-lg"
        )}
      >
        <div
          className={cn(
            "flex items-center h-10 rounded-xl overflow-hidden transition-all duration-200",
            "bg-[hsl(var(--muted)/0.4)] border",
            searchFocused
              ? "border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--muted)/0.6)] shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
              : "border-transparent hover:border-[hsl(var(--border))]"
          )}
        >
          <div className="pl-3 pr-2 text-muted-foreground">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="搜索设备、场景、房间..."
            className="flex-1 h-full bg-transparent text-sm text-white placeholder:text-muted-foreground focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-2 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="hidden xl:flex items-center justify-center flex-1">
        <div className="flex items-baseline gap-3 px-5 py-2 rounded-xl glass">
          <div className="text-2xl font-bold text-white tracking-wider font-mono text-glow-primary">
            {now.format("HH:mm:ss")}
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-xs font-medium text-muted-foreground">
              {now.format("YYYY年MM月DD日")}
            </span>
            <span className="text-xs text-[hsl(var(--primary))] font-medium">
              {now.format("dddd")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          className={cn(
            "relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
            "bg-[hsl(var(--muted)/0.4)] text-muted-foreground",
            "hover:bg-[hsl(var(--muted)/0.6)] hover:text-white",
            unreadAlerts > 0 && "hover:shadow-[0_0_20px_hsl(var(--danger)/0.3)]"
          )}
        >
          <Bell className="w-5 h-5" />
          {unreadAlerts > 0 && (
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full",
                "bg-gradient-to-r from-[hsl(var(--danger))] to-[hsl(20_84%_60%)]",
                "text-white text-xs font-bold flex items-center justify-center px-1",
                "shadow-[0_0_10px_hsl(var(--danger)/0.6)] border-2 border-[hsl(var(--background))]"
              )}
            >
              {unreadAlerts > 99 ? "99+" : unreadAlerts}
            </span>
          )}
        </button>

        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className={cn(
              "flex items-center gap-2 h-10 pr-3 pl-1 rounded-xl transition-all duration-200",
              "bg-[hsl(var(--muted)/0.4)] border border-transparent",
              "hover:bg-[hsl(var(--muted)/0.6)] hover:border-[hsl(var(--primary)/0.3)]",
              userDropdownOpen && [
                "bg-[hsl(var(--primary)/0.1)] border-[hsl(var(--primary)/0.4)]",
                "shadow-[0_0_20px_hsl(var(--primary)/0.15)]",
              ]
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                "bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--accent))] to-[hsl(280_70%_60%)]",
                "shadow-[0_0_15px_hsl(var(--primary)/0.4)]"
              )}
            >
              <UserIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="text-sm font-semibold text-white leading-none">
                {user.name}
              </span>
              <span className="text-xs text-[hsl(var(--primary))] leading-none mt-0.5">
                {user.role}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform duration-200 hidden sm:block",
                userDropdownOpen && "rotate-180"
              )}
            />
          </button>

          {userDropdownOpen && (
            <div
              className={cn(
                "absolute top-full right-0 mt-2 w-64 glass rounded-2xl overflow-hidden z-50",
                "border border-[hsl(var(--border))] shadow-[0_20px_60px_rgba(0,0,0,0.5)]",
                "animate-in fade-in slide-in-from-top-2 duration-200"
              )}
            >
              <div className="p-4 border-b border-[hsl(var(--border))]">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      "bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--accent))] to-[hsl(280_70%_60%)]",
                      "shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
                    )}
                  >
                    <UserIcon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-white truncate">
                      {user.name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Shield className="w-3 h-3 text-[hsl(var(--primary))]" />
                      <span className="text-xs text-[hsl(var(--primary))] font-medium">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={() => {
                    onProfile?.();
                    setUserDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-[hsl(var(--muted)/0.5)] text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-[hsl(var(--primary)/0.1)] border border-[hsl(var(--primary)/0.2)] flex items-center justify-center text-[hsl(var(--primary))]">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">个人资料</div>
                    <div className="text-xs text-muted-foreground">查看和编辑个人信息</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSettings?.();
                    setUserDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-[hsl(var(--muted)/0.5)] text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-[hsl(var(--accent)/0.1)] border border-[hsl(var(--accent)/0.2)] flex items-center justify-center text-[hsl(var(--accent))]">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">系统设置</div>
                    <div className="text-xs text-muted-foreground">配置系统参数</div>
                  </div>
                </button>
              </div>

              <div className="p-2 border-t border-[hsl(var(--border))]">
                <button
                  onClick={() => {
                    onLogout?.();
                    setUserDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-[hsl(var(--danger)/0.1)] text-left group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[hsl(var(--danger)/0.1)] border border-[hsl(var(--danger)/0.2)] flex items-center justify-center text-[hsl(var(--danger))] group-hover:shadow-[0_0_15px_hsl(var(--danger)/0.3)]">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[hsl(var(--danger))]">退出登录</div>
                    <div className="text-xs text-muted-foreground">安全退出当前账户</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
