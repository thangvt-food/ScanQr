import { ref, push, set, onValue, remove, update } from "firebase/database";
import { rtdb } from "./firebase";

export interface ProjectConfig {
  id: string;
  name: string;
  spreadsheetId: string;
  sheetName: string;
  sheetId: string;
  fields: { id: string; label: string }[];
  createdAt: number;
}

export const projectService = {
  // Create a new project
  createProject: async (userId: string, project: Omit<ProjectConfig, "id" | "createdAt">) => {
    const projectsRef = ref(rtdb, `users/${userId}/projects`);
    const newProjectRef = push(projectsRef);
    const id = newProjectRef.key as string;
    
    const projectData: ProjectConfig = {
      ...project,
      id,
      createdAt: Date.now(),
    };

    await set(newProjectRef, projectData);
    return id;
  },

  // Listen for projects list
  subscribeToProjects: (userId: string, callback: (projects: ProjectConfig[]) => void) => {
    const projectsRef = ref(rtdb, `users/${userId}/projects`);
    return onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        callback([]);
        return;
      }
      const projectsList = Object.values(data) as ProjectConfig[];
      // Sort by dynamic priority if needed, here just createdAt
      callback(projectsList.sort((a, b) => b.createdAt - a.createdAt));
    });
  },

  // Update a project
  updateProject: async (userId: string, projectId: string, updates: Partial<ProjectConfig>) => {
    const projectRef = ref(rtdb, `users/${userId}/projects/${projectId}`);
    await update(projectRef, updates);
  },

  // Delete a project
  deleteProject: async (userId: string, projectId: string) => {
    const projectRef = ref(rtdb, `users/${userId}/projects/${projectId}`);
    await remove(projectRef);
  },

  // Get single project (one-time fetch or subscribe)
  getProject: (userId: string, projectId: string, callback: (project: ProjectConfig | null) => void) => {
    const projectRef = ref(rtdb, `users/${userId}/projects/${projectId}`);
    return onValue(projectRef, (snapshot) => {
      callback(snapshot.val());
    });
  },

  // Subscribe to sync status
  subscribeToSyncStatus: (userId: string, projectId: string, callback: (status: any) => void) => {
    const statusRef = ref(rtdb, `users/${userId}/projects/${projectId}/syncStatus`);
    return onValue(statusRef, (snapshot) => {
      callback(snapshot.val());
    });
  }
};
