import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TasksStackParamList } from '../TasksNavigator';
import { Container, Text, Input, Button } from '../../../shared/components';
import { theme } from '../../../core/theme';
import { createTask } from '../services/tasksService';

type Props = NativeStackScreenProps<TasksStackParamList, 'CreateTask'>;

export const CreateTaskScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Task title is required');
      return;
    }

    setLoading(true);
    try {
      await createTask({
        title,
        projectId: 'unassigned', // Will be selectable later
        status: 'Todo',
        priority: 'Medium',
        subtasks: [],
      });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container safeArea padding>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text variant="body" color={theme.colors.primary}>Cancel</Text>
        </TouchableOpacity>
        <Text variant="h2" style={styles.title}>New Task</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.form}>
        <Input
          label="Task Title"
          placeholder="e.g. Design Login Screen"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <Button
        title="Create Task"
        onPress={handleCreate}
        loading={loading}
        fullWidth
        style={styles.createButton}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 50,
  },
  form: {
    flex: 1,
  },
  createButton: {
    marginBottom: theme.spacing.lg,
  },
});
