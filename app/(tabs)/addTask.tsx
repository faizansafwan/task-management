/**
 * AddTask.tsx
 *
 * A screen component that allows users to add a new task.
 * Includes title, description, due date input, and schedules a local notification.
 * Shows a loading indicator while submitting the task.
 */


import Header from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { addTask } from "@/lib/api";
import { scheduleTaskNotifications } from '@/lib/notification';
import { useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function AddTask() {

  // State for task inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());

  // State to control date picker visibility
  const [showPicker, setShowPicker] = useState(false);

  // Loading state to show ActivityIndicator
  const [loading, setLoading] = useState(false);

  // Handles form submission
  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Validation", "Title and description are required.");
      return;
    }

    setLoading(true);
    try {

      // Send task to backend
      const newTask = await addTask({
        title,
        description,
        dueDate: dueDate.toISOString(),
      });

      // Schedule a local notification for the task
      await scheduleTaskNotifications({
        id: newTask.id,
        title: newTask.title,
        dueDate: newTask.dueDate,
      });
      
      // Reset form and show success
      Alert.alert("Success", "Task added successfully.");
      setTitle('');
      setDescription('');
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <View style={styles.container}>

      {/* App header */}
      <Header title="TManager" />


      <ThemedView style={styles.form}>

        {/* Title input */}
        <ThemedText style={styles.label}>Title</ThemedText>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="Enter task title" />

        {/* Description input */}
        <ThemedText style={styles.label}>Description</ThemedText>
        <TextInput value={description} onChangeText={setDescription} style={[styles.input, styles.textArea]} 
          placeholder="Enter task description" multiline 
        />

        {/* Due date selector */}
        <ThemedText style={styles.label}>Due Date</ThemedText>
        <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.datePickerTrigger}>
            <Text style={styles.datePickerText}> {dueDate ? dueDate.toLocaleString() : 'Select Due Date'}</Text>
        </TouchableOpacity>

        {/* Date picker modal */}
        <DateTimePickerModal isVisible={showPicker} mode="datetime" date={dueDate} 
          onConfirm={(selectedDate) => {
            const now = new Date();
            if (selectedDate < now) {
              Alert.alert("Validation", "Cannot set due date in the past.");
              setShowPicker(false);
              return;
            }
            setShowPicker(false);
            setDueDate(selectedDate);
          }} onCancel={() => setShowPicker(false)}
        />

        {/* Submit button, it will show loading indicator when loading */}
        <View style={styles.submitBtn}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary.Background} />
          ) : (
            <Button title="Add Task" onPress={handleSubmit} color={Colors.primary.Background} />
          )}
        </View>
      </ThemedView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 20,
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitBtn: {
    marginTop: 20,
  },

  datePickerTrigger: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  
});
