import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";
import zhCN from "antd/locale/zh_CN";
import AppLayout from "@/components/layout/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import RoomsPage from "@/pages/RoomsPage";
import DevicesPage from "@/pages/DevicesPage";
import ScenesPage from "@/pages/ScenesPage";
import SceneEditorPage from "@/pages/SceneEditorPage";
import EnergyPage from "@/pages/EnergyPage";
import AlertsPage from "@/pages/AlertsPage";
import MembersPage from "@/pages/MembersPage";
import LogsPage from "@/pages/LogsPage";

const antdTheme = {
  token: {
    colorPrimary: "#3B82F6",
    colorInfo: "#06B6D4",
    colorSuccess: "#10B981",
    colorWarning: "#F97316",
    colorError: "#EF4444",
    colorBgBase: "#0B1220",
    colorBgContainer: "#0F172A",
    colorBgElevated: "#1E293B",
    colorBorder: "rgba(255,255,255,0.08)",
    colorBorderSecondary: "rgba(255,255,255,0.05)",
    colorTextBase: "#E2E8F0",
    colorTextSecondary: "#94A3B8",
    colorTextTertiary: "#64748B",
    borderRadius: 12,
    fontFamily: "Manrope, 'PingFang SC', 'Microsoft YaHei', sans-serif",
  },
  components: {
    Layout: {
      headerBg: "transparent",
      bodyBg: "transparent",
      siderBg: "transparent",
    },
    Menu: {
      darkItemBg: "transparent",
      darkSubMenuItemBg: "transparent",
      darkItemSelectedBg: "rgba(59,130,246,0.15)",
      darkItemSelectedColor: "#3B82F6",
      itemBg: "transparent",
      subMenuItemBg: "transparent",
      itemSelectedBg: "rgba(59,130,246,0.15)",
      itemSelectedColor: "#3B82F6",
      itemHoverBg: "rgba(255,255,255,0.05)",
      itemHoverColor: "#06B6D4",
      itemBorderRadius: 10,
      itemHeight: 44,
      iconSize: 18,
    },
    Tabs: {
      itemColor: "#64748B",
      itemSelectedColor: "#06B6D4",
      itemHoverColor: "#94A3B8",
      inkBarColor: "#06B6D4",
      itemActiveBg: "rgba(6,182,212,0.08)",
      cardBg: "rgba(255,255,255,0.02)",
      horizontalItemPadding: "16px 20px",
    },
    Button: {
      colorPrimary: "#3B82F6",
      colorPrimaryHover: "#2563EB",
      colorPrimaryActive: "#1D4ED8",
      controlOutline: "rgba(59,130,246,0.3)",
      primaryShadow: "0 4px 14px rgba(59,130,246,0.4)",
      defaultBg: "rgba(255,255,255,0.04)",
      defaultBorderColor: "rgba(255,255,255,0.08)",
      defaultColor: "#E2E8F0",
      textHoverBg: "rgba(255,255,255,0.06)",
      algorithm: true,
    },
    Card: {
      colorBgContainer: "rgba(15,23,42,0.6)",
      colorBorderSecondary: "rgba(255,255,255,0.06)",
      borderRadiusLG: 16,
    },
    Modal: {
      contentBg: "#0F172A",
      headerBg: "rgba(255,255,255,0.02)",
      headerBorderBottom: "1px solid rgba(255,255,255,0.06)",
      bodyPadding: 24,
      maskBg: "rgba(0,0,0,0.7)",
    },
    Drawer: {
      colorBgElevated: "#0F172A",
      colorBorderSecondary: "rgba(255,255,255,0.08)",
    },
    Slider: {
      trackBg: "linear-gradient(90deg, #3B82F6, #06B6D4)",
      trackHoverBg: "linear-gradient(90deg, #2563EB, #0891B2)",
      railBg: "rgba(255,255,255,0.08)",
      handleColor: "#06B6D4",
      handleActiveColor: "#0891B2",
      handleBorderColor: "#06B6D4",
      handleSize: 22,
      handleLineWidth: 3,
    },
    Input: {
      colorBgContainer: "rgba(255,255,255,0.03)",
      colorBorder: "rgba(255,255,255,0.08)",
      colorTextPlaceholder: "#475569",
      activeBorderColor: "#3B82F6",
      hoverBorderColor: "rgba(59,130,246,0.5)",
      addonBg: "rgba(255,255,255,0.04)",
      algorithm: true,
    },
    Select: {
      colorBgContainer: "rgba(255,255,255,0.03)",
      colorBorder: "rgba(255,255,255,0.08)",
      optionSelectedBg: "rgba(59,130,246,0.15)",
      optionActiveBg: "rgba(255,255,255,0.05)",
      optionSelectedColor: "#3B82F6",
      algorithm: true,
    },
    Dropdown: {
      colorBgElevated: "#0F172A",
      controlItemBgActive: "rgba(59,130,246,0.15)",
      controlItemBgHover: "rgba(255,255,255,0.05)",
    },
    Table: {
      colorBgContainer: "rgba(15,23,42,0.4)",
      colorBgElevated: "rgba(15,23,42,0.6)",
      colorBorderSecondary: "rgba(255,255,255,0.05)",
      headerBg: "rgba(255,255,255,0.03)",
      headerColor: "#94A3B8",
      rowHoverBg: "rgba(255,255,255,0.03)",
      algorithm: true,
    },
    Switch: {
      colorPrimary: "#3B82F6",
      handleBg: "#FFFFFF",
      trackMinWidth: 44,
      trackHeight: 24,
      handleSize: 20,
    },
    Badge: {
      colorPrimary: "#EF4444",
    },
    Avatar: {
      colorBgContainer: "rgba(59,130,246,0.15)",
      colorTextPlaceholder: "#3B82F6",
      fontFamily: "Orbitron, sans-serif",
    },
    Tag: {
      borderRadiusSM: 6,
      borderRadiusLG: 8,
      defaultBg: "rgba(255,255,255,0.05)",
      defaultColor: "#94A3B8",
    },
    Statistic: {
      titleFontSize: 13,
      contentFontSize: 28,
    },
    Progress: {
      defaultColor: "#3B82F6",
      remainingColor: "rgba(255,255,255,0.06)",
      textColor: "#94A3B8",
      algorithm: true,
    },
  },
};

export default function App() {
  return (
    <ConfigProvider locale={zhCN} theme={antdTheme}>
      <AntdApp>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/:roomId" element={<RoomsPage />} />
              <Route path="/devices" element={<DevicesPage />} />
              <Route path="/devices/:deviceId" element={<DevicesPage />} />
              <Route path="/scenes" element={<ScenesPage />} />
              <Route path="/scenes/editor" element={<SceneEditorPage />} />
              <Route path="/energy" element={<EnergyPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="/logs" element={<LogsPage />} />
            </Route>
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-deepspace-900 text-white">
                  <div className="text-center">
                    <h1 className="text-6xl font-orbitron font-bold glow-text mb-4">404</h1>
                    <p className="text-slate-400 mb-8">页面未找到，请返回首页</p>
                    <a
                      href="/dashboard"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium shadow-glow-primary hover:shadow-glow-lg transition-all"
                    >
                      返回首页
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </Router>
      </AntdApp>
    </ConfigProvider>
  );
}
