import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProjectsStackParamList } from '../ProjectsNavigator';
import { Container, Text } from '../../../shared/components';
import { theme } from '../../../core/theme';
import { firebaseFirestore, COLLECTIONS } from '../../../core/firebase';
import { Project } from '../services/projectsService';
import Icon from 'react-native-vector-icons/Feather';
import { getBadgeColor } from '../../../core/utils/colors';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'ProjectDetails'>;

export const ProjectDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { projectId } = route.params;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <Container center>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </Container>
    );
  }

  if (!project) {
    return (
      <Container center>
        <Text variant="body" color={theme.colors.textSecondary}>Project not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: theme.spacing.md }}>
          <Text variant="body" color={theme.colors.primary}>Go Back</Text>
        </TouchableOpacity>
      </Container>
    );
  }

  return (
    <Container safeArea padding={false}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text variant="h1">{project.name}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Icon name="x" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Description Section */}
        <View style={styles.section}>
          <Text variant="caption" weight="bold" color={theme.colors.textSecondary} style={styles.sectionLabel}>
            DESCRIPTION
          </Text>
          <Text variant="body" color={theme.colors.textPrimary} style={styles.descriptionText}>
            {project.description}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Technologies Section */}
        {project.technologies && project.technologies.length > 0 && (
          <View style={styles.section}>
            <Text variant="caption" weight="bold" color={theme.colors.textSecondary} style={styles.sectionLabel}>
              TECHNOLOGIES
            </Text>
            <View style={styles.techContainer}>
              {project.technologies.map((tech) => (
                <View 
                  key={tech} 
                  style={[styles.techBadge, { backgroundColor: getBadgeColor(tech) }]}
                >
                  <Text variant="caption" weight="bold" color={theme.colors.white}>{tech}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Repositories Section */}
        {project.repositories && project.repositories.length > 0 && (
          <View style={styles.section}>
            <Text variant="caption" weight="bold" color={theme.colors.textSecondary} style={styles.sectionLabel}>
              REPOSITORIES
            </Text>
            {project.repositories.map((repo, index) => (
              <View key={index} style={styles.repoCard}>
                <View style={styles.repoTypeBadge}>
                  <Text variant="caption" weight="bold" color={theme.colors.textPrimary}>{repo.type}</Text>
                </View>
                <TouchableOpacity style={styles.repoLink} onPress={() => handleOpenUrl(repo.url)}>
                  <Icon name="github" size={16} color={theme.colors.primary} />
                  <Text 
                    variant="caption" 
                    color={theme.colors.primary} 
                    style={styles.repoUrlText}
                    numberOfLines={1}
                  >
                    {repo.url}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing.lg,
  },
  titleContainer: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  content: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionLabel: {
    marginBottom: theme.spacing.md,
    letterSpacing: 0.5,
  },
  descriptionText: {
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
  },
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  techBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  repoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  repoTypeBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.md,
    minWidth: 70,
    alignItems: 'center',
  },
  repoLink: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  repoUrlText: {
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
});
