import { firebaseFirestore, COLLECTIONS } from '../../../core/firebase';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  userId: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  assigneeId?: string;
  subtasks: Subtask[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const createTask = async (userId: string, taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  const timestamp = new Date().toISOString();
  const newTask = {
    ...taskData,
    userId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const docRef = await firebaseFirestore.collection(COLLECTIONS.TASKS).add(newTask);
  return { id: docRef.id, ...newTask };
};

export const updateTask = async (taskId: string, taskData: Partial<Task>) => {
  const timestamp = new Date().toISOString();
  await firebaseFirestore.collection(COLLECTIONS.TASKS).doc(taskId).update({
    ...taskData,
    updatedAt: timestamp,
  });
};

export const getUserTasks = (userId: string, callback: (tasks: Task[]) => void) => {
  return firebaseFirestore
    .collection(COLLECTIONS.TASKS)
    .where('userId', '==', userId)
    .onSnapshot(
      querySnapshot => {
        const tasksList: Task[] = [];
        querySnapshot?.forEach(documentSnapshot => {
          tasksList.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          } as Task);
        });
        // Sort in JavaScript instead of Firestore (temporary workaround)
        tasksList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(tasksList);
      },
      error => {
        console.error('Error fetching tasks:', error);
        callback([]);
      }
    );
};

export const getProjectTasks = (projectId: string, callback: (tasks: Task[]) => void) => {
  return firebaseFirestore
    .collection(COLLECTIONS.TASKS)
    .where('projectId', '==', projectId)
    .onSnapshot(
      querySnapshot => {
        const tasksList: Task[] = [];
        querySnapshot?.forEach(documentSnapshot => {
          tasksList.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          } as Task);
        });
        // Sort in JavaScript instead of Firestore (temporary workaround)
        tasksList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(tasksList);
      },
      error => {
        console.error('Error fetching project tasks:', error);
        callback([]);
      }
    );
};
