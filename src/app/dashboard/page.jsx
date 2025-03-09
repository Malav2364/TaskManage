"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log("Fetching tasks with session:", session);
        
        // Notice the token is inside session.user.token based on your data
        const token = session.user.token;
        
        if (!token) {
          console.error("No token available in session");
          setError("Authentication token missing");
          setLoading(false);
          return;
        }
        
        console.log("Using token for API request:", token.substring(0, 10) + "...");
        
        const response = await axios.get("/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log("Tasks API response:", response.data);
        setTasks(response.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
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
          <div className="flex flex-row items-center justify-between p-2.5 m-3 rounded-xl bg-red-200">
            <div>
              <h3>Taskoo</h3>
            </div>
            <div className="flex flex-row items-center gap-3 text-red-600">
              {session?.user?.email ? (
                <p>{session.user.email}</p>
              ) : (
                <p>No session data found.</p>
              )}
              <button
                className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-xl text-sm p-2 m-1 dark:focus:ring-yellow-900" 
                onClick={signOut}>
                Logout
              </button>
            </div>
          </div>
        </nav>
      </header>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Your Tasks</h2>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <Card className="p-3">
            {tasks.map((task) => (
              <div key={task.id} className="border p-2 rounded">
                <strong>{task.title}</strong>
                <p>Description : <i>{task.description}</i></p>
                <p>Status: {task.completed ? "Completed" : "Pending"}</p>
              </div>
            ))}
          </Card>
        )}
      </div>
    </>
  );
}