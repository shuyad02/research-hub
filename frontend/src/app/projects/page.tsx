"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'RESEARCHER') {
      router.push('/dashboard');
      return;
    }
    api.get('/api/v1/projects').then(res => setProjects(res.data)).catch(console.error);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-white font-sans overflow-hidden relative">
      <Navbar />
      
      {/* Abstract Glowing Orbs */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />

      <main className="relative z-10 p-8 pt-32 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Research Projects
            </h1>
            <p className="text-gray-400 text-lg">
              Manage and collaborate on your active research initiatives.
            </p>
          </div>
          <Link href="/dashboard" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] transform hover:-translate-y-0.5 flex items-center gap-2">
            <span>+</span> New Project
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm">
              <div className="text-6xl mb-6 opacity-50">📁</div>
              <p className="text-gray-400 text-xl font-light">You have no research projects yet.</p>
              <p className="text-gray-500 text-sm mt-2">Click "New Project" to get started.</p>
            </div>
          ) : (
            projects.map((p: any) => (
              <div key={p.id} className="bg-white/[0.03] p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)] border border-white/10 backdrop-blur-xl hover:bg-white/[0.05] transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">{p.title}</h2>
                  <span className="inline-flex items-center px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-full uppercase font-bold tracking-widest shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                    {p.status}
                  </span>
                </div>
                <p className="text-gray-400 leading-relaxed font-light">{p.description}</p>
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                  <button className="text-blue-400 hover:text-blue-300 font-bold text-sm flex items-center gap-2 transition-colors">
                    View Details &rarr;
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
