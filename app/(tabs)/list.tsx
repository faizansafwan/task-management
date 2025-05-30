/**
 * list.tsx
 * 
 * Task List Screen Component
 * 
 * This component displays a list of tasks with filtering, search, and pagination capabilities.
 * Features include:
 * - Task status management (Pending, Done, Failed)
 * - Search functionality
 * - Status and date filtering
 * - Pagination with "Show More" functionality
 * - Task editing and deletion
 * - Automatic status updates for overdue tasks
 */

import Header from '@/components/Header';
import TaskItem, { TodoItem } from '@/components/TaskItemModel';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { deleteTask, getTaskList, updateTask } from '@/lib/api';
import { useFocusEffect } from '@react-navigation/native';
import { Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { Picker } from '@react-native-picker/picker';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function TaskList() {
  // Task list and UI state management
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Task status tracking
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
  const [disabledTasks, setDisabledTasks] = useState<Record<string, boolean>>({});
  
  // Search and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  
  // Modal and date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dateError, setDateError] = useState('');
  
  // Filter states
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCreatedAt, setFilterCreatedAt] = useState('');
  const [filterDueDate, setFilterDueDate] = useState('');

  /**
   * Opens the edit modal for a specific task
   * @param todo - The task to be edited
   */
  const openModal = (todo: TodoItem) => {
    setSelectedTodo(todo);
    setIsModalVisible(true);
  };

  /**
   * Closes the edit modal and resets related states
   */
  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedTodo(null);
    setDateError('');
  };

  /**
   * Loads tasks from the backend and updates their status based on due dates
   * Automatically marks tasks as Failed if they are overdue
   */
  async function loadTodos() {
    try {
      setLoading(true);

      // Fetch task list from backend
      const data = await getTaskList();
      const now = new Date();

      // Initialize status tracking objects
      const updatedCheckedTasks: Record<string, boolean> = {};
      const updatedDisabledTasks: Record<string, boolean> = {};

      // Process each task and update its status
      const updatedData = await Promise.all(
        data.map(async (todo: TodoItem) => {
          // Ensure proper date format
          if (todo.dueDate && todo.dueDate.length === 16) {
            todo.dueDate += ':00Z';
          }
          const due = new Date(todo.dueDate);
          const diffInHours = (now.getTime() - due.getTime()) / (1000 * 60 * 60);

          // Mark overdue tasks as Failed
          if (todo.status !== 'Done' && diffInHours > 24) {
            updatedCheckedTasks[todo.id] = false;
            updatedDisabledTasks[todo.id] = true;
            const updatedTodo = { ...todo, status: 'Failed' };
            await updateTask(todo.id, updatedTodo);
            return updatedTodo;
          }

          // Update status tracking
          updatedCheckedTasks[todo.id] = todo.status === 'Done';
          updatedDisabledTasks[todo.id] = false;
          return todo;
        })
      );

      // Update state with processed tasks
      setTodos(updatedData);
      setCheckedTasks(updatedCheckedTasks);
      setDisabledTasks(updatedDisabledTasks);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  // Load tasks on component mount
  useEffect(() => {
    loadTodos();
  }, []);

  // Reload tasks when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadTodos();
    }, [])
  );

  /**
   * Toggles the completion status of a task between Done and Pending
   * @param id - The ID of the task to toggle
   */
  const toggleCheck = async (id: string) => {
    const current = checkedTasks[id];
    const newStatus = current ? 'Pending' : 'Done';
    try {
      await updateTask(id, {
        ...todos.find((todo) => todo.id === id)!,
        status: newStatus,
      });
      await loadTodos(); // Refresh the list
    } catch (err) {
      setError('Failed to update task');
    }
  };

  /**
   * Filters tasks based on search query and selected filters
   * Applies both status and date-based filtering
   */
  const filteredTodos = todos
    .filter((todo) =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((todo) => {
      // Apply status filter
      if (filterStatus && todo.status !== filterStatus) return false;

      // Apply date filter
      const now = new Date();
      if (filterDueDate === 'overdue' && new Date(todo.dueDate) > now) return false;
      if (filterDueDate === 'upcoming' && new Date(todo.dueDate) <= now) return false;

      return true;
    });

  // Get paginated tasks
  const visibleTodos = filteredTodos.slice(0, visibleCount); 

  // Loading state UI
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Error state UI
  if (error) {
    return (
      <View style={styles.center}>
        <ThemedText type="subtitle">{error}</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView>
      {/* Header with search functionality */}
      <Header title='TManager' showSearchIcon={true} searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <ThemedView style={styles.container}>
        
        {/* Filter controls */}
        <View style={styles.filterBar}>

          {/* Status filter dropdown */}
          <View style={styles.pickerContainer}>
            <Picker selectedValue={filterStatus} style={styles.picker} onValueChange={(itemValue) => setFilterStatus(itemValue)} >

              {/* Status filter options */}
              <Picker.Item label="Status" value="" />
              <Picker.Item label="Pending" value="Pending" />
              <Picker.Item label="Done" value="Done" />
              <Picker.Item label="Failed" value="Failed" />
            </Picker>
          </View>

          {/* Date filter dropdown */}
          <View style={styles.pickerContainer}>
            <Picker selectedValue={filterDueDate} style={styles.picker} onValueChange={(itemValue) => setFilterDueDate(itemValue)} >

              {/* Date filter options */}
              <Picker.Item label="Overdue" value="overdue" />
              <Picker.Item label="Upcoming" value="upcoming" />
            </Picker>
          </View>

        </View>

        {/* rendering Task list */}
        {visibleTodos.map((todo) => (
          <TaskItem  key={todo.id}  todo={todo}  isChecked={checkedTasks[todo.id]}  isDisabled={disabledTasks[todo.id]}
           onToggle={toggleCheck} onPress={openModal} />
        ))}

        {/* Show more button */}
        {visibleCount < filteredTodos.length && (
          <TouchableOpacity  onPress={() => setVisibleCount(prev => prev + 10)}  style={styles.showMoreContainer}>
            <ThemedText type="default" style={styles.showMoreText}>Show More</ThemedText>
          </TouchableOpacity>
        )}

        {/* Edit task modal */}
        <Modal visible={isModalVisible} transparent={true} animationType="fade" onRequestClose={closeModal} >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Task</Text>

              {/* Task title input */}
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput  style={styles.stylishInput}  value={selectedTodo?.title}  onChangeText={(text) =>
                  setSelectedTodo((prev) => prev ? { ...prev, title: text } : null)
                }  placeholder="Title" />

              {/* Task description input */}
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput  style={styles.stylishInput} value={selectedTodo?.description} onChangeText={(text) =>
                  setSelectedTodo((prev) => prev ? { ...prev, description: text } : null)
                }  placeholder="Description"  multiline />

              {/* Task status display */}
              <Text style={styles.inputLabel}>Status</Text>
              <TextInput  style={[styles.stylishInput, { color: '#aaa' }]} value={selectedTodo?.status}  editable={false}
                placeholder="Status"  />

              {/* Due date picker */}
              <Text style={styles.inputLabel}>Due Date</Text>
              <TouchableOpacity  onPress={() => setShowDatePicker(true)}  style={styles.datePickerTrigger} >
                <Text style={styles.datePickerText}>
                  {selectedTodo?.dueDate ? new Date(selectedTodo.dueDate).toLocaleString() : 'Select Due Date'}
                </Text>
              </TouchableOpacity>

              {/* Date picker modal */}
              <DateTimePickerModal  isVisible={showDatePicker}  mode="datetime" 
                date={selectedTodo?.dueDate ? new Date(selectedTodo.dueDate) : new Date()}
                onConfirm={(selectedDate) => {
                  const now = new Date();
                  if (selectedDate < now) {
                    setDateError('Cannot set due date in the past');
                    setShowDatePicker(false);
                    return;
                  }
                  setDateError('');
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setSelectedTodo((prev) =>
                      prev ? { ...prev, dueDate: selectedDate.toISOString() } : null
                    );
                  }
                }}
                onCancel={() => {
                  setShowDatePicker(false);
                  setDateError('');
                }}
              />

              {/* Date error message */}
              {dateError ? (
                <Text style={styles.errorText}>{dateError}</Text>
              ) : null}

              {/* Action buttons */}
              <View style={styles.buttonRow}>
                {/* Update button */}
                <TouchableOpacity  onPress={() => {
                    if (selectedTodo) {
                      Alert.alert(
                        'Confirm Update',
                        'Are you sure you want to update this task?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Update',
                            onPress: async () => {
                              try {
                                const updatedTodo = {
                                  ...selectedTodo,
                                  status: 'Pending',
                                };
                                await updateTask(selectedTodo.id, updatedTodo);
                                await loadTodos();
                                closeModal();
                              } catch (err) {
                                setError('Failed to update task');
                              }
                            },
                          },
                        ]
                      );
                    }
                  }} 
                  style={styles.updateButton}  >
                  <Text style={styles.updateText}>Update</Text>
                </TouchableOpacity>

                {/* Delete button */}
                <TouchableOpacity onPress={() => {
                    if (selectedTodo) {
                      Alert.alert(
                        'Confirm Delete',
                        'Are you sure you want to delete this task?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: async () => {
                              try {
                                await deleteTask(selectedTodo.id);
                                await loadTodos();
                                closeModal();
                              } catch (err) {
                                setError('Failed to delete task');
                              }
                            },
                          },
                        ]
                      );
                    }
                  }} 
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
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
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 6,
    backgroundColor: Colors.primary.Background,
    elevation: 5,
    borderRadius: 5,
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
    fontSize: 12,
  },

  modalTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  
  stylishInput: {
    fontSize: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#4CAF50',
    backgroundColor: 'transparent',
    borderRadius: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  
  inputLabel: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    color: '#333',
    marginTop: 10,
  },

  datePickerTrigger: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#4CAF50',
    marginBottom: 16,
  },
  datePickerText: {
    fontSize: 15,
    color: '#333',
  },
  
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  updateButton: {
    backgroundColor: Colors.primary.Background,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  updateText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: Colors.secondary.Background, // Use the defined color
    fontWeight: 'bold',
    fontSize: 16,
  },
  filtersContainer: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  marginBottom: 10,
  flexWrap: 'wrap',
  },
  filterGroup: {
    marginLeft: 10,
    alignItems: 'flex-end',
  },
  filterBar: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
  justifyContent: 'space-between',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    width: 160,
  },
  picker: {
    height: 60,
    width: '100%',
  },

});
