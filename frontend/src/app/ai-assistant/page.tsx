"use client";
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function AIAssistant() {
  const [topic, setTopic] = useState('');
  const [abstract, setAbstract] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'STUDENT' && role !== 'RESEARCHER') {
      router.push('/dashboard');
    }
  }, [router]);

  const generateProposal = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/v1/ai/generate-proposal', { topic, abstractText: abstract });
      setResult(data.proposal || data.result);
    } catch (err) {
      console.error(err);
      setResult("Failed to generate proposal. Ensure your Gemini API Key is valid.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-white font-sans overflow-hidden relative">
      <Navbar />
      
      {/* Abstract Glowing Orbs */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />

      <main className="relative z-10 p-8 pt-32 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_0_40px_rgba(139,92,246,0.5)] mb-6 text-4xl">
            ✨
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Gemini AI Assistant
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Leverage Google Gemini to automatically generate comprehensive research proposals, literature reviews, and roadmaps.
          </p>
        </div>

        <div className="bg-white/[0.03] p-8 md:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.4)] border border-white/10 backdrop-blur-2xl space-y-8">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Research Topic</label>
            <input 
              value={topic} onChange={e => setTopic(e.target.value)} 
              placeholder="e.g. Quantum Cryptography in IoT" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-lg shadow-inner" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Abstract / Core Idea</label>
            <textarea 
              value={abstract} onChange={e => setAbstract(e.target.value)} 
              placeholder="Briefly describe your research hypothesis, objectives, or main goals..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all h-40 resize-none text-lg shadow-inner leading-relaxed" 
            />
          </div>
          <button 
            onClick={generateProposal} 
            disabled={loading || !topic || !abstract}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-4 rounded-xl font-bold text-xl shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 transition-all flex justify-center items-center gap-3"
          >
            {loading ? (
              <>
                <span className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full"></span>
                Generating Intelligence...
              </>
            ) : 'Generate Proposal & Roadmap'}
          </button>
        </div>

        {result && (
          <div className="mt-12 bg-white/[0.02] p-8 md:p-10 rounded-3xl shadow-inner border border-white/10 backdrop-blur-xl animate-fade-in-up">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <span>📄</span> AI Generated Proposal
            </h3>
            <div className="whitespace-pre-wrap font-sans text-lg leading-relaxed text-gray-300">
              {result}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
