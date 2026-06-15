export interface Room {
  id: string;
  houseId: string;
  name: string;
  type: string;
  icon: string;
}

export interface House {
  id: string;
  name: string;
  address: string;
  avatar?: string;
}

export const houses: House[] = [
  {
    id: 'house-1',
    name: '阳光花园',
    address: '北京市朝阳区阳光花园小区3栋1801',
    avatar: '🏠',
  },
  {
    id: 'house-2',
    name: '海景别墅',
    address: '三亚市海棠湾海景别墅区A8栋',
    avatar: '🏡',
  },
];

export const rooms: Room[] = [
  { id: 'room-1', houseId: 'house-1', name: '客厅', type: 'living', icon: 'sofa' },
  { id: 'room-2', houseId: 'house-1', name: '主卧', type: 'bedroom', icon: 'bed' },
  { id: 'room-3', houseId: 'house-1', name: '次卧', type: 'bedroom', icon: 'bed-double' },
  { id: 'room-4', houseId: 'house-1', name: '厨房', type: 'kitchen', icon: 'cooking-pot' },
  { id: 'room-5', houseId: 'house-1', name: '卫生间', type: 'bathroom', icon: 'bath' },
  { id: 'room-6', houseId: 'house-1', name: '阳台', type: 'balcony', icon: 'sun' },
  { id: 'room-7', houseId: 'house-2', name: '客厅', type: 'living', icon: 'sofa' },
  { id: 'room-8', houseId: 'house-2', name: '主卧', type: 'bedroom', icon: 'bed' },
];
