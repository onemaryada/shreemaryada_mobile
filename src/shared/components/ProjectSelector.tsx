import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Text } from './Text';
import { GlassCard } from './GlassCard';
import { theme } from '../../core/theme';
import { Project, getUserProjects } from '../../features/projects/services/projectsService';
import Icon from 'react-native-vector-icons/Feather';

interface ProjectSelectorProps {
  selectedProjectId: string;
  onSelectProject: (projectId: string, projectName: string) => void;
  userId: string;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  selectedProjectId,
  onSelectProject,
  userId,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const unsubscribe = getUserProjects(userId, (fetchedProjects) => {
      setProjects(fetchedProjects);
      setLoading(false);
      if (selectedProjectId) {
        const found = fetchedProjects.find(p => p.id === selectedProjectId);
        setSelectedProject(found || null);
      }
    });

    return unsubscribe;
  }, [userId, selectedProjectId]);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    onSelectProject(project.id, project.name);
    setIsModalVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <Text variant="caption" weight="bold" color={theme.colors.textSecondary} style={styles.label}>
          PROJECT *
        </Text>
        <TouchableOpacity
          style={[
            styles.selectorButton,
            !selectedProject && styles.selectorButtonError,
          ]}
          onPress={() => setIsModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.selectorContent}>
            <Icon
              name={selectedProject ? 'folder' : 'plus-circle'}
              size={20}
              color={selectedProject ? theme.colors.primary : theme.colors.error}
            />
            <View style={styles.selectedTextContainer}>
              <Text
                variant="body"
                weight={selectedProject ? 'medium' : 'regular'}
                color={selectedProject ? theme.colors.text : theme.colors.error}
              >
                {selectedProject ? selectedProject.name : 'Select a project'}
              </Text>
              {selectedProject && (
                <Text variant="caption" color={theme.colors.textSecondary}>
                  {selectedProject.description}
                </Text>
              )}
            </View>
          </View>
          <Icon
            name="chevron-down"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
        {!selectedProject && (
          <Text variant="caption" color={theme.colors.error} style={styles.errorText}>
            Please select a project to create a task
          </Text>
        )}
      </View>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h3" weight="bold">
                Select Project
              </Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="x" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            ) : projects.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="inbox" size={48} color={theme.colors.textTertiary} />
                <Text variant="h3" weight="bold" style={styles.emptyTitle}>
                  No Projects
                </Text>
                <Text
                  variant="body"
                  color={theme.colors.textSecondary}
                  style={styles.emptyDescription}
                >
                  Create a project first to add tasks
                </Text>
              </View>
            ) : (
              <FlatList
                data={projects}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.projectItem,
                      selectedProject?.id === item.id && styles.projectItemActive,
                    ]}
                    onPress={() => handleSelectProject(item)}
                    activeOpacity={0.6}
                  >
                    <View style={styles.projectItemContent}>
                      <View style={styles.projectItemLeft}>
                        <View
                          style={[
                            styles.projectIcon,
                            { backgroundColor: theme.colors.primary + '20' },
                          ]}
                        >
                          <Icon
                            name="folder"
                            size={20}
                            color={theme.colors.primary}
                          />
                        </View>
                        <View style={styles.projectItemText}>
                          <Text variant="body" weight="bold">
                            {item.name}
                          </Text>
                          <Text
                            variant="caption"
                            color={theme.colors.textSecondary}
                            numberOfLines={1}
                          >
                            {item.description}
                          </Text>
                        </View>
                      </View>
                      {selectedProject?.id === item.id && (
                        <Icon
                          name="check-circle"
                          size={24}
                          color={theme.colors.primary}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                scrollEnabled={projects.length > 5}
                style={styles.projectsList}
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  selectorButtonError: {
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.error + '10',
  },
  selectorContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  selectedTextContainer: {
    flex: 1,
  },
  errorText: {
    marginTop: theme.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingTop: theme.spacing.lg,
    maxHeight: '80%',
    paddingHorizontal: theme.spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  emptyTitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyDescription: {
    textAlign: 'center',
  },
  projectsList: {
    paddingBottom: theme.spacing.lg,
  },
  projectItem: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  projectItemActive: {
    backgroundColor: theme.colors.primary + '15',
  },
  projectItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  projectItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  projectIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectItemText: {
    flex: 1,
  },
});
