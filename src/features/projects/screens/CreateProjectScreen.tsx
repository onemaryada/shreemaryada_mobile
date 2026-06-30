import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProjectsStackParamList } from '../ProjectsNavigator';
import { ScreenWrapper, Text, Input, Button, GlassCard } from '../../../shared/components';
import { theme } from '../../../core/theme';
import { createProject, updateProject, ProjectRepository } from '../services/projectsService';
import { useAuth } from '../../../core/auth/AuthContext';
import Icon from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'CreateProject'>;

export const CreateProjectScreen: React.FC<Props> = ({ route, navigation }) => {
  const project = route.params?.project;
  const isEditing = !!project;

  const { user } = useAuth();
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [techInput, setTechInput] = useState('');
  const [technologies, setTechnologies] = useState<string[]>(project?.technologies || []);
  const [status, setStatus] = useState<'Active' | 'Completed' | 'On Hold'>(project?.status || 'Active');
  const [loading, setLoading] = useState(false);

  const techInputRef = useRef<TextInput>(null);

  const handleAddTechnology = () => {
    if (techInputRef.current) {
      techInputRef.current.focus();
    }
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech));
  };

  const handleCreate = async () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Validation Error', 'Project name is required');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Description is required');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await updateProject(project.id, {
          name,
          description,
          technologies,
          status,
        });
      } else {
        await createProject(user.uid, {
          name,
          description,
          technologies,
          repositories: [],
          status,
        });
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper
      safeArea
      paddingHorizontal
      scrollable={false}
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
          <Text variant="h1" style={styles.title}>{isEditing ? 'Edit Project' : 'New Project'}</Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            {isEditing ? 'Update project details' : 'Create a new project to organize your tasks'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
        <Input
          label="Project Name *"
          placeholder="e.g. Website Redesign"
          value={name}
          onChangeText={setName}
        />

        <Input
          label="Description *"
          placeholder="What is this project about?"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        <View style={styles.section}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Project Status
          </Text>
          <View style={styles.statusContainer}>
            {(['Active', 'Completed', 'On Hold'] as const).map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.statusButton, status === s && styles.statusButtonActive]}
                onPress={() => setStatus(s)}
                activeOpacity={0.7}
              >
                <Text
                  variant="caption"
                  weight={status === s ? 'bold' : 'medium'}
                  color={status === s ? theme.colors.white : theme.colors.textSecondary}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text variant="h3" weight="bold" style={styles.sectionTitle}>
            Technologies
          </Text>
          <View style={styles.techInputRow}>
            <View style={{ flex: 1 }}>
              <Input
                ref={techInputRef}
                placeholder="Add technology (e.g. React Native)"
                value={techInput}
                onChangeText={setTechInput}
                onSubmitEditing={handleAddTechnology}
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddTechnology}
              activeOpacity={0.7}
            >
              <Icon name="plus" size={20} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.chipContainer}>
            {technologies.map(tech => (
              <GlassCard key={tech} style={styles.chip}>
                <Text variant="caption" color={theme.colors.primary} weight="medium">
                  {tech}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveTechnology(tech)}
                  style={styles.chipRemove}
                >
                  <Icon name="x" size={14} color={theme.colors.primary} />
                </TouchableOpacity>
              </GlassCard>
            ))}
          </View>
        </View>


        <Button
          title={loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Project'}
          onPress={handleCreate}
          loading={loading}
          fullWidth
          style={styles.submitButton}
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
  checkButton: {
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
  scrollContainer: {
    flex: 1,
  },
  form: {
    paddingBottom: theme.spacing.xl,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  section: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  techInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    height: 48,
    width: 48,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
  },
  chipRemove: {
    marginLeft: theme.spacing.xs,
  },
  repoCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  removeRepoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  removeText: {
    marginLeft: theme.spacing.xs,
  },
  submitButton: {
    marginBottom: theme.spacing.xl,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  statusButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'transparent',
  },
  statusButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
});
