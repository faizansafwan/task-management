import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getTaskList } from '@/lib/api';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';


type TodoItem = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
};

export default function TaskList() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
  const [disabledTasks, setDisabledTasks] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  

  useEffect(() => {
    async function loadTodos() {
      try {
        const data = await getTaskList();
        const now = new Date();
  
        const updatedCheckedTasks: Record<string, boolean> = {};
        const updatedDisabledTasks: Record<string, boolean> = {};
  
        const updatedData = data.map((todo: TodoItem) => {
          const due = new Date(todo.dueDate);
          const diffInHours = (now.getTime() - due.getTime()) / (1000 * 60 * 60);
  
          if (todo.status !== 'Done' && diffInHours > 24) {
            updatedCheckedTasks[todo.id] = false;
            updatedDisabledTasks[todo.id] = true;
            return { ...todo, status: 'Failed' };
          }
  
          updatedCheckedTasks[todo.id] = todo.status === 'Done';
          updatedDisabledTasks[todo.id] = false;
          return todo;
        });
  
        setTodos(updatedData);
        setCheckedTasks(updatedCheckedTasks);
        setDisabledTasks(updatedDisabledTasks);
      } catch (err) {
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    }
  
    loadTodos();
  }, []);
  
  

  const toggleCheck = (id: string) => {
    setCheckedTasks((prev) => {
      const isChecked = !prev[id];
  
      // Update task status in todos
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, status: isChecked ? 'Done' : 'Pending' } : todo
        )
      );
  
      return {
        ...prev,
        [id]: isChecked,
      };
    });
  };
  
  

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );


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
      <ThemedView style={styles.container}>

      <TextInput placeholder="Search tasks..." value={searchQuery} onChangeText={setSearchQuery} style={styles.searchBar} />

        <ThemedText type="title" style={styles.header}>Task List</ThemedText>

        {filteredTodos.map((todo) => (
          <ThemedView key={todo.id} style={styles.card}>
            <View style={styles.cardContent}>
              <View style={{ flex: 1 }}>
                <ThemedText type="subtitle">{todo.title}</ThemedText>
                <ThemedText>{todo.description}</ThemedText>
                <ThemedText>Status: {todo.status}</ThemedText>
                <ThemedText>Due: {new Date(todo.dueDate).toLocaleString()}</ThemedText>
              </View>

              <TouchableOpacity onPress={() => !disabledTasks[todo.id] && toggleCheck(todo.id)} style={[ styles.checkbox,
                  disabledTasks[todo.id] && { opacity: 0.4 }, ]} disabled={disabledTasks[todo.id]} >
                
                {checkedTasks[todo.id] && (
                  <ThemedText style={styles.checkmark}>✓</ThemedText>
                )}
              </TouchableOpacity>

            </View>
          </ThemedView>
        ))}
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
  card: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkmark: {
    fontSize: 16,
    color: 'green',
    
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },

  searchBar: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  
});
