import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProjectsStackParamList } from '../ProjectsNavigator';
import { Container, Text, Button, EmptyState } from '../../../shared/components';
import { theme } from '../../../core/theme';
import { firebaseFirestore, COLLECTIONS } from '../../../core/firebase';
import { Project } from '../services/projectsService';
import Icon from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'ProjectsList'>;

export const ProjectsListScreen: React.FC<Props> = ({ navigation }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = firebaseFirestore
      .collection(COLLECTIONS.PROJECTS)
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const projectsList: Project[] = [];
        querySnapshot?.forEach(documentSnapshot => {
          projectsList.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          } as Project);
        });
        setProjects(projectsList);
        setLoading(false);
      }, error => {
        console.error(error);
        setLoading(false);
      });

    return () => subscriber();
  }, []);

  const renderItem = ({ item }: { item: Project }) => (
    <TouchableOpacity 
      style={styles.projectCard}
      onPress={() => navigation.navigate('ProjectDetails', { projectId: item.id })}
    >
      <View style={styles.projectHeader}>
        <Text variant="h3" weight="bold" style={styles.projectName}>{item.name}</Text>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: item.status === 'Active' ? theme.colors.successLight : theme.colors.border }
        ]}>
          <Text variant="caption" color={item.status === 'Active' ? theme.colors.success : theme.colors.textSecondary}>
            {item.status}
          </Text>
        </View>
      </View>
      {item.description && (
        <Text variant="body" color={theme.colors.textSecondary} style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      <View style={styles.footer}>
        {item.technologies && item.technologies.length > 0 && (
          <View style={styles.techContainer}>
            <Icon name="code" size={16} color={theme.colors.textTertiary} />
            <Text variant="caption" color={theme.colors.textSecondary} style={styles.techText}>
              {item.technologies.join(', ')}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Container safeArea padding={false}>
      <View style={styles.header}>
        <Text variant="h1">Projects</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateProject')}
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
          description="Create your first project to get started."
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
  projectCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  projectName: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
  },
  description: {
    marginBottom: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  techContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  techText: {
    marginLeft: theme.spacing.xs,
  },
});
