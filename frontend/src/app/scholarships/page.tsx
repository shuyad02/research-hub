"use client";
import Navbar from '@/components/Navbar';
import api from '@/lib/axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function Scholarships() {
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
  const [formData, setFormData] = useState({ statementOfPurpose: '' });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const { data: scholarships, isLoading, isError, refetch } = useQuery({
    queryKey: ['scholarships'],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/scholarships');
      return data;
    }
  });

  const applyMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post('/api/v1/applications/apply', payload);
      return data;
    },
    onMutate: () => { toast.loading('Submitting application...', { id: 'apply-toast' }); },
    onSuccess: () => {
      toast.success('Application submitted successfully!', { id: 'apply-toast' });
      setSelectedScholarship(null);
      setFormData({ statementOfPurpose: '' });
      setResumeFile(null);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to apply. You may have already applied.', { id: 'apply-toast' })
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error('Please upload your resume.', { id: 'apply-toast' });
      return;
    }
    
    const payload = new FormData();
    payload.append('scholarshipId', selectedScholarship.id);
    payload.append('statementOfPurpose', formData.statementOfPurpose);
    payload.append('resume', resumeFile);

    applyMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-white font-sans overflow-hidden relative">
      <Navbar />
      
      {/* Abstract Glowing Orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />

      <main className="relative z-10 p-8 pt-32 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Discover Scholarships
            </h1>
            <p className="text-gray-400 text-lg">
              Explore global opportunities and accelerate your research journey.
            </p>
          </div>
          <button onClick={() => refetch()} className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-full border border-white/10 font-bold transition-all shadow-lg flex items-center gap-2">
            <span>🔄</span> Refresh List
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <span className="animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-bold text-2xl tracking-widest">
              LOADING OPPORTUNITIES...
            </span>
          </div>
        )}
        
        {isError && (
          <div className="text-center py-10 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 font-bold">
            Failed to load scholarships. Please check your connection.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scholarships?.length === 0 && !isLoading ? (
            <div className="col-span-full text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl">
              <p className="text-gray-400 text-xl font-light">No scholarships found. Check back later!</p>
            </div>
          ) : (
            scholarships?.map((s: any) => (
              <div key={s.id} className="bg-white/[0.03] p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)] border border-white/10 backdrop-blur-xl hover:bg-white/[0.05] transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-lg">
                      {s.provider.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">{s.title}</h2>
                      <p className="text-xs font-medium text-gray-400 tracking-wider uppercase">{s.provider}</p>
                    </div>
                  </div>
                  <div className="mb-4 inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-blue-300">
                    🌍 {s.country}
                  </div>
                  <p className="text-gray-400 line-clamp-3 leading-relaxed mb-4 font-light">{s.description}</p>
                  
                  {s.requirements && (
                    <div className="mb-6 p-4 bg-purple-900/10 border border-purple-500/20 rounded-xl">
                      <h4 className="text-xs font-bold text-purple-300 mb-2 uppercase tracking-wider">📋 Eligibility / Requirements</h4>
                      <p className="text-sm text-gray-400">{s.requirements}</p>
                    </div>
                  )}

                </div>
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <span className="text-sm font-semibold text-pink-400 flex items-center gap-2">
                    <span>⏳</span> Deadline: {new Date(s.deadline).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => setSelectedScholarship(s)}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2 rounded-full font-bold shadow-lg transform hover:-translate-y-0.5 transition-all"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Application Modal */}
        {selectedScholarship && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#111] border border-white/10 p-8 rounded-3xl shadow-2xl max-w-lg w-full relative">
              <button 
                onClick={() => setSelectedScholarship(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
              
              <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Submit Application
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                Applying for <strong className="text-white">{selectedScholarship.title}</strong> at {selectedScholarship.provider}.
              </p>
              
              <form onSubmit={handleApplySubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Upload Resume / CV (PDF/DOC)</label>
                  <input 
                    type="file" 
                    required 
                    accept=".pdf,.doc,.docx"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setResumeFile(e.target.files[0]);
                      }
                    }}
                  />
                  {resumeFile && <p className="text-xs text-green-400 mt-2">Selected: {resumeFile.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Statement of Purpose (Why should we hire you?)</label>
                  <textarea 
                    required 
                    rows={5}
                    placeholder="Describe your research background, goals, and why you are a perfect fit..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    value={formData.statementOfPurpose}
                    onChange={(e) => setFormData({ ...formData, statementOfPurpose: e.target.value })}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={applyMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg disabled:opacity-50"
                >
                  {applyMutation.isPending ? 'Submitting...' : 'Send Application'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
