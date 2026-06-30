import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TasksStackParamList } from '../TasksNavigator';
import { ScreenWrapper, Text, EmptyState, GlassCard, AnimatedListItem } from '../../../shared/components';
import { theme } from '../../../core/theme';
import { getUserTasks, Task } from '../services/tasksService';
import { useAuth } from '../../../core/auth/AuthContext';
import Icon from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<TasksStackParamList, 'TasksList'>;

export const TasksListScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = getUserTasks(user.uid, (fetchedTasks) => {
      setTasks(fetchedTasks);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

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

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'rgba(16, 185, 129, 0.2)';
      case 'In Progress':
        return 'rgba(59, 130, 246, 0.2)';
      case 'Review':
        return 'rgba(245, 158, 11, 0.2)';
      case 'Todo':
      default:
        return 'rgba(107, 114, 128, 0.2)';
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

  const renderItem = ({ item, index }: { item: Task; index: number }) => {
    const completedSubtasks = item.subtasks?.filter(st => st.completed).length || 0;
    const totalSubtasks = item.subtasks?.length || 0;

    return (
      <AnimatedListItem index={index} delay={50}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}
          style={styles.itemWrapper}
        >
          <GlassCard style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <View style={styles.taskIconContainer}>
                <View style={[styles.taskIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Icon name="check-square" size={24} color={theme.colors.primary} />
                </View>
              </View>
              <View style={styles.titleContainer}>
                <Text variant="h3" weight="bold" numberOfLines={1}>
                  {item.title}
                </Text>
                {item.description && (
                  <Text
                    variant="caption"
                    color={theme.colors.textSecondary}
                    numberOfLines={2}
                    style={styles.taskDescription}
                  >
                    {item.description}
                  </Text>
                )}
              </View>
              <View style={styles.headerActions}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusBackgroundColor(item.status) },
                  ]}
                >
                  <Text variant="caption" weight="bold" color={getStatusColor(item.status)} numberOfLines={1}>
                    {item.status}
                  </Text>
                </View>
                
                <View style={styles.metaItem}>
                  <Icon name="calendar" size={14} color={theme.colors.primary} />
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            </View>

            {totalSubtasks > 0 && (
              <>
                <View style={styles.divider} />
                <View style={styles.subtaskProgress}>
                  <Icon name="check-circle" size={14} color={theme.colors.success} />
                  <Text
                    variant="caption"
                    color={theme.colors.textSecondary}
                    style={styles.subtaskText}
                  >
                    {completedSubtasks}/{totalSubtasks} Completed
                  </Text>
                </View>
              </>
            )}
          </GlassCard>
        </TouchableOpacity>
      </AnimatedListItem>
    );
  };

  const activeTasks = tasks.filter(t => t.status !== 'Done').length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;

  return (
    <ScreenWrapper
      safeArea
      paddingHorizontal
      showGradient
      gradientColors={['#FFFFFF', theme.colors.primaryLight]}
    >
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text variant="h1" style={styles.title}>My Tasks</Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            {activeTasks} active · {completedTasks} completed
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateTask')}
          activeOpacity={0.8}
        >
          <Icon name="plus" size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : tasks.length === 0 ? (
        <EmptyState
          title="All Caught Up!"
          description="You don't have any pending tasks right now."
          actionTitle="Create Task"
          onAction={() => navigation.navigate('CreateTask')}
        />
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  headerTitleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing.xs,
  },
  title: {
    lineHeight: 36,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  itemWrapper: {
    marginBottom: theme.spacing.md,
  },
  taskCard: {
    padding: theme.spacing.md,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  taskIconContainer: {
    marginTop: theme.spacing.xs,
  },
  taskIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  taskDescription: {
    marginTop: theme.spacing.xs,
  },
  priorityRow: {
    marginTop: theme.spacing.sm,
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    minWidth: 70,
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  subtaskProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  subtaskText: {
    flex: 1,
  },
});
