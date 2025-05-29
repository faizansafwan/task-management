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
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
  const [disabledTasks, setDisabledTasks] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(10); // 👈 show 10 initially
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dateError, setDateError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCreatedAt, setFilterCreatedAt] = useState('');
  const [filterDueDate, setFilterDueDate] = useState('');


  const openModal = (todo: TodoItem) => {
    setSelectedTodo(todo);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedTodo(null);
    setDateError('');
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

          if (todo.dueDate && todo.dueDate.length === 16) {
            todo.dueDate += ':00Z';
          }
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

  // Add useFocusEffect to reload tasks when page is focused
  useFocusEffect(
    useCallback(() => {
      loadTodos();
    }, [])
  );

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


  const filteredTodos = todos
  .filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .filter((todo) => {
    if (filterStatus && todo.status !== filterStatus) return false;

    const now = new Date();
    if (filterDueDate === 'overdue' && new Date(todo.dueDate) > now) return false;
    if (filterDueDate === 'upcoming' && new Date(todo.dueDate) <= now) return false;

    return true;
  });


  const visibleTodos = filteredTodos.slice(0, visibleCount); 

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
        
              <View style={styles.filterBar}>

                {/* Filter by Status */}
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={filterStatus}
                    style={styles.picker}
                    onValueChange={(itemValue) => setFilterStatus(itemValue)}
                  >
                    <Picker.Item label="Status" value="" />
                    <Picker.Item label="Pending" value="Pending" />
                    <Picker.Item label="Done" value="Done" />
                    <Picker.Item label="Failed" value="Failed" />
                  </Picker>
                </View>

                {/* Filter by Date */}
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={filterDueDate}
                    style={styles.picker}
                    onValueChange={(itemValue) => setFilterDueDate(itemValue)} >
                     <Picker.Item label="Overdue" value="overdue" />
                     <Picker.Item label="Upcoming" value="upcoming" />
                  </Picker>
                </View>
              </View>


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

              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.stylishInput}
                value={selectedTodo?.title}
                onChangeText={(text) =>
                  setSelectedTodo((prev) => prev ? { ...prev, title: text } : null)
                }
                placeholder="Title"
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.stylishInput}
                value={selectedTodo?.description}
                onChangeText={(text) =>
                  setSelectedTodo((prev) => prev ? { ...prev, description: text } : null)
                }
                placeholder="Description"
                multiline
              />

              <Text style={styles.inputLabel}>Status</Text>
              <TextInput
                style={[styles.stylishInput, { color: '#aaa' }]}
                value={selectedTodo?.status}
                editable={false}
                placeholder="Status"
              />

              <Text style={styles.inputLabel}>Due Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerTrigger}>
                <Text style={styles.datePickerText}>
                  {selectedTodo?.dueDate ? new Date(selectedTodo.dueDate).toLocaleString() : 'Select Due Date'}
                </Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={showDatePicker}
                mode="datetime"
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

              {dateError ? (
                <Text style={styles.errorText}>{dateError}</Text>
              ) : null}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => {
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
                  style={styles.updateButton} >
                  <Text style={styles.updateText}>Update</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
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
                  style={styles.deleteButton} >
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
