import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ScreenWrapper, Text, Skeleton } from '../../shared/components';
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
      if (!user || user.isAnonymous) {
        // Guest users see empty data
        setActiveProjects(0);
        setPendingTasks(0);
        setCompletedTasks(0);
        setRecentActivity([]);
        setLoading(false);
        return;
      }

      // 1. Fetch Active Projects for current user
      const projectsSnapshot = await firebaseFirestore
        .collection(COLLECTIONS.PROJECTS)
        .where('userId', '==', user.uid)
        .where('status', '==', 'Active')
        .get();
      setActiveProjects(projectsSnapshot.size);

      // 2. Fetch Tasks for current user
      const tasksSnapshot = await firebaseFirestore
        .collection(COLLECTIONS.TASKS)
        .where('userId', '==', user.uid)
        .get();

      let pendingCount = 0;
      let completedCount = 0;
      const allTasks: any[] = [];

      tasksSnapshot.forEach((doc: any) => {
        const data = doc.data() as Task;
        allTasks.push({ id: doc.id, ...data });
        if (data.status === 'Done') {
          completedCount++;
        } else {
          pendingCount++;
        }
      });

      // Sort by updatedAt descending
      allTasks.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      const activities = allTasks.slice(0, 5).map(data => ({
        id: data.id,
        title: `Task "${data.title}" was updated to ${data.status}`,
        time: data.updatedAt,
        icon: data.status === 'Done' ? 'check-circle' : 'activity'
      }));

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
          <Text style={{textAlign: 'center'}} variant="caption" color={theme.colors.textSecondary}>Active Projects</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="check-square" size={24} color={theme.colors.warning} />
          <Text variant="h2" style={styles.statValue}>{pendingTasks}</Text>
          <Text style={{textAlign: 'center'}} variant="caption" color={theme.colors.textSecondary}>Pending Tasks</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="check-circle" size={24} color={theme.colors.success} />
          <Text variant="h2" style={styles.statValue}>{completedTasks}</Text>
          <Text style={{textAlign: 'center'}} variant="caption" color={theme.colors.textSecondary}>Completed Tasks</Text>
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

  const displayName = user?.isAnonymous ? 'Guest' : (user?.displayName || 'User');
  const headerMessage = user?.isAnonymous
    ? 'Explore the app and create an account to get started.'
    : "Here's what's happening today.";

  return (
    <ScreenWrapper
      safeArea
      paddingHorizontal
      scrollable={true}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
        <View style={styles.header}>
          <Text variant="h2" style={styles.title}>Hello, {displayName} 👋</Text>
          <Text variant="body" color={theme.colors.textSecondary}>{headerMessage}</Text>
        </View>

        <Text variant="h3" style={styles.sectionTitle}>Overview</Text>
        {renderStats()}

        <Text variant="h3" style={styles.sectionTitle}>Recent Activity</Text>
        {renderRecentActivity()}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  title: {
    // marginBottom: theme.spacing.sm,
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
    justifyContent: 'center',
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
