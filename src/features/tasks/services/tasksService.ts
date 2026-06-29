import { firebaseFirestore, COLLECTIONS } from '../../../core/firebase';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
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

export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
  const timestamp = new Date().toISOString();
  const newTask = {
    ...taskData,
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
