import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Linking, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProjectsStackParamList } from '../ProjectsNavigator';
import { ScreenWrapper, Text, Button, GlassCard } from '../../../shared/components';
import { theme } from '../../../core/theme';
import { gradients } from '../../../core/theme/colors';
import { getProjectStatusBadgeColor } from '../../../core/theme/badgeHelper';
import { firebaseFirestore, COLLECTIONS } from '../../../core/firebase';
import { Project } from '../services/projectsService';
import Icon from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'ProjectDetails'>;

export const ProjectDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { projectId } = route.params;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const subscriber = firebaseFirestore
      .collection(COLLECTIONS.PROJECTS)
      .doc(projectId)
      .onSnapshot(doc => {
        if (doc.exists) {
          setProject({ id: doc.id, ...doc.data() } as Project);
        } else {
          setProject(null);
        }
        setLoading(false);
      }, error => {
        console.error(error);
        setLoading(false);
      });

    return () => subscriber();
  }, [projectId]);


  const handleOpenUrl = async (url: string) => {
    try {
      if (await Linking.canOpenURL(url)) {
        await Linking.openURL(url);
      }
    } catch (e) {
      console.log('Cannot open URL', url);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project?.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', onPress: () => { }, style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            setDeleting(true);
            try {
              await firebaseFirestore
                .collection(COLLECTIONS.PROJECTS)
                .doc(projectId)
                .delete();
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete project');
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

  if (!project) {
    return (
      <ScreenWrapper safeArea gradientColors={gradients.bgLight as any}>
        <View style={styles.loadingContainer}>
          <Text variant="body" color={theme.colors.textSecondary}>
            Project not found
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

  return (
    <ScreenWrapper
      safeArea
      paddingHorizontal
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
          <Text variant="h2" style={styles.title}>{project.name}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Status Section */}
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
                  { backgroundColor: getProjectStatusBadgeColor(project.status as any).bg },
                ]}
              >
                <Icon
                  name={
                    project.status === 'Completed'
                      ? 'check-circle'
                      : project.status === 'Active'
                        ? 'play-circle'
                        : 'pause-circle'
                  }
                  size={16}
                  color={getProjectStatusBadgeColor(project.status as any).text}
                />
                <Text
                  variant="caption"
                  weight="bold"
                  color={getProjectStatusBadgeColor(project.status as any).text}
                  style={styles.statusText}
                >
                  {project.status}
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Description Section */}
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
            {project.description}
          </Text>
        </GlassCard>

        {/* Technologies Section */}
        {project.technologies && project.technologies.length > 0 && (
          <GlassCard style={styles.section}>
            <Text
              variant="caption"
              weight="bold"
              color={theme.colors.textSecondary}
              style={styles.sectionLabel}
            >
              TECHNOLOGIES
            </Text>
            <View style={styles.techContainer}>
              {project.technologies.map(tech => (
                <GlassCard
                  key={tech}
                  style={styles.techBadge}
                >
                  <Text variant="caption" weight="bold" color={theme.colors.primary}>
                    {tech}
                  </Text>
                </GlassCard>
              ))}
            </View>
          </GlassCard>
        )}

        {/* Repositories Section */}
        {project.repositories && project.repositories.length > 0 && (
          <GlassCard style={styles.section}>
            <Text
              variant="caption"
              weight="bold"
              color={theme.colors.textSecondary}
              style={styles.sectionLabel}
            >
              REPOSITORIES
            </Text>
            {project.repositories.map((repo, index) => (
              <GlassCard
                key={index}
                variant="light"
                intensity="high"
                style={styles.repoCard}
              >
                <View style={styles.repoHeader}>
                  <View style={styles.repoTitleContainer}>
                    <Text variant="caption" weight="bold" color={theme.colors.text}>
                      {repo.title || 'Repo ' + (index + 1)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.openButton}
                    onPress={() => handleOpenUrl(repo.url)}
                  >
                    <Icon name="external-link" size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.repoLink}
                  onPress={() => handleOpenUrl(repo.url)}
                  activeOpacity={0.7}
                >
                  <Icon name="link" size={14} color={theme.colors.primary} />
                  <Text
                    variant="caption"
                    color={theme.colors.primary}
                    style={styles.repoUrlText}
                    numberOfLines={1}
                  >
                    {repo.url}
                  </Text>
                </TouchableOpacity>
              </GlassCard>
            ))}
          </GlassCard>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Edit Project"
            fullWidth
            onPress={() => navigation.navigate('CreateProject', { project })}
          />
          <Button
            title={deleting ? 'Deleting...' : 'Delete Project'}
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
    gap: theme.spacing.lg,
  },
  statusContainer: {
    flex: 0,
  },
  label: {
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    gap: theme.spacing.xs,
    alignSelf: 'flex-start',
  },
  statusText: {
    marginLeft: theme.spacing.xs,
  },
  sectionLabel: {
    marginBottom: theme.spacing.md,
    letterSpacing: 0.5,
  },
  descriptionText: {
    lineHeight: 24,
  },
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  techBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
  },
  repoCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  repoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  repoTitleContainer: {
    flex: 1,
  },
  openButton: {
    padding: theme.spacing.xs,
  },
  repoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  repoUrlText: {
    flex: 1,
  },
  actionButtons: {
    gap: theme.spacing.md,
  },
  deleteButton: {
    marginTop: theme.spacing.sm,
  },
});
