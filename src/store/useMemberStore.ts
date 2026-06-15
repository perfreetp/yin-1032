import { create } from 'zustand';
import {
  members as mockMembers,
  guestPasses as mockGuestPasses,
  type Member,
  type MemberRole,
  type GuestPass,
  type PermissionKey,
} from '@/mock/members';

type FilterRole = MemberRole | 'all';

interface MemberStore {
  members: Member[];
  guestPasses: GuestPass[];
  filterRole: FilterRole;
  fetchMembers: (houseId?: string) => Promise<void>;
  inviteMember: (member: Omit<Member, 'id' | 'createdAt' | 'lastActiveAt' | 'isOnline'>) => Member;
  updateMemberRole: (memberId: string, role: MemberRole, permissions?: PermissionKey[]) => void;
  createGuestPass: (guestPass: Omit<GuestPass, 'id' | 'usedCount' | 'revoked' | 'createdAt'>) => GuestPass;
  revokeGuestPass: (guestPassId: string) => void;
  setFilter: (role: FilterRole) => void;
}

export const useMemberStore = create<MemberStore>((set) => ({
  members: [],
  guestPasses: [],
  filterRole: 'all',
  fetchMembers: async (houseId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let membersResult = mockMembers;
    let guestPassesResult = mockGuestPasses;
    if (houseId) {
      membersResult = mockMembers.filter((m) => m.houseId === houseId);
      guestPassesResult = mockGuestPasses.filter((g) => g.houseId === houseId);
    }
    set({ members: membersResult, guestPasses: guestPassesResult });
  },
  inviteMember: (memberData) => {
    const newMember: Member = {
      ...memberData,
      id: `member-${Date.now()}`,
      isOnline: false,
      lastActiveAt: Date.now(),
      createdAt: Date.now(),
    };
    set((state) => ({ members: [...state.members, newMember] }));
    return newMember;
  },
  updateMemberRole: (memberId, role, permissions) => {
    set((state) => ({
      members: state.members.map((member) =>
        member.id === memberId
          ? {
              ...member,
              role,
              permissions: permissions || member.permissions,
            }
          : member
      ),
    }));
  },
  createGuestPass: (guestPassData) => {
    const newGuestPass: GuestPass = {
      ...guestPassData,
      id: `gp-${Date.now()}`,
      usedCount: 0,
      revoked: false,
      createdAt: Date.now(),
    };
    set((state) => ({ guestPasses: [...state.guestPasses, newGuestPass] }));
    return newGuestPass;
  },
  revokeGuestPass: (guestPassId) => {
    set((state) => ({
      guestPasses: state.guestPasses.map((gp) =>
        gp.id === guestPassId ? { ...gp, revoked: true } : gp
      ),
    }));
  },
  setFilter: (role) => set({ filterRole: role }),
}));
