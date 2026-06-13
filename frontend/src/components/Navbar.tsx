"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setRole(localStorage.getItem('role'));
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole(null);
    router.push('/');
  };

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/10 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 hover:scale-105 transition-transform">
          ResearchHub<span className="text-white">AI</span>
        </Link>
        <div className="space-x-6 flex items-center">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">Dashboard</Link>
              
              <Link href="/scholarships" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">Scholarships</Link>
              
              {role === 'RESEARCHER' && (
                <Link href="/projects" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">Projects</Link>
              )}
              
              {(role === 'STUDENT' || role === 'RESEARCHER') && (
                <Link href="/ai-assistant" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">AI Assistant</Link>
              )}
              
              <button onClick={handleLogout} className="bg-white/10 hover:bg-red-500/80 px-5 py-2 rounded-full transition-all duration-300 font-semibold text-sm shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">Login</Link>
              <Link href="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-2.5 rounded-full transition-all duration-300 font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transform hover:-translate-y-0.5">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
