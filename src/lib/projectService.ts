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

export interface ScanRecord {
  id: string;
  mssv: string;
  data: Record<string, string>;
  timestamp: number;
  isSynced?: boolean;
}
export const projectService = {
  // IP Blocking
  blockIp: async (userId: string, projectId: string, ip: string) => {
    const blockRef = ref(rtdb, `users/${userId}/projects/${projectId}/blockedIps/${ip.replace(/\./g, '_')}`);
    await set(blockRef, { ip, timestamp: Date.now() });
  },

  unblockIp: async (userId: string, projectId: string, ip: string) => {
    const blockRef = ref(rtdb, `users/${userId}/projects/${projectId}/blockedIps/${ip.replace(/\./g, '_')}`);
    await remove(blockRef);
  },

  subscribeToBlockedIps: (userId: string, projectId: string, callback: (ips: string[]) => void, errorCallback?: (error: any) => void) => {
    const blockRef = ref(rtdb, `users/${userId}/projects/${projectId}/blockedIps`);
    return onValue(blockRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        callback([]);
        return;
      }
      callback(Object.keys(data).map(k => k.replace(/_/g, '.')));
    }, (error) => {
      if (errorCallback) errorCallback(error);
    });
  },

  // Collaborator Accounts (Issued by Admin)
  addCollaborator: async (userId: string, projectId: string, collaborator: { username: string, password: string }) => {
    const colabRef = ref(rtdb, `users/${userId}/projects/${projectId}/collaborators/${collaborator.username}`);
    await set(colabRef, { ...collaborator, createdAt: Date.now() });
  },

  removeCollaborator: async (userId: string, projectId: string, username: string) => {
    const colabRef = ref(rtdb, `users/${userId}/projects/${projectId}/collaborators/${username}`);
    await remove(colabRef);
  },

  subscribeToCollaborators: (userId: string, projectId: string, callback: (list: { username: string, password: string, createdAt: number }[]) => void) => {
    const colabRef = ref(rtdb, `users/${userId}/projects/${projectId}/collaborators`);
    return onValue(colabRef, (snapshot) => {
      const data = snapshot.val();
      callback(data ? Object.values(data) : []);
    });
  },

  // Session Management for Remote Scanners
  registerSession: async (userId: string, projectId: string, session: { id: string, ip: string, device: string, username?: string }) => {
    const sessionRef = ref(rtdb, `users/${userId}/projects/${projectId}/activeSessions/${session.id}`);
    await set(sessionRef, {
      ...session,
      lastActive: Date.now()
    });
    return sessionRef;
  },

  updateSessionHeartbeat: async (userId: string, projectId: string, sessionId: string) => {
    const sessionRef = ref(rtdb, `users/${userId}/projects/${projectId}/activeSessions/${sessionId}`);
    await update(sessionRef, { lastActive: Date.now() });
  },

  removeSession: async (userId: string, projectId: string, sessionId: string) => {
    const sessionRef = ref(rtdb, `users/${userId}/projects/${projectId}/activeSessions/${sessionId}`);
    await remove(sessionRef);
  },

  subscribeToSessions: (userId: string, projectId: string, callback: (sessions: { id: string, ip: string, device: string, username?: string, lastActive: number }[]) => void) => {
    const sessionsRef = ref(rtdb, `users/${userId}/projects/${projectId}/activeSessions`);
    return onValue(sessionsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        callback([]);
        return;
      }
      callback(Object.values(data));
    });
  },

  // Record Management in RTDB
  addRecord: async (userId: string, projectId: string, record: Omit<ScanRecord, "id" | "timestamp">) => {
    const recordsRef = ref(rtdb, `users/${userId}/projects/${projectId}/records`);
    const newRecordRef = push(recordsRef);
    const id = newRecordRef.key as string;
    
    await set(newRecordRef, {
      ...record,
      id,
      timestamp: Date.now(),
      isSynced: false
    });
    return id;
  },

  updateRecord: async (userId: string, projectId: string, recordId: string, updates: Partial<ScanRecord>) => {
    const recordRef = ref(rtdb, `users/${userId}/projects/${projectId}/records/${recordId}`);
    await update(recordRef, updates);
  },

  deleteRecord: async (userId: string, projectId: string, recordId: string) => {
    const recordRef = ref(rtdb, `users/${userId}/projects/${projectId}/records/${recordId}`);
    await remove(recordRef);
  },

  clearRecords: async (userId: string, projectId: string) => {
    const recordsRef = ref(rtdb, `users/${userId}/projects/${projectId}/records`);
    await remove(recordsRef);
  },

  subscribeToRecords: (userId: string, projectId: string, callback: (records: ScanRecord[]) => void) => {
    const recordsRef = ref(rtdb, `users/${userId}/projects/${projectId}/records`);
    return onValue(recordsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        callback([]);
        return;
      }
      const recordsList = Object.values(data) as ScanRecord[];
      callback(recordsList.sort((a, b) => b.timestamp - a.timestamp));
    });
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
      const projectsList = Object.entries(data).map(([id, val]) => ({
        ...(val as Record<string, unknown>),
        id // Ensure ID is correctly mapped from key
      })) as ProjectConfig[];
      callback(projectsList.sort((a, b) => b.createdAt - a.createdAt));
    });
  },

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
      const data = snapshot.val();
      if (data) data.id = projectId; // Ensure ID is present
      callback(data);
    });
  },

  // Subscribe to sync status
  subscribeToSyncStatus: (userId: string, projectId: string, callback: (status: { stage?: string, isSyncing?: boolean, progress?: number } | null) => void) => {
    const statusRef = ref(rtdb, `users/${userId}/projects/${projectId}/syncStatus`);
    return onValue(statusRef, (snapshot) => {
      callback(snapshot.val());
    });
  }
};

