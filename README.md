# Tick Marker v1.0 - Task Management Mobile App

Tick Marker is a lightweight, user-friendly mobile application built with **React Native**, designed to help busy professionals like Dr. Nimal manage tasks efficiently. It allows users to create, update, delete, and filter tasks by due date and status while maintaining a clean, intuitive UI.


## Features

-  **Search Tasks** by name
-  **Filter Tasks** by:
  - Status: Pending, Done, Failed
  - Due Date: Upcoming, Overdue
-  **Mark Tasks as Done**
  - Automatically updates task status to **Done** when marked
  - Tasks not marked 24 hours after due date are marked **Failed**
-  **Due Date Constraints**
  - Users can't select past dates for new tasks
-  **Dark Mode / Light Mode Toggle**
-  **Settings Screen**
  - Clear all tasks at once
  - Enable/Disable Notifications
  - Toggle app theme


##  API Documentation

Base URL: `https://60a21a08745cd70017576014.mockapi.io/api/v1`

```bash
   GET /todo  Get all tasks  
```

```bash
   POST /todo  Create a new task  
```

```bash
   PUT /todo/:id  Update a task   
```

```bash
   DELETE  /todo/:id  Delete a task   
```

**Request Body (POST/PUT):**
```json
{
  "title": "Task title",
  "description": "Task description"
}
```

## Technology Used

- React Native
- Axios for HTTP requests
- React Native Modal & DateTimePicker
- AsyncStorage for theme/notification preferences
- CSS (StyleSheet) for styling

## Installation & Setup

1. Clone the repo:

   ```bash
   git clone https://github.com/faizansafwan/task-management.git
   cd task-management
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the app

   ```bash
   npx expo start
   ```

## Assumptions

- Tasks must have a title, description, and valid future due date.
- Tasks not completed within 24 hours of due date are marked as Failed
- Tasks are managed via an external API, and app updates are reflected live.
- Light/dark mode and notification settings persist locally using AsyncStorage.



## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

