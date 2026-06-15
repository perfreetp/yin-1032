import { create } from 'zustand';
import { devices as mockDevices } from '@/mock/devices';
import type { Device, DeviceCategory, LightState, ACState, CurtainState, LockDeviceState, CameraState, SensorReading } from '@/types/device';

type DeviceState = LightState | ACState | CurtainState | LockDeviceState | CameraState | SensorReading;

interface DeviceStore {
  devices: Device[];
  selectedDeviceIds: string[];
  filterCategory: DeviceCategory | 'all';
  filterRoomId: string | 'all';
  searchQuery: string;
  fetchDevices: (houseId?: string) => Promise<Device[]>;
  toggleDevice: (id: string) => void;
  updateDeviceState: (id: string, patch: Partial<DeviceState>) => void;
  batchToggle: (ids: string[], power: boolean) => void;
  pairDevice: (device: Omit<Device, 'id' | 'pairedAt'>) => void;
  toggleSelect: (id: string) => void;
  clearSelection: () => void;
  setFilter: (filters: Partial<Pick<DeviceStore, 'filterCategory' | 'filterRoomId'>>) => void;
  setSearch: (query: string) => void;
  temporaryUnlock: (id: string, duration?: number) => void;
}

const hasPowerKey = (state: DeviceState): state is { power: boolean } => {
  return 'power' in state;
};

export const useDeviceStore = create<DeviceStore>((set, get) => ({
  devices: [],
  selectedDeviceIds: [],
  filterCategory: 'all',
  filterRoomId: 'all',
  searchQuery: '',
  fetchDevices: async (houseId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let result = mockDevices;
    if (houseId) {
      result = mockDevices.filter((d) => d.houseId === houseId);
    }
    set({ devices: result as Device[] });
    return result as Device[];
  },
  toggleDevice: (id) => {
    set((state) => ({
      devices: state.devices.map((device) => {
        if (device.id !== id) return device;
        if (hasPowerKey(device.state)) {
          return { ...device, state: { ...device.state, power: !device.state.power } };
        }
        if ('state' in device.state && 'battery' in device.state) {
          return device;
        }
        if ('position' in device.state) {
          return { ...device, state: { position: device.state.position === 0 ? 100 : 0 } };
        }
        return device;
      }),
    }));
  },
  updateDeviceState: (id, patch) => {
    set((state) => ({
      devices: state.devices.map((device) =>
        device.id === id
          ? { ...device, state: { ...device.state, ...patch } }
          : device
      ),
    }));
  },
  batchToggle: (ids, power) => {
    set((state) => ({
      devices: state.devices.map((device) => {
        if (!ids.includes(device.id)) return device;
        if (hasPowerKey(device.state)) {
          return { ...device, state: { ...device.state, power } };
        }
        if ('position' in device.state) {
          return { ...device, state: { position: power ? 100 : 0 } };
        }
        return device;
      }),
    }));
  },
  pairDevice: (deviceData) => {
    const newDevice: Device = {
      ...deviceData,
      id: `dev-${Date.now()}`,
      pairedAt: Date.now(),
    };
    set((state) => ({ devices: [...state.devices, newDevice] }));
  },
  toggleSelect: (id) => {
    set((state) => ({
      selectedDeviceIds: state.selectedDeviceIds.includes(id)
        ? state.selectedDeviceIds.filter((selectedId) => selectedId !== id)
        : [...state.selectedDeviceIds, id],
    }));
  },
  clearSelection: () => set({ selectedDeviceIds: [] }),
  setFilter: (filters) => set((state) => ({ ...state, ...filters })),
  setSearch: (query) => set({ searchQuery: query }),
  temporaryUnlock: (id, duration = 30000) => {
    const device = get().devices.find((d) => d.id === id);
    if (!device || device.category !== 'lock') return;

    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === id && 'state' in d.state && 'battery' in d.state
          ? {
              ...d,
              state: {
                ...d.state,
                state: 'unlocked' as const,
                lastUnlockTime: Date.now(),
              },
            }
          : d
      ),
    }));

    setTimeout(() => {
      set((state) => ({
        devices: state.devices.map((d) =>
          d.id === id && 'state' in d.state && 'battery' in d.state
            ? { ...d, state: { ...d.state, state: 'locked' as const } }
            : d
        ),
      }));
    }, duration);
  },
}));
