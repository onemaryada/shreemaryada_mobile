import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProjectsListScreen } from './screens/ProjectsListScreen';
import { CreateProjectScreen } from './screens/CreateProjectScreen';

import { ProjectDetailsScreen } from './screens/ProjectDetailsScreen';

export type ProjectsStackParamList = {
  ProjectsList: undefined;
  CreateProject: undefined;
  ProjectDetails: { projectId: string };
};

const Stack = createNativeStackNavigator<ProjectsStackParamList>();

export const ProjectsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProjectsList" component={ProjectsListScreen} />
      <Stack.Screen 
        name="CreateProject" 
        component={CreateProjectScreen} 
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen 
        name="ProjectDetails" 
        component={ProjectDetailsScreen} 
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};
