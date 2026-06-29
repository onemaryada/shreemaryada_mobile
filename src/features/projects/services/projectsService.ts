import { firebaseFirestore, COLLECTIONS } from '../../../core/firebase';

export interface ProjectRepository {
  type: 'Web' | 'Server' | 'Mobile' | 'Other';
  url: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  repositories: ProjectRepository[];
  status: 'Active' | 'Completed' | 'On Hold';
  createdAt: string;
  updatedAt: string;
}

export const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
  const timestamp = new Date().toISOString();
  const newProject = {
    ...projectData,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const docRef = await firebaseFirestore.collection(COLLECTIONS.PROJECTS).add(newProject);
  return { id: docRef.id, ...newProject };
};

export const updateProject = async (projectId: string, projectData: Partial<Project>) => {
  const timestamp = new Date().toISOString();
  await firebaseFirestore.collection(COLLECTIONS.PROJECTS).doc(projectId).update({
    ...projectData,
    updatedAt: timestamp,
  });
};

export const deleteProject = async (projectId: string) => {
  await firebaseFirestore.collection(COLLECTIONS.PROJECTS).doc(projectId).delete();
};
