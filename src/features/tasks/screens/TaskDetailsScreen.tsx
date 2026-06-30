import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TasksStackParamList } from '../TasksNavigator';
import { ScreenWrapper, Text, Button, GlassCard } from '../../../shared/components';
import { theme } from '../../../core/theme';
import { gradients } from '../../../core/theme/colors';
import { firebaseFirestore, COLLECTIONS } from '../../../core/firebase';
import { Task } from '../services/tasksService';
import Icon from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<TasksStackParamList, 'TaskDetails'>;

export const TaskDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [projectName, setProjectName] = useState<string>('');

  useEffect(() => {
    const subscriber = firebaseFirestore
      .collection(COLLECTIONS.TASKS)
      .doc(taskId)
      .onSnapshot(doc => {
        if (doc.exists) {
          setTask({ id: doc.id, ...doc.data() } as Task);
        } else {
          setTask(null);
        }
        setLoading(false);
      }, error => {
        console.error(error);
        setLoading(false);
      });

    return () => subscriber();
  }, [taskId]);

  useEffect(() => {
    if (task?.projectId) {
      const fetchProject = async () => {
        try {
          const doc = await firebaseFirestore
            .collection(COLLECTIONS.PROJECTS)
            .doc(task.projectId)
            .get();
          if (doc.exists) {
            setProjectName(doc.data()?.name || '');
          }
        } catch (error) {
          console.error('Error fetching project name:', error);
        }
      };
      fetchProject();
    }
  }, [task?.projectId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return theme.colors.success;
      case 'In Progress':
        return theme.colors.info;
      case 'Review':
        return theme.colors.warning;
      case 'Todo':
      default:
        return theme.colors.textSecondary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return theme.colors.error;
      case 'Medium':
        return theme.colors.warning;
      case 'Low':
      default:
        return theme.colors.success;
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task?.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            setDeleting(true);
            try {
              await firebaseFirestore.collection(COLLECTIONS.TASKS).doc(taskId).delete();
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task');
            } finally {
              setDeleting(false);
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  if (loading) {
    return (
      <ScreenWrapper safeArea gradientColors={gradients.bgLight as any}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  if (!task) {
    return (
      <ScreenWrapper safeArea gradientColors={gradients.bgLight as any}>
        <View style={styles.loadingContainer}>
          <Text variant="body" color={theme.colors.textSecondary}>
            Task not found
          </Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          />
        </View>
      </ScreenWrapper>
    );
  }

  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <ScreenWrapper
      safeArea
      paddingHorizontal
      showGradient
      gradientColors={['#FFFFFF', theme.colors.primaryLight]}
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
          <Text variant="h1" style={styles.title}>{task.title}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Status & Priority */}
        <GlassCard style={styles.section}>
          <View style={styles.statusPriorityRow}>
            <View style={styles.statusContainer}>
              <Text
                variant="caption"
                weight="bold"
                color={theme.colors.textSecondary}
                style={styles.label}
              >
                STATUS
              </Text>
              <View
                style={[
                  styles.statusPill,
                  { backgroundColor: getStatusColor(task.status) + '20' },
                ]}
              >
                <Icon
                  name={
                    task.status === 'Done'
                      ? 'check-circle'
                      : task.status === 'In Progress'
                      ? 'play-circle'
                      : 'circle'
                  }
                  size={16}
                  color={getStatusColor(task.status)}
                />
                <Text
                  variant="caption"
                  weight="bold"
                  color={getStatusColor(task.status)}
                  style={styles.statusText}
                >
                  {task.status}
                </Text>
              </View>
            </View>

            <View style={styles.priorityContainer}>
              <Text
                variant="caption"
                weight="bold"
                color={theme.colors.textSecondary}
                style={styles.label}
              >
                PRIORITY
              </Text>
              <View
                style={[
                  styles.priorityPill,
                  { backgroundColor: getPriorityColor(task.priority) + '20' },
                ]}
              >
                <Icon
                  name={
                    task.priority === 'High'
                      ? 'alert-circle'
                      : task.priority === 'Medium'
                      ? 'minus-circle'
                      : 'check-circle'
                  }
                  size={16}
                  color={getPriorityColor(task.priority)}
                />
                <Text
                  variant="caption"
                  weight="bold"
                  color={getPriorityColor(task.priority)}
                  style={styles.priorityText}
                >
                  {task.priority}
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Description */}
        {task.description && (
          <GlassCard style={styles.section}>
            <Text
              variant="caption"
              weight="bold"
              color={theme.colors.textSecondary}
              style={styles.sectionLabel}
            >
              DESCRIPTION
            </Text>
            <Text variant="body" color={theme.colors.text} style={styles.descriptionText}>
              {task.description}
            </Text>
          </GlassCard>
        )}

        {/* Project */}
        {task.projectId && (
          <GlassCard style={styles.section}>
            <Text
              variant="caption"
              weight="bold"
              color={theme.colors.textSecondary}
              style={styles.sectionLabel}
            >
              PROJECT
            </Text>
            <View style={styles.projectInfo}>
              <Icon name="folder" size={16} color={theme.colors.primary} />
              <Text variant="body" color={theme.colors.text} style={styles.projectName}>
                {projectName || task.projectId}
              </Text>
            </View>
          </GlassCard>
        )}

        {/* Subtasks */}
        {totalSubtasks > 0 && (
          <GlassCard style={styles.section}>
            <View style={styles.subtasksHeader}>
              <Text
                variant="caption"
                weight="bold"
                color={theme.colors.textSecondary}
                style={styles.sectionLabel}
              >
                SUBTASKS
              </Text>
              <Text variant="caption" color={theme.colors.textSecondary}>
                {completedSubtasks}/{totalSubtasks}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%` },
                ]}
              />
            </View>
            <View style={styles.subtasksList}>
              {task.subtasks?.map((subtask, index) => (
                <View key={index} style={styles.subtaskItem}>
                  <Icon
                    name={subtask.completed ? 'check-square' : 'square'}
                    size={18}
                    color={subtask.completed ? theme.colors.success : theme.colors.textTertiary}
                  />
                  <Text
                    variant="body"
                    color={
                      subtask.completed
                        ? theme.colors.textSecondary
                        : theme.colors.text
                    }
                    style={[
                      styles.subtaskText,
                      subtask.completed && styles.subtaskCompleted,
                    ]}
                  >
                    {subtask.title}
                  </Text>
                </View>
              ))}
            </View>
          </GlassCard>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Edit Task"
            fullWidth
            onPress={() => navigation.navigate('CreateTask', { taskId })}
          />
          <Button
            title={deleting ? 'Deleting...' : 'Delete Task'}
            variant="outline"
            fullWidth
            loading={deleting}
            onPress={handleDelete}
            style={styles.deleteButton}
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
    marginBottom: theme.spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    marginTop: theme.spacing.lg,
  },
  content: {
    paddingBottom: theme.spacing.xl,
  },
  section: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statusPriorityRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statusContainer: {
    flex: 1,
  },
  priorityContainer: {
    flex: 1,
  },
  label: {
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    gap: theme.spacing.xs,
  },
  statusText: {
    marginLeft: theme.spacing.xs,
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    gap: theme.spacing.xs,
  },
  priorityText: {
    marginLeft: theme.spacing.xs,
  },
  sectionLabel: {
    marginBottom: theme.spacing.md,
    letterSpacing: 0.5,
  },
  descriptionText: {
    lineHeight: 24,
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  projectName: {
    flex: 1,
  },
  subtasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 3,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: 3,
  },
  subtasksList: {
    gap: theme.spacing.sm,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  subtaskText: {
    flex: 1,
  },
  subtaskCompleted: {
    textDecorationLine: 'line-through',
  },
  actionButtons: {
    gap: theme.spacing.md,
  },
  deleteButton: {
    marginTop: theme.spacing.sm,
  },
});
