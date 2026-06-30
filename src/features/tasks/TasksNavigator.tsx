import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TasksListScreen } from './screens/TasksListScreen';
import { CreateTaskScreen } from './screens/CreateTaskScreen';
import { TaskDetailsScreen } from './screens/TaskDetailsScreen';

export type TasksStackParamList = {
  TasksList: undefined;
  CreateTask: { taskId?: string } | undefined;
  TaskDetails: { taskId: string };
};

const Stack = createNativeStackNavigator<TasksStackParamList>();

export const TasksNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TasksList" component={TasksListScreen} />
      <Stack.Screen
        name="CreateTask"
        component={CreateTaskScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
    </Stack.Navigator>
  );
};
