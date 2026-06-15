import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface AppStore {
  currentHouseId: string;
  currentUserId: string;
  theme: Theme;
  sidebarCollapsed: boolean;
  loading: boolean;
  setCurrentHouseId: (id: string) => void;
  setCurrentUserId: (id: string) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  currentHouseId: 'house-1',
  currentUserId: 'member-1',
  theme: 'dark',
  sidebarCollapsed: false,
  loading: false,
  setCurrentHouseId: (id) => set({ currentHouseId: id }),
  setCurrentUserId: (id) => set({ currentUserId: id }),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setLoading: (loading) => set({ loading }),
}));
