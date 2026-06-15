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
    id: 'house-villa-001',
    name: '阳光别墅',
    address: '北京市朝阳区阳光花园别墅区A8栋',
    avatar: '�',
  },
  {
    id: 'house-apartment-002',
    name: '海岸公寓',
    address: '三亚市海棠湾海岸度假公寓12栋2201',
    avatar: '�',
  },
];

export const rooms: Room[] = [
  { id: 'room-villa-001', houseId: 'house-villa-001', name: '客厅', type: 'living', icon: 'sofa' },
  { id: 'room-villa-002', houseId: 'house-villa-001', name: '主卧', type: 'bedroom', icon: 'bed' },
  { id: 'room-villa-003', houseId: 'house-villa-001', name: '次卧', type: 'bedroom', icon: 'bed-double' },
  { id: 'room-villa-004', houseId: 'house-villa-001', name: '儿童房', type: 'bedroom', icon: 'baby' },
  { id: 'room-villa-005', houseId: 'house-villa-001', name: '厨房', type: 'kitchen', icon: 'cooking-pot' },
  { id: 'room-villa-006', houseId: 'house-villa-001', name: '主卫', type: 'bathroom', icon: 'bath' },
  { id: 'room-villa-007', houseId: 'house-villa-001', name: '客卫', type: 'bathroom', icon: 'shower-head' },
  { id: 'room-villa-008', houseId: 'house-villa-001', name: '花园露台', type: 'balcony', icon: 'sun' },
  { id: 'room-apt-001', houseId: 'house-apartment-002', name: '客厅', type: 'living', icon: 'sofa' },
  { id: 'room-apt-002', houseId: 'house-apartment-002', name: '主卧', type: 'bedroom', icon: 'bed' },
  { id: 'room-apt-003', houseId: 'house-apartment-002', name: '次卧', type: 'bedroom', icon: 'bed-double' },
  { id: 'room-apt-004', houseId: 'house-apartment-002', name: '厨房', type: 'kitchen', icon: 'cooking-pot' },
  { id: 'room-apt-005', houseId: 'house-apartment-002', name: '卫生间', type: 'bathroom', icon: 'bath' },
  { id: 'room-apt-006', houseId: 'house-apartment-002', name: '海景阳台', type: 'balcony', icon: 'sun' },
];
