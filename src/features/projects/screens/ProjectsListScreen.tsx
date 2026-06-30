import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProjectsStackParamList } from '../ProjectsNavigator';
import { ScreenWrapper, Text, Button, EmptyState, GlassCard, AnimatedListItem } from '../../../shared/components';
import { theme } from '../../../core/theme';
import { getUserProjects, Project } from '../services/projectsService';
import { useAuth } from '../../../core/auth/AuthContext';
import Icon from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'ProjectsList'>;

export const ProjectsListScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = getUserProjects(user.uid, (fetchedProjects) => {
      setProjects(fetchedProjects);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return { bg: theme.colors.success + '20', text: theme.colors.success };
      case 'Completed':
        return { bg: theme.colors.info + '20', text: theme.colors.info };
      case 'On Hold':
        return { bg: theme.colors.warning + '20', text: theme.colors.warning };
      default:
        return { bg: theme.colors.textTertiary + '20', text: theme.colors.textSecondary };
    }
  };

  const renderItem = ({ item, index }: { item: Project; index: number }) => {
    const statusColor = getStatusColor(item.status);

    return (
      <AnimatedListItem index={index} delay={50}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('ProjectDetails', { projectId: item.id })}
          style={styles.itemWrapper}
        >
          <GlassCard style={styles.projectCard}>
            <View style={styles.projectHeader}>
              <View style={styles.projectIconContainer}>
                <View style={[styles.projectIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Icon name="folder" size={24} color={theme.colors.primary} />
                </View>
              </View>
              <View style={styles.projectTitleContainer}>
                <Text variant="h3" weight="bold" numberOfLines={1}>
                  {item.name}
                </Text>
                {item.description && (
                  <Text
                    variant="caption"
                    color={theme.colors.textSecondary}
                    numberOfLines={2}
                    style={styles.description}
                  >
                    {item.description}
                  </Text>
                )}
              </View>
              <View style={styles.headerActions}>
                <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                  <Text
                    variant="caption"
                    weight="bold"
                    color={statusColor.text}
                    numberOfLines={1}
                  >
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
          </GlassCard>
        </TouchableOpacity>
      </AnimatedListItem>
    );
  };

  return (
    <ScreenWrapper
      safeArea
      paddingHorizontal
      showGradient
      gradientColors={['#FFFFFF', theme.colors.primaryLight]}
    >
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text variant="h1" style={styles.title}>Projects</Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateProject')}
          activeOpacity={0.8}
        >
          <Icon name="plus" size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>


      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : projects.length === 0 ? (
        <EmptyState
          title="No Projects Yet"
          description="Create your first project to get started managing tasks."
          actionTitle="Create Project"
          onAction={() => navigation.navigate('CreateProject')}
        />
      ) : (
        <FlatList
          data={projects}
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
  projectCard: {
    padding: theme.spacing.md,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  projectIconContainer: {
    marginTop: theme.spacing.xs,
  },
  projectIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectTitleContainer: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    minWidth: 70,
    alignItems: 'center',
  },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    marginTop: theme.spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  metaText: {
    flex: 1,
    maxWidth: 120,
  },
});
