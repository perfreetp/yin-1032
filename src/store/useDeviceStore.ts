import { create } from 'zustand';
import { devices as mockDevices } from '@/mock/devices';
import { members } from '@/mock/members';
import type { Device, DeviceCategory, LightState, ACState, CurtainState, LockDeviceState, CameraState, SensorReading } from '@/types/device';
import { useLogStore } from './useLogStore';
import { useEnergyStore } from './useEnergyStore';
import { useAppStore } from './useAppStore';

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

const getCurrentUser = () => {
  const userId = useAppStore.getState().currentUserId;
  const user = members.find((m) => m.id === userId);
  return { userId, userName: user?.name || '未知用户' };
};

const generateDetail = (device: Device, patch: Partial<DeviceState>): string => {
  const parts: string[] = [];

  if ('power' in patch && patch.power !== undefined) {
    parts.push(patch.power ? '打开设备' : '关闭设备');
  }

  if ('brightness' in patch && patch.brightness !== undefined) {
    parts.push(`亮度${patch.brightness}%`);
  }

  if ('colorTemp' in patch && patch.colorTemp !== undefined) {
    parts.push(`色温${patch.colorTemp}K`);
  }

  if ('color' in patch && patch.color !== undefined) {
    parts.push(`颜色${patch.color}`);
  }

  if ('temperature' in patch && patch.temperature !== undefined) {
    parts.push(`温度${patch.temperature}°C`);
  }

  if ('mode' in patch && patch.mode !== undefined) {
    const modeMap: Record<string, string> = {
      cool: '制冷模式',
      heat: '制热模式',
      auto: '自动模式',
      dry: '除湿模式',
      fan: '送风模式',
    };
    parts.push(modeMap[patch.mode as string] || `${patch.mode}模式`);
  }

  if ('fanSpeed' in patch && patch.fanSpeed !== undefined) {
    parts.push(patch.fanSpeed === 'auto' ? '风速自动' : `风速${patch.fanSpeed}档`);
  }

  if ('swing' in patch && patch.swing !== undefined) {
    parts.push(patch.swing ? '开启扫风' : '关闭扫风');
  }

  if ('position' in patch && patch.position !== undefined) {
    parts.push(`开合度${patch.position}%`);
  }

  if ('volume' in patch && patch.volume !== undefined) {
    parts.push(`音量${patch.volume}%`);
  }

  return parts.join('，');
};

const estimateEnergyChange = (device: Device, patch: Partial<DeviceState>, isTurningOn: boolean | null): number => {
  if (device.status !== 'online') return 0;

  const baseEnergy: Record<string, number> = {
    ac: 0.02,
    light: 0.005,
    tv: 0.008,
    speaker: 0.003,
    curtain: 0.001,
    camera: 0.002,
    sensor: 0.0005,
    lock: 0.0005,
  };

  let multiplier = 1;

  if (isTurningOn === false) {
    return 0;
  }

  if (device.category === 'ac' && 'temperature' in patch && patch.temperature !== undefined) {
    const temp = patch.temperature;
    const currentState = device.state as { temperature: number; mode: string };
    const patchAsAC = patch as Partial<{ temperature: number; mode: string }>;
    const mode = patchAsAC.mode || currentState.mode;
    if (mode === 'cool') {
      multiplier = Math.max(0.5, 1 + ((currentState.temperature || 26) - temp) * 0.15);
    } else if (mode === 'heat') {
      multiplier = Math.max(0.5, 1 + (temp - (currentState.temperature || 26)) * 0.15);
    }
  }

  if (device.category === 'light' && 'brightness' in patch && patch.brightness !== undefined) {
    multiplier = (patch.brightness || 50) / 100;
  }

  const base = baseEnergy[device.category] || 0.001;
  return Number((base * multiplier).toFixed(6));
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
    const device = get().devices.find((d) => d.id === id);
    if (!device) return;

    let isTurningOn: boolean | null = null;
    let action = '切换设备';
    let newState = { ...device.state };

    if (hasPowerKey(device.state)) {
      isTurningOn = !device.state.power;
      action = isTurningOn ? '打开设备' : '关闭设备';
      newState = { ...device.state, power: isTurningOn };
    } else if ('position' in device.state) {
      isTurningOn = device.state.position === 0;
      action = isTurningOn ? '打开窗帘' : '关闭窗帘';
      newState = { position: isTurningOn ? 100 : 0 };
    } else if ('state' in device.state && 'battery' in device.state) {
      isTurningOn = device.state.state === 'unlocked';
      action = isTurningOn ? '开锁' : '锁定';
      newState = { ...device.state, state: isTurningOn ? 'locked' : 'unlocked' };
    }

    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === id ? { ...d, state: newState } : d
      ),
    }));

    const { userId, userName } = getCurrentUser();
    const detail = generateDetail(device, newState as Partial<DeviceState>);
    const energyChange = estimateEnergyChange(device, newState as Partial<DeviceState>, isTurningOn);

    useLogStore.getState().addLog({
      type: 'operation',
      houseId: device.houseId,
      userId,
      userName,
      action,
      targetType: 'device',
      targetId: device.id,
      targetName: device.name,
      result: 'success',
      detail,
    });

    if (energyChange > 0) {
      useEnergyStore.getState().incrementUsage(device.id, energyChange);
    }
    useEnergyStore.getState().updateRealTimeUsage(get().devices);
  },
  updateDeviceState: (id, patch) => {
    const device = get().devices.find((d) => d.id === id);
    if (!device) return;

    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === id ? { ...d, state: { ...d.state, ...patch } } : d
      ),
    }));

    const updatedDevice = get().devices.find((d) => d.id === id);
    if (!updatedDevice) return;

    let action = '调节设备';
    if ('brightness' in patch) action = '调节亮度';
    else if ('colorTemp' in patch) action = '调节色温';
    else if ('color' in patch) action = '调节颜色';
    else if ('temperature' in patch) action = '调节温度';
    else if ('mode' in patch) action = '切换模式';
    else if ('fanSpeed' in patch) action = '调节风速';
    else if ('swing' in patch) action = '调节扫风';
    else if ('position' in patch) action = '调节窗帘';
    else if ('volume' in patch) action = '调节音量';
    else if ('power' in patch) action = patch.power ? '打开设备' : '关闭设备';

    const { userId, userName } = getCurrentUser();
    const detail = generateDetail(updatedDevice, patch);
    const isTurningOn = 'power' in patch ? patch.power : null;
    const energyChange = estimateEnergyChange(updatedDevice, patch, isTurningOn);

    useLogStore.getState().addLog({
      type: 'operation',
      houseId: device.houseId,
      userId,
      userName,
      action,
      targetType: 'device',
      targetId: device.id,
      targetName: device.name,
      result: 'success',
      detail,
    });

    if (energyChange > 0) {
      useEnergyStore.getState().incrementUsage(device.id, energyChange);
    }
    useEnergyStore.getState().updateRealTimeUsage(get().devices);
  },
  batchToggle: (ids, power) => {
    const targetDevices = get().devices.filter((d) => ids.includes(d.id));
    if (targetDevices.length === 0) return;

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

    const { userId, userName } = getCurrentUser();
    const houseId = targetDevices[0].houseId;

    const categories = [...new Set(targetDevices.map((d) => d.category))];
    let targetName = `${targetDevices.length} 台设备`;
    if (categories.length === 1) {
      const categoryNames: Record<string, string> = {
        light: '灯光',
        ac: '空调',
        curtain: '窗帘',
        lock: '门锁',
        camera: '摄像头',
        sensor: '传感器',
        tv: '电视',
        speaker: '音箱',
      };
      targetName = `${targetDevices.length} 台${categoryNames[categories[0]] || categories[0]}设备`;
    }

    let totalEnergy = 0;
    const updatedDevices = get().devices.filter((d) => ids.includes(d.id));
    updatedDevices.forEach((device) => {
      const energyChange = estimateEnergyChange(device, {} as Partial<DeviceState>, power);
      totalEnergy += energyChange;
    });

    useLogStore.getState().addLog({
      type: 'operation',
      houseId,
      userId,
      userName,
      action: power ? '批量开启' : '批量关闭',
      targetType: 'device',
      targetName,
      result: 'success',
      detail: `${power ? '开启' : '关闭'} ${targetDevices.length} 台设备`,
    });

    if (totalEnergy > 0) {
      useEnergyStore.getState().incrementUsage('batch', totalEnergy);
    }
    useEnergyStore.getState().updateRealTimeUsage(get().devices);
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

    const { userId, userName } = getCurrentUser();
    useLogStore.getState().addLog({
      type: 'operation',
      houseId: device.houseId,
      userId,
      userName,
      action: '临时开锁',
      targetType: 'device',
      targetId: device.id,
      targetName: device.name,
      result: 'success',
      detail: `临时开锁，${(duration / 1000).toFixed(0)} 秒后自动锁定`,
    });

    setTimeout(() => {
      set((state) => ({
        devices: state.devices.map((d) =>
          d.id === id && 'state' in d.state && 'battery' in d.state
            ? { ...d, state: { ...d.state, state: 'locked' as const } }
            : d
        ),
      }));

      useLogStore.getState().addLog({
        type: 'operation',
        houseId: device.houseId,
        userId,
        userName,
        action: '自动锁定',
        targetType: 'device',
        targetId: device.id,
        targetName: device.name,
        result: 'success',
        detail: '临时开锁超时，已自动锁定',
      });
    }, duration);
  },
}));
