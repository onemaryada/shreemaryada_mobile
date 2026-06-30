import { firebaseFirestore, COLLECTIONS } from '../../../core/firebase';

export interface ProjectRepository {
  title: string;
  url: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  technologies: string[];
  repositories: ProjectRepository[];
  status: 'Active' | 'Completed' | 'On Hold';
  taskCount?: number;
  completedTaskCount?: number;
  createdAt: string;
  updatedAt: string;
}

export const createProject = async (
  userId: string,
  projectData: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
) => {
  const timestamp = new Date().toISOString();
  const newProject = {
    ...projectData,
    userId,
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

export const getUserProjects = (userId: string, callback: (projects: Project[]) => void) => {
  return firebaseFirestore
    .collection(COLLECTIONS.PROJECTS)
    .where('userId', '==', userId)
    .onSnapshot(
      querySnapshot => {
        const projectsList: Project[] = [];
        querySnapshot?.forEach(documentSnapshot => {
          projectsList.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          } as Project);
        });
        // Sort in JavaScript instead of Firestore (temporary workaround)
        projectsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(projectsList);
      },
      error => {
        console.error('Error fetching projects:', error);
        callback([]);
      }
    );
};
