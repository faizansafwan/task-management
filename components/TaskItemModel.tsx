import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type TodoItem = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
};

interface TaskItemProps {
  todo: TodoItem;
  isChecked: boolean;
  isDisabled: boolean;
  onToggle: (id: string) => void;
  onPress?: (todo: TodoItem) => void;
}

export default function TaskItem({ todo, isChecked, isDisabled, onToggle, onPress }: TaskItemProps) {
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
          <View style={{ flex: 1 }}>
            <ThemedText type="subtitle">{todo.title}</ThemedText>
            <ThemedText>{todo.description}</ThemedText>
            <Text style={[styles.statusText, getStatusTextStyle()]}>{todo.status} </Text>
            <ThemedText>Due: {new Date(todo.dueDate).toLocaleString()}</ThemedText>
          </View>

          <TouchableOpacity onPress={() => !isDisabled && onToggle(todo.id)} style={[styles.checkbox, isDisabled && 
            { opacity: 0.4 }]} disabled={isDisabled} >
            {isChecked && <ThemedText style={styles.checkmark}>✓</ThemedText>}
          </TouchableOpacity>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
