/**
 * api.ts
 * 
 * API Service Module
 * 
 * This module provides functions for interacting with the task management API.
 * It handles CRUD operations for tasks including:
 * - Fetching task list
 * - Creating new tasks
 * - Updating existing tasks
 * - Deleting tasks
 */

import { BASE_URL } from "@/constants/url";

/**
 * Fetches the complete list of tasks from the API
 * 
 * @returns {Promise<Array>} A promise that resolves to an array of task objects
 * @throws {Error} If the API request fails
 */
export async function getTaskList() {
    const response = await fetch(`${BASE_URL}/todo`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();
}

/**
 * Updates an existing task with new information
 * 
 * @param {string} id - The unique identifier of the task to update
 * @param {Object} updatedFields - The fields to update in the task
 * @param {string} [updatedFields.title] - New title for the task
 * @param {string} [updatedFields.description] - New description for the task
 * @param {string} [updatedFields.status] - New status for the task
 * @param {string} [updatedFields.dueDate] - New due date for the task
 * @returns {Promise<Object>} A promise that resolves to the updated task object
 * @throws {Error} If the API request fails
 */
export async function updateTask(id: string, updatedFields: Partial<{ 
  title: string; 
  description: string; 
  status: string; 
  dueDate: string 
}>) {
  const response = await fetch(`${BASE_URL}/todo/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedFields),
  });

  if (!response.ok) {
    throw new Error('Failed to update task');
  }

  return response.json();
}

/**
 * Deletes a task from the system
 * 
 * @param {string} id - The unique identifier of the task to delete
 * @returns {Promise<void>} A promise that resolves when the task is deleted
 * @throws {Error} If the API request fails
 */
export async function deleteTask(id: string) {
  const response = await fetch(`${BASE_URL}/todo/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete task with id: ${id}`);
  }
}

/**
 * Creates a new task in the system
 * 
 * @param {Object} task - The task object to create
 * @param {string} task.title - The title of the task
 * @param {string} task.description - The description of the task
 * @param {string} task.dueDate - The due date of the task
 * @returns {Promise<Object>} A promise that resolves to the created task object
 * @throws {Error} If the API request fails
 */
export async function addTask(task: { 
  title: string; 
  description: string; 
  dueDate: string 
}) {
  const response = await fetch(`${BASE_URL}/todo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...task,
      status: 'Pending', // Automatically set to Pending for new tasks
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to add task');
  }

  return response.json();
}

