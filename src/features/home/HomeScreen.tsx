import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Container, Text, Skeleton } from '../../shared/components';
import { theme } from '../../core/theme';
import Icon from 'react-native-vector-icons/Feather';
import { firebaseAuth, firebaseFirestore, COLLECTIONS } from '../../core/firebase';
import { Project } from '../projects/services/projectsService';
import { Task } from '../tasks/services/tasksService';
import { formatDistanceToNow } from 'date-fns';

export const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeProjects, setActiveProjects] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const user = firebaseAuth.currentUser;

  const fetchData = async () => {
    try {
      // 1. Fetch Active Projects
      const projectsSnapshot = await firebaseFirestore
        .collection(COLLECTIONS.PROJECTS)
        .where('status', '==', 'Active')
        .get();
      setActiveProjects(projectsSnapshot.size);

      // 2. Fetch Tasks
      const tasksSnapshot = await firebaseFirestore
        .collection(COLLECTIONS.TASKS)
        .orderBy('updatedAt', 'desc')
        .get();
      
      let pendingCount = 0;
      let completedCount = 0;
      const activities: any[] = [];

      tasksSnapshot.forEach(doc => {
        const data = doc.data() as Task;
        if (data.status === 'Done') {
          completedCount++;
        } else {
          pendingCount++;
        }

        if (activities.length < 5) {
          activities.push({
            id: doc.id,
            title: `Task "${data.title}" was updated to ${data.status}`,
            time: data.updatedAt,
            icon: data.status === 'Done' ? 'check-circle' : 'activity'
          });
        }
      });

      setPendingTasks(pendingCount);
      setCompletedTasks(completedCount);
      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderStats = () => {
    if (loading) {
      return (
        <View style={styles.statsContainer}>
          {[1, 2, 3].map(i => (
            <Skeleton key={i} width="30%" height={100} borderRadius={theme.radius.md} />
          ))}
        </View>
      );
    }
    return (
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="briefcase" size={24} color={theme.colors.primary} />
          <Text variant="h2" style={styles.statValue}>{activeProjects}</Text>
          <Text variant="caption" color={theme.colors.textSecondary}>Active Projects</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="check-square" size={24} color={theme.colors.warning} />
          <Text variant="h2" style={styles.statValue}>{pendingTasks}</Text>
          <Text variant="caption" color={theme.colors.textSecondary}>Pending Tasks</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="check-circle" size={24} color={theme.colors.success} />
          <Text variant="h2" style={styles.statValue}>{completedTasks}</Text>
          <Text variant="caption" color={theme.colors.textSecondary}>Completed</Text>
        </View>
      </View>
    );
  };

  const renderRecentActivity = () => {
    if (loading) {
      return (
        <View style={styles.activityContainer}>
          {[1, 2, 3].map(i => (
            <View key={i} style={styles.activityItem}>
              <Skeleton width={40} height={40} borderRadius={20} />
              <View style={styles.activityContent}>
                <Skeleton width="80%" height={16} />
                <Skeleton width="40%" height={12} style={{ marginTop: 8 }} />
              </View>
            </View>
          ))}
        </View>
      );
    }

    if (recentActivity.length === 0) {
      return (
        <View style={styles.emptyActivity}>
          <Text variant="body" color={theme.colors.textSecondary}>No recent activity found.</Text>
        </View>
      );
    }

    return (
      <View style={styles.activityContainer}>
        {recentActivity.map(item => {
          let timeAgo = 'Just now';
          try {
            timeAgo = formatDistanceToNow(new Date(item.time), { addSuffix: true });
          } catch (e) {
            // Ignore format error
          }
          return (
            <View key={item.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Icon name={item.icon} size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.activityContent}>
                <Text variant="body" weight="medium">{item.title}</Text>
                <Text variant="caption" color={theme.colors.textSecondary}>{timeAgo}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <Container safeArea padding={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text variant="h2">Hello, {user?.displayName || 'User'} 👋</Text>
          <Text variant="body" color={theme.colors.textSecondary}>Here's what's happening today.</Text>
        </View>

        <Text variant="h3" style={styles.sectionTitle}>Overview</Text>
        {renderStats()}

        <Text variant="h3" style={styles.sectionTitle}>Recent Activity</Text>
        {renderRecentActivity()}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.sm,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    width: '31%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statValue: {
    marginVertical: theme.spacing.xs,
  },
  activityContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'center',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  emptyActivity: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
