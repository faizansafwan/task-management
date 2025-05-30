/**
 * TaskItemModel.tsx
 * 
 * Task Item Component
 * 
 * A reusable component that displays a single task item in a card format.
 * Features:
 * - Task title and description display
 * - Due date formatting
 * - Status indicator with color coding
 * - Checkbox for task completion
 * - Touch interaction for task details
 */

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * TodoItem Type
 * 
 * Represents the structure of a task item in the application
 * @property {string} id - Unique identifier for the task
 * @property {string} title - Task title
 * @property {string} description - Detailed task description
 * @property {string} dueDate - Task due date in ISO string format
 * @property {string} status - Current status of the task ('Done', 'Failed', or 'Pending')
 */
export type TodoItem = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
};

/**
 * TaskItemProps Interface
 * 
 * Props for the TaskItem component
 * @property {TodoItem} todo - The task item to display
 * @property {boolean} isChecked - Whether the task is marked as complete
 * @property {boolean} isDisabled - Whether the task can be interacted with
 * @property {function} onToggle - Callback function when task completion is toggled
 * @property {function} onPress - Optional callback function when task is pressed
 */
interface TaskItemProps {
  todo: TodoItem;
  isChecked: boolean;
  isDisabled: boolean;
  onToggle: (id: string) => void;
  onPress?: (todo: TodoItem) => void;
}

/**
 * TaskItem Component
 * 
 * Renders a single task item with its details and interactive elements
 * 
 * @param {TaskItemProps} props - The component props
 * @returns {JSX.Element} A styled task item card
 */
export default function TaskItem({ todo, isChecked, isDisabled, onToggle, onPress }: TaskItemProps) {
  /**
   * Determines the style for the status text based on task status
   * @returns {object} Style object for the status text
   */
  const getStatusTextStyle = () => {
    switch (todo.status) {
      case 'Done':
        return styles.doneStatus;
      case 'Failed':
        return styles.failedStatus;
      default:
        return styles.pendingStatus;
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress?.(todo)} activeOpacity={0.8}>
      <ThemedView style={styles.card} darkColor={Colors.primary.Background} lightColor='#ecedeb'>
        <View style={styles.cardContent}>

          {/* Task Details Section */}
          <View style={{ flex: 1 }}>

            {/* Title and Due Date Row */}
            <View style={styles.titleRow}>
              <ThemedText type="subtitle">{todo.title}</ThemedText>
              <ThemedText style={styles.dueDate}>{new Date(todo.dueDate).toLocaleString()}</ThemedText>
            </View>

            {/* Task Description */}
            <ThemedText>{todo.description}</ThemedText>

            {/* Status Indicator */}
            <Text style={[styles.statusText, getStatusTextStyle()]}>{todo.status} </Text>

          </View>

          {/* Completion Checkbox */}
          <TouchableOpacity  onPress={() => !isDisabled && onToggle(todo.id)}  
            style={[styles.checkbox, isDisabled && { opacity: 0.4 }]}  disabled={isDisabled} >
            {isChecked && <ThemedText style={styles.checkmark}>✓</ThemedText>}
          </TouchableOpacity>

        </View>
      </ThemedView>
      
    </TouchableOpacity>
  );
}

/**
 * Component Styles
 * 
 * Defines the visual appearance of the TaskItem component
 */
const styles = StyleSheet.create({
  // Card container styles
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

  // Checkbox styles
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

  // Status indicator styles
  statusText: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
    color: '#000',
    fontWeight: 'bold',
  },
  pendingStatus: {
    backgroundColor: '#9dc8f5', // Light Blue
  },
  doneStatus: {
    backgroundColor: '#A4B465', // Light Green
  },
  failedStatus: {
    backgroundColor: '#fc6d7a', // Light Red
  },

  // Title and date styles
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 12,
    color: '#666',
  },
});
