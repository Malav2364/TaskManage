"use client"
import React from 'react'
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const[loading, setLoading] = useState(false)
    const router = useRouter();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      const loadingToast = toast.loading("Creating your account...");

      try{
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
          toast.dismiss(loadingToast);
          toast.error(data.error || "Registration failed", {
            duration: 4000,
            icon: '❌',
            style: {
              border: '1px solid #E53E3E',
              padding: '16px',
            },
          });
        }else{
          toast.dismiss(loadingToast);
          toast.success("Account created successfully! Please sign in.", {
            duration: 5000,
            icon: '🎉',
            style: {
              border: '1px solid #48BB78',
              padding: '16px',
            },
          });
          router.push("/login");
        }
      }catch(error){
        toast.dismiss(loadingToast);
        toast.error("An unexpected error occurred. Please try again.", {
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-lg w-96"
        >
          <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <button 
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-center text-sm">
            Already have an account? <a href="/login" className="text-blue-500">Sign In</a>
          </p>
        </motion.div>
      </div>
    );
  }
  
  
