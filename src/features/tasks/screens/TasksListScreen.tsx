import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TasksStackParamList } from '../TasksNavigator';
import { Container, Text, EmptyState } from '../../../shared/components';
import { theme } from '../../../core/theme';
import { firebaseFirestore, COLLECTIONS } from '../../../core/firebase';
import { Task } from '../services/tasksService';
import Icon from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<TasksStackParamList, 'TasksList'>;

export const TasksListScreen: React.FC<Props> = ({ navigation }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = firebaseFirestore
      .collection(COLLECTIONS.TASKS)
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const tasksList: Task[] = [];
        querySnapshot?.forEach(documentSnapshot => {
          tasksList.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          } as Task);
        });
        setTasks(tasksList);
        setLoading(false);
      }, error => {
        console.error(error);
        setLoading(false);
      });

    return () => subscriber();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return theme.colors.success;
      case 'In Progress': return theme.colors.info;
      case 'Review': return theme.colors.warning;
      case 'Todo':
      default: return theme.colors.textSecondary;
    }
  };

  const renderItem = ({ item }: { item: Task }) => {
    const completedSubtasks = item.subtasks?.filter(st => st.completed).length || 0;
    const totalSubtasks = item.subtasks?.length || 0;
    
    return (
      <TouchableOpacity 
        style={styles.taskCard}
        onPress={() => console.log('Navigate to Task Details', item.id)}
      >
        <View style={styles.taskHeader}>
          <Text variant="h3" weight="medium" style={styles.taskTitle}>{item.title}</Text>
          <Icon name="more-vertical" size={20} color={theme.colors.textTertiary} />
        </View>
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { borderColor: getStatusColor(item.status) }]}>
            <Text variant="caption" color={getStatusColor(item.status)}>{item.status}</Text>
          </View>
          <View style={styles.priorityBadge}>
            <Text variant="caption" color={theme.colors.textSecondary}>{item.priority}</Text>
          </View>
        </View>
        {totalSubtasks > 0 && (
          <View style={styles.subtaskProgress}>
            <Icon name="check-square" size={14} color={theme.colors.textTertiary} />
            <Text variant="caption" color={theme.colors.textSecondary} style={styles.subtaskText}>
              {completedSubtasks}/{totalSubtasks} Subtasks
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Container safeArea padding={false}>
      <View style={styles.header}>
        <Text variant="h1">My Tasks</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateTask')}
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
        />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  taskCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  taskTitle: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    marginRight: theme.spacing.sm,
  },
  priorityBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.border,
  },
  subtaskProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtaskText: {
    marginLeft: theme.spacing.xs,
  },
});
