import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TasksStackParamList } from '../TasksNavigator';
import { ScreenWrapper, Text, Input, Button, GlassCard, ProjectSelector } from '../../../shared/components';
import { theme } from '../../../core/theme';
import { getTaskStatusBadgeColor, getPriorityBadgeColor } from '../../../core/theme/badgeHelper';
import { createTask, updateTask, Task } from '../services/tasksService';
import { firebaseFirestore, COLLECTIONS } from '../../../core/firebase';
import { useAuth } from '../../../core/auth/AuthContext';
import Icon from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<TasksStackParamList, 'CreateTask'>;

export const CreateTaskScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = useAuth();
  const taskId = (route.params as any)?.taskId;
  const isEditing = !!taskId;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [status, setStatus] = useState('Todo');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const statusOptions = ['Todo', 'In Progress', 'Review', 'Done'];
  const priorityOptions = ['Low', 'Medium', 'High'];

  useEffect(() => {
    if (isEditing && taskId) {
      const loadTask = async () => {
        try {
          const doc = await firebaseFirestore
            .collection(COLLECTIONS.TASKS)
            .doc(taskId)
            .get();

          if (doc.exists) {
            const task = doc.data() as Task;
            setTitle(task.title);
            setDescription(task.description || '');
            setProjectId(task.projectId || '');
            setStatus(task.status);
            setPriority(task.priority);
          }
        } catch (error) {
          console.error('Error loading task:', error);
        }
      };
      loadTask();
    }
  }, [isEditing, taskId]);

  const handleSave = async () => {
    setHasSubmitted(true);

    if (!title.trim()) {
      Alert.alert('Validation Error', 'Task title is required');
      return;
    }

    if (!projectId) {
      Alert.alert('Validation Error', 'Please select a project');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setLoading(true);
    try {
      if (isEditing && taskId) {
        await updateTask(taskId, {
          title,
          description,
          projectId,
          status,
          priority,
        });
      } else {
        await createTask(user.uid, {
          title,
          description,
          projectId,
          status,
          priority,
          subtasks: [],
        });
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || `Failed to ${isEditing ? 'update' : 'create'} task`);
    } finally {
      setLoading(false);
    }
  };



  if (!user) return null;

  return (
    <ScreenWrapper
      safeArea
      paddingHorizontal
      scrollable={false}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text variant="h2" style={styles.title}>
            {isEditing ? 'Edit Task' : 'New Task'}
          </Text>
          {/* <Text variant="body" color={theme.colors.textSecondary}>
            {isEditing ? 'Update task details' : 'Create a new task for a project'}
          </Text> */}
        </View>

      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.form}>
          <Input
            label="Task Title *"
            placeholder="e.g. Design Login Screen"
            value={title}
            onChangeText={setTitle}
          />

          <Input
            label="Description"
            placeholder="What needs to be done?"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          {user && (
            <ProjectSelector
              selectedProjectId={projectId}
              onSelectProject={(id, name) => {
                setProjectId(id);
                setProjectName(name);
              }}
              userId={user.uid}
              showError={hasSubmitted}
            />
          )}

          <View style={styles.section}>
            <Text variant="h3" weight="bold" style={styles.sectionTitle}>
              Task Status
            </Text>
            <View style={styles.optionsContainer}>
              {statusOptions.map(option => {
                const badgeColor = getTaskStatusBadgeColor(option as any);
                const isSelected = status === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.statusBadgeButton,
                      isSelected && { backgroundColor: badgeColor.bg, borderColor: badgeColor.text },
                    ]}
                    onPress={() => setStatus(option)}
                    activeOpacity={0.7}
                  >
                    <Text
                      variant="caption"
                      weight={isSelected ? 'bold' : 'medium'}
                      color={isSelected ? badgeColor.text : theme.colors.textSecondary}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text variant="h3" weight="bold" style={styles.sectionTitle}>
              Priority
            </Text>
            <View style={styles.optionsContainer}>
              {priorityOptions.map(option => {
                const badgeColor = getPriorityBadgeColor(option as any);
                const isSelected = priority === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.priorityBadgeButton,
                      isSelected && { backgroundColor: badgeColor.bg, borderColor: badgeColor.text },
                    ]}
                    onPress={() => setPriority(option)}
                    activeOpacity={0.7}
                  >
                    <Text
                      variant="caption"
                      weight={isSelected ? 'bold' : 'medium'}
                      color={isSelected ? badgeColor.text : theme.colors.textSecondary}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <Button
            title={loading ? (isEditing ? 'Updating...' : 'Creating...') : isEditing ? 'Update Task' : 'Create Task'}
            onPress={handleSave}
            loading={loading}
            fullWidth
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flex: 1,
  },
  title: {
    // marginBottom: theme.spacing.sm,
  },
  scrollContent: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
  },
  form: {
    flex: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  section: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'transparent',
  },
  statusBadgeButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'transparent',
  },
  priorityBadgeButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'transparent',
  },
  submitButton: {
    marginTop: theme.spacing.lg,
  },
});
