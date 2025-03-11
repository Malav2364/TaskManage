"use client"

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Taskoo</h1>
          <button
            onClick={handleLoginRedirect}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </div>
      </header>
      <main className="flex-grow flex flex-col justify-center items-center">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Never Loose a Task !
          </h1>
          <p className="text-2xl text-gray-700 mb-6">
            Add it to us ! and complete it in time like no more
          </p>
          <p className="text-xl text-gray-700 mb-6">
            And Make a Task Management App
          </p>
          <button
            onClick={handleLoginRedirect}
            className="px-6 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Get Started
          </button>
        </div>
      </main>
      <footer className="bg-white shadow mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Taskoo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}