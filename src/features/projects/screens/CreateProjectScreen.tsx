import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProjectsStackParamList } from '../ProjectsNavigator';
import { Container, Text, Input, Button } from '../../../shared/components';
import { theme } from '../../../core/theme';
import { createProject, ProjectRepository } from '../services/projectsService';
import Icon from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<ProjectsStackParamList, 'CreateProject'>;

export const CreateProjectScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [repositories, setRepositories] = useState<ProjectRepository[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech));
  };

  const handleAddRepository = () => {
    setRepositories([...repositories, { type: 'Web', url: '' }]);
  };

  const handleUpdateRepository = (index: number, field: 'type' | 'url', value: string) => {
    const updated = [...repositories];
    if (field === 'type') {
      updated[index].type = value as any;
    } else {
      updated[index].url = value;
    }
    setRepositories(updated);
  };

  const handleRemoveRepository = (index: number) => {
    const updated = [...repositories];
    updated.splice(index, 1);
    setRepositories(updated);
  };

  const handleCreate = async () => {
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
      await createProject({
        name,
        description,
        technologies,
        repositories,
        status: 'Active',
      });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container safeArea padding>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text variant="body" color={theme.colors.primary}>Cancel</Text>
        </TouchableOpacity>
        <Text variant="h2" style={styles.title}>New Project</Text>
        <TouchableOpacity onPress={handleCreate} disabled={loading} style={styles.backButton}>
          <Text variant="body" color={theme.colors.primary} weight="bold">Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
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
          <Text variant="h3" style={styles.sectionTitle}>Technologies</Text>
          <View style={styles.techInputRow}>
            <View style={{ flex: 1 }}>
              <Input
                placeholder="Add technology (e.g. react-native)"
                value={techInput}
                onChangeText={setTechInput}
                onSubmitEditing={handleAddTechnology}
              />
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleAddTechnology}>
              <Icon name="plus" size={20} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.chipContainer}>
            {technologies.map(tech => (
              <View key={tech} style={styles.chip}>
                <Text variant="caption" color={theme.colors.white}>{tech}</Text>
                <TouchableOpacity onPress={() => handleRemoveTechnology(tech)} style={styles.chipRemove}>
                  <Icon name="x" size={14} color={theme.colors.white} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h3" style={styles.sectionTitle}>Repositories</Text>
            <TouchableOpacity onPress={handleAddRepository}>
              <Text variant="body" color={theme.colors.primary}>+ Add Repo</Text>
            </TouchableOpacity>
          </View>
          {repositories.map((repo, index) => (
            <View key={index} style={styles.repoRow}>
              <View style={styles.repoInputs}>
                <TouchableOpacity 
                  style={styles.repoTypeSelector}
                  onPress={() => {
                    const types = ['Web', 'Server', 'Mobile', 'Other'];
                    const nextIndex = (types.indexOf(repo.type) + 1) % types.length;
                    handleUpdateRepository(index, 'type', types[nextIndex]);
                  }}
                >
                  <Text variant="caption" weight="bold">{repo.type}</Text>
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: theme.spacing.sm }}>
                  <Input
                    placeholder="https://github.com/..."
                    value={repo.url}
                    onChangeText={(val) => handleUpdateRepository(index, 'url', val)}
                    autoCapitalize="none"
                  />
                </View>
              </View>
              <TouchableOpacity style={styles.removeRepo} onPress={() => handleRemoveRepository(index)}>
                <Icon name="trash-2" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  section: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    marginBottom: theme.spacing.sm,
  },
  techInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    height: 48,
    width: 48,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  chipRemove: {
    marginLeft: theme.spacing.xs,
  },
  repoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  repoInputs: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  repoTypeSelector: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    minWidth: 80,
  },
  removeRepo: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
});
