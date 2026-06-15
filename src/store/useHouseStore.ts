import { create } from 'zustand';
import { houses, rooms, type House, type Room } from '@/mock/houses';

interface HouseStore {
  houses: House[];
  rooms: Room[];
  currentHouseId: string;
  getHouses: () => Promise<House[]>;
  getRoomsByHouse: (houseId: string) => Room[];
  setCurrentHouse: (houseId: string) => void;
}

export const useHouseStore = create<HouseStore>((set, get) => ({
  houses: houses,
  rooms: rooms,
  currentHouseId: 'house-villa-001',
  getHouses: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    set({ houses, rooms });
    if (!get().currentHouseId && houses.length > 0) {
      set({ currentHouseId: houses[0].id });
    }
    return houses;
  },
  getRoomsByHouse: (houseId) => {
    return rooms.filter((room) => room.houseId === houseId);
  },
  setCurrentHouse: (houseId) => set({ currentHouseId: houseId }),
}));
