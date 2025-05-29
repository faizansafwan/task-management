import { BASE_URL } from "@/constants/url";

export async function getTaskList() {
    const response = await fetch(`${BASE_URL}/todo`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();
}

export async function updateTask(id: string, updatedFields: Partial<{ title: string; description: string; status: string; 
  dueDate: string }>) {
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


export async function deleteTask(id: string) {
  const response = await fetch(`${BASE_URL}/todo/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete task with id: ${id}`);
  }
}

export async function addTask(task: { title: string; description: string; dueDate: string }) {
  const response = await fetch(`${BASE_URL}/todo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...task,
      status: 'Pending', // Automatically set to Pending
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to add task');
  }

  return response.json();
}

