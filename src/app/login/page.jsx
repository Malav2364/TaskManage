"use client"

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Show loading toast
    const loadingToast = toast.loading("Signing in...");
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        // Dismiss loading toast and show error toast
        toast.dismiss(loadingToast);
        toast.error(result.error || "Invalid email or password", {
          duration: 4000,
          icon: '🔒',
          style: {
            border: '1px solid #E53E3E',
            padding: '16px',
          },
        });
      } else if (result?.ok) {
        // Dismiss loading toast and show success toast
        toast.dismiss(loadingToast);
        toast.success("Signed in successfully!", {
          duration: 3000,
          icon: '✅',
        });
        router.push("/dashboard");
      }
    } catch (error) {
      // Dismiss loading toast and show error toast for unexpected errors
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
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
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
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don't have an account? <a href="/signup" className="text-blue-500">Sign Up</a>
        </p>
      </motion.div>
    </div>
  );
}