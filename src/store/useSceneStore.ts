import { create } from 'zustand';
import { scenes as mockScenes, type Scene, type SceneTrigger, type SceneAction } from '@/mock/scenes';

interface SceneStore {
  scenes: Scene[];
  activeSceneId: string | null;
  editingScene: Scene | null;
  fetchScenes: (houseId?: string) => Promise<Scene[]>;
  runScene: (sceneId: string) => Promise<void>;
  createScene: (scene: Omit<Scene, 'id' | 'createdAt'>) => Scene;
  updateScene: (sceneId: string, patch: Partial<Scene>) => void;
  deleteScene: (sceneId: string) => void;
  toggleSceneEnabled: (sceneId: string) => void;
  setEditingScene: (scene: Scene | null) => void;
  addTrigger: (sceneId: string, trigger: Omit<SceneTrigger, 'id'>) => void;
  updateTrigger: (sceneId: string, triggerId: string, patch: Partial<SceneTrigger>) => void;
  removeTrigger: (sceneId: string, triggerId: string) => void;
  addAction: (sceneId: string, action: Omit<SceneAction, 'id'>) => void;
  updateAction: (sceneId: string, actionId: string, patch: Partial<SceneAction>) => void;
  removeAction: (sceneId: string, actionId: string) => void;
  reorderActions: (sceneId: string, actionIds: string[]) => void;
}

export const useSceneStore = create<SceneStore>((set) => ({
  scenes: [],
  activeSceneId: null,
  editingScene: null,
  fetchScenes: async (houseId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let result = mockScenes;
    if (houseId) {
      result = mockScenes.filter((s) => s.houseId === houseId);
    }
    set({ scenes: result });
    return result;
  },
  runScene: async (sceneId) => {
    set({ activeSceneId: sceneId });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId ? { ...scene, lastRunAt: Date.now() } : scene
      ),
      activeSceneId: null,
    }));
  },
  createScene: (sceneData) => {
    const newScene: Scene = {
      ...sceneData,
      id: `scene-${Date.now()}`,
      createdAt: Date.now(),
    };
    set((state) => ({ scenes: [...state.scenes, newScene] }));
    return newScene;
  },
  updateScene: (sceneId, patch) => {
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId ? { ...scene, ...patch } : scene
      ),
      editingScene:
        state.editingScene?.id === sceneId
          ? { ...state.editingScene, ...patch }
          : state.editingScene,
    }));
  },
  deleteScene: (sceneId) => {
    set((state) => ({
      scenes: state.scenes.filter((scene) => scene.id !== sceneId),
      editingScene: state.editingScene?.id === sceneId ? null : state.editingScene,
    }));
  },
  toggleSceneEnabled: (sceneId) => {
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId ? { ...scene, enabled: !scene.enabled } : scene
      ),
    }));
  },
  setEditingScene: (scene) => {
    set({ editingScene: scene });
  },
  addTrigger: (sceneId, trigger) => {
    const newTrigger: SceneTrigger = { ...trigger, id: `trig-${Date.now()}` };
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId
          ? { ...scene, triggers: [...scene.triggers, newTrigger] }
          : scene
      ),
      editingScene:
        state.editingScene?.id === sceneId
          ? { ...state.editingScene, triggers: [...state.editingScene.triggers, newTrigger] }
          : state.editingScene,
    }));
  },
  updateTrigger: (sceneId, triggerId, patch) => {
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId
          ? {
              ...scene,
              triggers: scene.triggers.map((t) =>
                t.id === triggerId ? { ...t, ...patch } : t
              ),
            }
          : scene
      ),
      editingScene:
        state.editingScene?.id === sceneId
          ? {
              ...state.editingScene,
              triggers: state.editingScene.triggers.map((t) =>
                t.id === triggerId ? { ...t, ...patch } : t
              ),
            }
          : state.editingScene,
    }));
  },
  removeTrigger: (sceneId, triggerId) => {
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId
          ? { ...scene, triggers: scene.triggers.filter((t) => t.id !== triggerId) }
          : scene
      ),
      editingScene:
        state.editingScene?.id === sceneId
          ? {
              ...state.editingScene,
              triggers: state.editingScene.triggers.filter((t) => t.id !== triggerId),
            }
          : state.editingScene,
    }));
  },
  addAction: (sceneId, action) => {
    const newAction: SceneAction = { ...action, id: `act-${Date.now()}` };
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId
          ? { ...scene, actions: [...scene.actions, newAction] }
          : scene
      ),
      editingScene:
        state.editingScene?.id === sceneId
          ? { ...state.editingScene, actions: [...state.editingScene.actions, newAction] }
          : state.editingScene,
    }));
  },
  updateAction: (sceneId, actionId, patch) => {
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId
          ? {
              ...scene,
              actions: scene.actions.map((a) =>
                a.id === actionId ? { ...a, ...patch } : a
              ),
            }
          : scene
      ),
      editingScene:
        state.editingScene?.id === sceneId
          ? {
              ...state.editingScene,
              actions: state.editingScene.actions.map((a) =>
                a.id === actionId ? { ...a, ...patch } : a
              ),
            }
          : state.editingScene,
    }));
  },
  removeAction: (sceneId, actionId) => {
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId
          ? { ...scene, actions: scene.actions.filter((a) => a.id !== actionId) }
          : scene
      ),
      editingScene:
        state.editingScene?.id === sceneId
          ? {
              ...state.editingScene,
              actions: state.editingScene.actions.filter((a) => a.id !== actionId),
            }
          : state.editingScene,
    }));
  },
  reorderActions: (sceneId, actionIds) => {
    set((state) => {
      const scene = state.scenes.find((s) => s.id === sceneId) || state.editingScene;
      if (!scene || scene.id !== sceneId) return state;
      const orderedActions = actionIds
        .map((id) => scene.actions.find((a) => a.id === id))
        .filter(Boolean)
        .map((a, i) => ({ ...(a as SceneAction), order: i + 1 }));
      return {
        scenes: state.scenes.map((s) =>
          s.id === sceneId ? { ...s, actions: orderedActions } : s
        ),
        editingScene:
          state.editingScene?.id === sceneId
            ? { ...state.editingScene, actions: orderedActions }
            : state.editingScene,
      };
    });
  },
}));
