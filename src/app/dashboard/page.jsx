"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import TaskForm from "@/components/taskForm";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ref to track if a delete operation is in progress
  const deleteInProgress = useRef(false);

  const fetchTasks = useCallback(async () => {
    if (status !== "authenticated" || !session) {
      return;
    }

    setLoading(true);

    try {
      const token = session.user.token;

      if (!token) {
        console.error("No token available in session");
        setError("Authentication token missing");
        setLoading(false);
        return;
      }

      const response = await axios.get("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const tasksFromServer = response.data;
      const uniqueTasks = [];
      const seenIds = new Set();

      for (const task of tasksFromServer) {
        const taskId = task.id || task._id;
        if (taskId && !seenIds.has(taskId)) {
          seenIds.add(taskId);
          uniqueTasks.push(task);
        }
      }

      setTasks(uniqueTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [session, status]);

  const handleTaskAdded = useCallback((newTask) => {
    const newTaskId = newTask.id || newTask._id;

    if (!newTaskId) {
      console.warn("New task missing ID:", newTask);
      return;
    }

    setTasks((prevTasks) => {
      const existingTaskIndex = prevTasks.findIndex((task) =>
        (task.id && task.id === newTaskId) || (task._id && task._id === newTaskId)
      );

      if (existingTaskIndex !== -1) {
        return prevTasks;
      }

      const toastId = `add-${newTaskId}`;
      toast.success(`Task added successfully`, { id: toastId });

      return [newTask, ...prevTasks];
    });
  }, []);

  // Update the handleTaskStatusChange function
  const handleTaskStatusChange = useCallback(
    async (taskId, completed) => {
      if (!session?.user?.token) {
        toast.error("Authentication required", { id: `auth-${taskId}` });
        return;
      }

      // Use a consistent toast ID
      const toastId = `task-update`;
      
      // Show loading state first
      toast.loading(`${completed ? "Completing" : "Reopening"} task...`, { id: toastId });

      // Optimistic update
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          (task.id === taskId || task._id === taskId)
            ? { ...task, completed }
            : task
        )
      );

      try {
        const response = await axios.put(
          `/api/tasks/${taskId}`,
          { completed },
          { headers: { Authorization: `Bearer ${session.user.token}` } }
        );
        
        // Replace loading toast with success toast
        toast.success(`Task ${completed ? "completed" : "reopened"}`, { id: toastId });
      } catch (err) {
        console.error("Error updating task:", err);
        toast.error("Failed to update task", { id: toastId });
        fetchTasks(); // Revert optimistic update on error
      }
    },
    [session, fetchTasks]
  );

  // Update the handleDeleteTask function
  const handleDeleteTask = useCallback(
    async (taskId) => {
      // Prevent multiple simultaneous delete calls
      if (deleteInProgress.current) {
        console.warn("Delete operation already in progress");
        return;
      }

      if (!session?.user?.token) {
        toast.error("Authentication required", { id: `auth-del-${taskId}` });
        return;
      }

      // Set the in-progress flag
      deleteInProgress.current = true;
      
      // Use a consistent toast ID
      const toastId = `task-delete`;
      
      // Show loading state first
      toast.loading("Deleting task...", { id: toastId });

      // Optimistic delete
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskId && task._id !== taskId)
      );

      try {
        const response = await axios.delete(`/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${session.user.token}` },
        });

        if (response.data.success) {
          // Replace loading toast with success toast
          toast.success("Task deleted successfully", { id: toastId });
        } else {
          throw new Error(response.data.message || "Delete failed");
        }
      } catch (err) {
        console.error("Error deleting task:", err);
        toast.error(`Failed to delete task: ${err.message || "Unknown error"}`, { id: toastId });
        fetchTasks(); // Refresh tasks on error
      } finally {
        deleteInProgress.current = false;
      }
    },
    [session, fetchTasks]
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl font-bold">Loading your workload don't Panic!</p>
      </div>
    );
  }

  return (
    <>
      <header>
        <nav>
          <div className="flex flex-row items-center justify-between p-2 m-3 rounded-full border">
            <div>
              <h1 className="text-2xl font-bold text-green-500 p-1">Taskoo</h1>
            </div>
            <div className="flex flex-row items-center gap-3 text-green-500">
              {session?.user?.email ? (
                <p className="text-sm font-bold border rounded-full p-1">
                  {session.user.email}
                </p>
              ) : (
                <p>No session data found.</p>
              )}
              <button
                className="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm p-2 m-2 dark:focus:ring-yellow-900 text-center"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      </header>
      <div className="p-4">
        <div className="flex flex-row items-center justify-between p-3 rounded-2xl">
          <div>
            <h2 className="font-bold text-2xl">Your Tasks</h2>
          </div>
          <div>
            <TaskForm onTaskAdded={handleTaskAdded} />
          </div>
        </div>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : tasks.length === 0 ? (
          <p className="text-center p-5 text-gray-500">
            No tasks found. Add your first task!
          </p>
        ) : (
          <div className="p-3 flex flex-col space-y-3 rounded-2xl border">
            {tasks.map((task) => {
              const taskKey = task.id || task._id;

              if (!taskKey) {
                console.warn("Task is missing an ID:", task);
                return null;
              }

              return (
                <div
                  key={taskKey}
                  className={`p-3 rounded-2xl border ${
                    task.completed
                      ? "border-gray-200 bg-gray-50"
                      : "border-red-100"
                  } hover:shadow-md transition-shadow`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div
                        className={
                          task.completed ? "line-through text-gray-500" : ""
                        }
                      >
                        <strong>{task.title}</strong>
                      </div>
                      {task.description && (
                        <p
                          className={`${
                            task.completed
                              ? "line-through text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          <i>{task.description}</i>
                        </p>
                      )}
                      <p
                        className={`text-sm mt-1 ${
                          task.completed ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Status: {task.completed ? "Completed" : "Pending"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleTaskStatusChange(taskKey, !task.completed)
                        }
                        className={`px-3 py-1 rounded-full text-sm ${
                          task.completed
                            ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                            : "bg-green-200 hover:bg-green-300 text-green-700"
                        }`}
                      >
                        {task.completed ? "Reopen" : "Complete"}
                      </button>
                      <button
                        onClick={() => handleDeleteTask(taskKey)}
                        className="px-3 py-1 rounded-full text-sm bg-red-200 hover:bg-red-300 text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}