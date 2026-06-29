import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TasksListScreen } from './screens/TasksListScreen';
import { CreateTaskScreen } from './screens/CreateTaskScreen';

export type TasksStackParamList = {
  TasksList: undefined;
  CreateTask: undefined;
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
    </Stack.Navigator>
  );
};
