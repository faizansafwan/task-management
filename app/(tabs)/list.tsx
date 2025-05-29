import Header from '@/components/Header';
import TaskItem, { TodoItem } from '@/components/TaskItemModel';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getTaskList, updateTask } from '@/lib/api';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TaskList() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
  const [disabledTasks, setDisabledTasks] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(10); // 👈 show 10 initially

  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = (todo: TodoItem) => {
    setSelectedTodo(todo);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedTodo(null);
  };

  async function loadTodos() {
    try {
      setLoading(true);
      const data = await getTaskList();
      const now = new Date();

      const updatedCheckedTasks: Record<string, boolean> = {};
      const updatedDisabledTasks: Record<string, boolean> = {};

      const updatedData = await Promise.all(
        data.map(async (todo: TodoItem) => {
          const due = new Date(todo.dueDate);
          const diffInHours = (now.getTime() - due.getTime()) / (1000 * 60 * 60);

          if (todo.status !== 'Done' && diffInHours > 24) {
            updatedCheckedTasks[todo.id] = false;
            updatedDisabledTasks[todo.id] = true;
            const updatedTodo = { ...todo, status: 'Failed' };
            await updateTask(todo.id, updatedTodo);
            return updatedTodo;
          }

          updatedCheckedTasks[todo.id] = todo.status === 'Done';
          updatedDisabledTasks[todo.id] = false;
          return todo;
        })
      );

      setTodos(updatedData);
      setCheckedTasks(updatedCheckedTasks);
      setDisabledTasks(updatedDisabledTasks);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  const toggleCheck = async (id: string) => {
    const current = checkedTasks[id];
    const newStatus = current ? 'Pending' : 'Done';
    try {
      await updateTask(id, {
        ...todos.find((todo) => todo.id === id)!,
        status: newStatus,
      });
      await loadTodos(); // refresh the list
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleTodos = filteredTodos.slice(0, visibleCount); // 👈 limit by visible count

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <ThemedText type="subtitle">{error}</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView>
      <Header title='TManager' showSearchIcon={true} searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.header}>ALL</ThemedText>

        {visibleTodos.map((todo) => (
          <TaskItem key={todo.id} todo={todo} isChecked={checkedTasks[todo.id]} isDisabled={disabledTasks[todo.id]}
            onToggle={toggleCheck} onPress={openModal} />
        ))}

        {visibleCount < filteredTodos.length && (
          <TouchableOpacity onPress={() => setVisibleCount(prev => prev + 10)} style={styles.showMoreContainer}>
              <ThemedText type="default" style={styles.showMoreText}>Show More</ThemedText>
          </TouchableOpacity>
          
        )}

<Modal visible={isModalVisible} transparent={true} animationType="fade" onRequestClose={closeModal}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Edit Task</Text>

      <TextInput
        style={styles.stylishInput}
        value={selectedTodo?.title}
        onChangeText={(text) =>
          setSelectedTodo((prev) => prev ? { ...prev, title: text } : null)
        }
        placeholder="Title"
      />
      <TextInput
        style={styles.stylishInput}
        value={selectedTodo?.description}
        onChangeText={(text) =>
          setSelectedTodo((prev) => prev ? { ...prev, description: text } : null)
        }
        placeholder="Description"
        multiline
      />
      <TextInput
        style={[styles.stylishInput, { color: '#aaa' }]}
        value={selectedTodo?.status}
        onChangeText={(text) =>
          setSelectedTodo((prev) => prev ? { ...prev, status: text } : null)
        }
        placeholder="Status"
        editable={false}
      />
      <TextInput
        style={styles.stylishInput}
        value={selectedTodo?.dueDate ? new Date(selectedTodo.dueDate).toLocaleString() : ''}
        editable={true}
        placeholder="Due Date"
      />

      <TouchableOpacity onPress={async () => {
        if (selectedTodo) {
          try {
            await updateTask(selectedTodo.id, selectedTodo);
            await loadTodos();
            closeModal();
          } catch (err) {
            setError("Failed to update task");
          }
        }
      }} style={styles.modalCloseButton}>
        <Text style={styles.modalCloseText}>Update</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>



      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  showMoreContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  showMoreText: {
    color: 'green',
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
  },
  modalCloseText: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
  },

  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
  },

  editableInput: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff', // white background
    fontSize: 16,
  },

  modalTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  
  stylishInput: {
    fontSize: 16,
    paddingVertical: 10,
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
    backgroundColor: 'transparent',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  
  
  
  
  
});
