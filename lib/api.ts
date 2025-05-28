import { BASE_URL } from "@/constants/url";

export async function getTaskList() {
    const response = await fetch(`${BASE_URL}/todo`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();
  }