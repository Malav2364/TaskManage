"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import TaskForm from "@/components/taskForm";
import axios from "axios";
import { Toaster } from "react-hot-toast";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Improve task handling function using useCallback for better performance
  const handleTaskAdded = useCallback((newTask) => {
    // Use a functional update to ensure we're working with the latest state
    setTasks(prevTasks => {
      // Check if the task already exists (might happen with optimistic updates)
      const exists = prevTasks.some(task => 
        task.id === newTask.id || task._id === newTask._id
      );
      
      // If it exists, don't duplicate it
      if (exists) {
        return prevTasks;
      }
      
      // Add the new task at the beginning of the list
      return [newTask, ...prevTasks];
    });
  }, []);

  // First check if user is authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Then fetch tasks only when session is available
  useEffect(() => {
    const fetchTasks = async () => {
      if (status !== "authenticated" || !session) {
        return;
      }
      
      try {
        // Notice the token is inside session.user.token based on your data
        const token = session.user.token;
        
        if (!token) {
          console.error("No token available in session");
          setError("Authentication token missing");
          setLoading(false);
          return;
        }
        
        const response = await axios.get("/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setTasks(response.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [session, status]);

  // Show loading while checking authentication or fetching tasks
  if (status === "loading" || (status === "authenticated" && loading)) {
    return <p>Loading...</p>;
  }

  // User is authenticated and tasks are loaded (or failed to load)
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
                <p className="text-sm font-bold border rounded-full p-1">{session.user.email}</p>
              ) : (
                <p>No session data found.</p>
              )}
              
              <button
                className="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm p-2 m-2 dark:focus:ring-yellow-900 text-center" 
                onClick={signOut}>
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
          <p>No tasks found.</p>
        ) : (
          <div className="p-3 flex flex-col space-y-3 rounded-2xl border">
            {tasks.map((task) => {
              const taskKey = task.id || task._id;
              
              if (!taskKey) {
                console.warn("Task is missing an ID:", task);
                return null; // Skip tasks without an ID
              }
              
              return (
                <div 
                  key={taskKey} 
                  className="p-3 rounded-2xl border border-red-100 hover:shadow-sm transition-shadow"
                >
                  <strong>{task.title}</strong>
                  {task.description && (
                    <p>Description: <i>{task.description}</i></p>
                  )}
                  <p>Status: {task.completed ? "Completed" : "Pending"}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}