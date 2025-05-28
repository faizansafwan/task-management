import { BASE_URL } from "@/constants/url";

export async function getTaskList() {
    const response = await fetch(`${BASE_URL}/todo`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();
}

export async function updateTask(id: string, updatedFields: Partial<{ title: string; description: string; status: string; dueDate: string }>) {
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