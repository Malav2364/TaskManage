// components/taskForm.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";

export default function TaskForm({ onTaskAdded }) {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  
  const titleInputRef = useRef(null);
  const buttonRef = useRef(null);
  const overlayRef = useRef(null);
  
  // Current user and timestamp values as specified in the latest update
  const currentUser = session?.user?.email;
  const currentDateTime = new Date().toLocaleDateString();
  
  // Setup portal mounting on component init
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Focus input once when modal opens
  useEffect(() => {
    if (isModalOpen && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current.focus();
      }, 100);
    }
  }, [isModalOpen]);
  
  // Lock/unlock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  // Use a single handler function with computed property names
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) {
      if (!formData.title && !formData.description) {
        closeModal();
      } else {
        // Show toast if user tries to close with data entered
        toast.error("Please use the Cancel button to discard your task");
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    
    // Show loading toast
    const loadingToast = toast.loading("Adding task...");
    setLoading(true);
    
    try {
      const token = session?.user?.token;
      if (!token) {
        throw new Error("Authentication token missing");
      }
      
      const response = await axios.post("/api/tasks", 
        {
          title: formData.title.trim(),
          description: formData.description.trim(),
          completed: false
        }, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update loading toast to success
      toast.success("Task added successfully!", { id: loadingToast });
      
      // Reset form
      setFormData({ title: "", description: "" });
      closeModal();
      
      // Update parent component
      if (onTaskAdded) onTaskAdded(response.data);
      
    } catch (error) {
      console.error("Error adding task:", error);
      // Update loading toast to error
      toast.error(error.response?.data?.message || "Failed to add task", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    if (formData.title.trim() || formData.description.trim()) {
      toast.success("Task creation cancelled");
    }
    setFormData({ title: "", description: "" });
    closeModal();
  };
  
  // Button component - always in the normal DOM
  const AddButton = (
    <button
      ref={buttonRef}
      onClick={openModal}
      className="focus:outline-none text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-xl text-sm p-2 m-1"
      aria-label="Add task"
      type="button"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
    </button>
  );
  
  // Modal component - rendered via Portal
  const TaskFormModal = (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full"
        onClick={e => e.stopPropagation()}
        style={{animation: 'fadeIn 0.2s ease-out'}}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Add New Task</h3>
          <div className="text-xs text-gray-500">{currentDateTime}</div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              ref={titleInputRef}
              id="title"
              name="title"
              type="text"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              placeholder="Enter description (optional)"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Adding as: {currentUser}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading || !formData.title.trim()}
                className={`px-4 py-2 rounded-md text-white text-sm font-medium shadow-sm transition-all duration-200
                  ${loading || !formData.title.trim() 
                    ? 'bg-red-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 hover:shadow'}`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-0.5 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </div>
                ) : "Add Task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
  
  return (
    <>
      {AddButton}
      {mounted && isModalOpen && createPortal(TaskFormModal, document.body)}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}