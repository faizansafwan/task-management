import TaskItem, { TodoItem } from '@/components/TaskItemModel';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getTaskList, updateTask } from '@/lib/api';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, View } from 'react-native';

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

    loadTodos();
  }, []);

  const toggleCheck = async (id: string) => {
    setCheckedTasks((prev) => {
      const isChecked = !prev[id];

      setTodos((prevTodos) =>
        prevTodos.map((todo) => {
          if (todo.id === id) {
            const updatedStatus = isChecked ? 'Done' : 'Pending';
            updateTask(id, { ...todo, status: updatedStatus });
            return { ...todo, status: updatedStatus };
          }
          return todo;
        })
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
        <TextInput
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
        />

        <ThemedText type="title" style={styles.header}>ALL </ThemedText>

        {filteredTodos.map((todo) => (
          <TaskItem
            key={todo.id}
            todo={todo}
            isChecked={checkedTasks[todo.id]}
            isDisabled={disabledTasks[todo.id]}
            onToggle={toggleCheck}
          />
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
