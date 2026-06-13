"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/axios';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [role, setRole] = useState<string>('STUDENT');
  const [userName, setUserName] = useState<string>('');  

  useEffect(() => {
    const savedRole = localStorage.getItem('role') || 'STUDENT';
    const savedName = localStorage.getItem('userName') || '';
    setRole(savedRole);
    setUserName(savedName);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-white font-sans">
      <Navbar />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />

      <main className="relative z-10 p-8 pt-32 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Welcome back{userName ? `, ${userName.split(' ')[0]}` : ''}.
            </h1>
            <p className="text-gray-400 text-lg">
              Here&apos;s what&apos;s happening with your {role.charAt(0) + role.slice(1).toLowerCase()} account today.
            </p>
          </div>
          <div className="hidden md:block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-purple-300 backdrop-blur-md">
            Role: {role}
          </div>
        </div>

        {role === 'ADMIN' && <AdminDashboard />}
        {role === 'RESEARCHER' && <ResearcherDashboard />}
        {role === 'STUDENT' && <StudentDashboard />}
      </main>
    </div>
  );
}

/* ═══════════════ ADMIN ═══════════════ */
function AdminDashboard() {
  const [formData, setFormData] = useState({ title: '', provider: '', deadline: '', description: '', country: '', requirements: '' });
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [appsLoading, setAppsLoading] = useState(true);

  const fetchScholarships = () =>
    api.get('/api/v1/scholarships').then(r => { setScholarships(r.data); setLoading(false); }).catch(() => setLoading(false));

  const fetchApplications = () =>
    api.get('/api/v1/applications/all').then(r => { setApplications(r.data); setAppsLoading(false); }).catch(() => setAppsLoading(false));

  useEffect(() => { fetchScholarships(); fetchApplications(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading('Publishing Scholarship...');
    try {
      await api.post('/api/v1/scholarships', formData);
      toast.success('Scholarship Created Successfully!', { id: toastId });
      setFormData({ title: '', provider: '', deadline: '', description: '', country: '', requirements: '' });
      fetchScholarships();
    } catch {
      toast.error('Failed to create scholarship. Ensure you have Admin rights.', { id: toastId });
    }
  };

  const activeCount = scholarships.filter(s => new Date(s.deadline) > new Date()).length;
  const countries = [...new Set(scholarships.map(s => s.country))].length;
  const pendingApps = applications.filter(a => a.status === 'SUBMITTED' || a.status === 'PENDING').length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon="🎓" label="Total Scholarships" value={loading ? '…' : scholarships.length} color="blue" />
        <StatCard icon="✅" label="Active Listings" value={loading ? '…' : activeCount} color="green" />
        <StatCard icon="🌍" label="Countries Covered" value={loading ? '…' : countries} color="purple" />
        <StatCard icon="📝" label="Pending Applications" value={appsLoading ? '…' : pendingApps} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/[0.03] p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white mb-6">🎯 Create Scholarship</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <input className="input-field" placeholder="Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <input className="input-field" placeholder="Provider (e.g. CERN, Google)" required value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <input className="input-field" placeholder="Country" required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
              <input className="input-field [color-scheme:dark]" type="date" required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
            </div>
            <textarea className="input-field h-24 resize-none" placeholder="Description" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            <textarea className="input-field h-20 resize-none" placeholder="Eligibility / Requirements (e.g. BSc Physics, 3+ years experience)" required value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} />
            <button type="submit" className="btn-primary w-full">Publish Scholarship</button>
          </form>
        </div>

        <div className="bg-white/[0.03] p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white mb-6">📋 All Scholarships</h2>
          {loading ? <LoadingSpinner /> : scholarships.length === 0 ? (
            <EmptyState icon="📋" message="No scholarships yet. Create one!" />
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {scholarships.map((s: any) => (
                <div key={s.id} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-blue-300 text-sm">{s.title}</h3>
                      <p className="text-xs text-gray-400">{s.provider} · {s.country}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${new Date(s.deadline) > new Date() ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {new Date(s.deadline) > new Date() ? 'Active' : 'Expired'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* All Applications Table */}
      <div className="bg-white/[0.03] p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">📨 All Applications</h2>
          <button onClick={fetchApplications} className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-4 py-2 rounded-full transition-all">🔄 Refresh</button>
        </div>
        {appsLoading ? <LoadingSpinner /> : applications.length === 0 ? (
          <EmptyState icon="📨" message="No applications yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="pb-3 pr-4">Applicant</th>
                  <th className="pb-3 pr-4">Scholarship</th>
                  <th className="pb-3 pr-4">Applied On</th>
                  <th className="pb-3 pr-4">Resume</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications.map((a: any) => (
                  <tr key={a.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-white">{a.user?.name || '—'}</p>
                      <p className="text-xs text-gray-500">{a.user?.email}</p>
                    </td>
                    <td className="py-3 pr-4 text-blue-300 font-medium">{a.scholarship?.title || '—'}</td>
                    <td className="py-3 pr-4 text-gray-400 text-xs">{a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : '—'}</td>
                    <td className="py-3 pr-4">
                      {a.resumeLink ? (
                        <a href={a.resumeLink.startsWith('http') ? a.resumeLink : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${a.resumeLink}`} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 underline text-xs">View Resume</a>
                      ) : <span className="text-gray-600 text-xs">Not uploaded</span>}
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-3 py-1 rounded-full border font-bold capitalize ${
                        a.status === 'APPROVED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        a.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {(a.status || 'SUBMITTED').toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════ RESEARCHER ═══════════════ */
function ResearcherDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });

  const fetchProjects = () =>
    api.get('/api/v1/projects').then(r => { setProjects(r.data); setLoading(false); }).catch(() => setLoading(false));

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading('Creating project...');
    try {
      const r = await api.post('/api/v1/projects', newProject);
      setProjects(prev => [r.data, ...prev]);
      setNewProject({ title: '', description: '' });
      setShowForm(false);
      toast.success('Project created successfully!', { id: toastId });
    } catch { 
      toast.error('Failed to create project.', { id: toastId }); 
    }
  };

  const activeCount = projects.filter((p: any) => p.status === 'ACTIVE').length;
  const completedCount = projects.filter((p: any) => p.status === 'COMPLETED').length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon="🔬" label="Total Projects" value={loading ? '…' : projects.length} color="blue" />
        <StatCard icon="✅" label="Active" value={loading ? '…' : activeCount} color="green" />
        <StatCard icon="📄" label="Completed" value={loading ? '…' : completedCount} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/[0.03] p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">My Research Projects</h2>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm px-4 py-2">
              {showForm ? 'Cancel' : '+ New Project'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleCreate} className="mb-6 p-5 bg-white/5 border border-white/10 rounded-xl space-y-4">
              <input className="input-field" placeholder="Project Title" required value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
              <textarea className="input-field h-24 resize-none" placeholder="Project Description" required value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
              <button type="submit" className="btn-primary w-full">Create Project</button>
            </form>
          )}

          {loading ? <LoadingSpinner /> : projects.length === 0 ? (
            <EmptyState icon="🔬" message="No projects yet. Create your first one!" />
          ) : (
            <div className="space-y-4">
              {projects.map((p: any) => (
                <div key={p.id} className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-blue-300">{p.title}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full border font-bold ${(p.status || 'ACTIVE') === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                      {p.status || 'ACTIVE'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{p.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/[0.03] p-8 rounded-2xl border border-white/10 backdrop-blur-xl h-fit">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/ai-assistant" className="block p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <h4 className="font-bold text-purple-300 text-sm mb-1">✨ Generate Proposal</h4>
              <p className="text-xs text-gray-400">Draft a new grant proposal with Gemini AI.</p>
            </Link>
            <Link href="/scholarships" className="block p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <h4 className="font-bold text-blue-300 text-sm mb-1">🎓 Browse Scholarships</h4>
              <p className="text-xs text-gray-400">Find funding opportunities for your research.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ STUDENT ═══════════════ */
function StudentDashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/v1/applications/my-applications'),
      api.get('/api/v1/scholarships'),
    ]).then(([appRes, schRes]) => {
      setApplications(appRes.data);
      setScholarships(schRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const pendingCount = applications.filter((a: any) => a.status === 'PENDING').length;
  const approvedCount = applications.filter((a: any) => a.status === 'APPROVED').length;
  const activeScholarships = scholarships.filter(s => new Date(s.deadline) > new Date());

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="📝" label="My Applications" value={loading ? '…' : applications.length} color="blue" />
        <StatCard icon="⏳" label="Pending Review" value={loading ? '…' : pendingCount} color="yellow" />
        <StatCard icon="✅" label="Approved" value={loading ? '…' : approvedCount} color="green" />
        <StatCard icon="🎓" label="Open Scholarships" value={loading ? '…' : activeScholarships.length} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* My Applications */}
          <div className="bg-white/[0.03] p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">My Applications</h2>
              <Link href="/scholarships" className="text-sm text-blue-400 hover:text-blue-300 font-bold">Browse More →</Link>
            </div>

            {loading ? <LoadingSpinner /> : applications.length === 0 ? (
              <div className="p-10 border-2 border-dashed border-white/10 rounded-xl text-center">
                <div className="text-4xl mb-4 opacity-50">📝</div>
                <p className="text-gray-400 text-lg mb-2">No applications yet.</p>
                <p className="text-gray-500 text-sm mb-6">Apply to scholarships and track them here.</p>
                <Link href="/scholarships" className="btn-primary inline-flex items-center gap-2">
                  Browse Scholarships
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((a: any) => (
                  <div key={a.id} className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-blue-300">{a.scholarship?.title || 'Scholarship'}</h3>
                        <p className="text-xs text-gray-400 mt-1">{a.scholarship?.provider} · {a.scholarship?.country}</p>
                        <p className="text-xs text-gray-500 mt-1">Applied on {a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : '—'}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full border font-bold capitalize ${
                        a.status === 'APPROVED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        a.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {(a.status || 'PENDING').toLowerCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Banner */}
          <div className="bg-white/[0.03] p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
            <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-purple-500/20 p-6 rounded-xl flex flex-col sm:flex-row items-center gap-6">
              <div className="text-5xl">✨</div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Generate a Research Proposal</h3>
                <p className="text-sm text-gray-400 mb-4">Use Gemini AI to draft proposals and build study roadmaps in seconds.</p>
                <Link href="/ai-assistant" className="inline-block bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm">
                  Try AI Assistant →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Scholarships */}
        <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/10 backdrop-blur-xl h-fit">
          <h2 className="text-xl font-bold text-white mb-6">🎯 Open Now</h2>
          {loading ? <LoadingSpinner /> : activeScholarships.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No open scholarships right now.</p>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {activeScholarships.slice(0, 8).map((s: any) => (
                <div key={s.id} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <h4 className="font-bold text-blue-300 text-sm mb-1">{s.title}</h4>
                  <p className="text-xs text-gray-400 mb-2">{s.provider} · {s.country}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-pink-400">⏳ {new Date(s.deadline).toLocaleDateString()}</span>
                    <Link href="/scholarships" className="text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors">Apply</Link>
                  </div>
                </div>
              ))}
              {activeScholarships.length > 8 && (
                <Link href="/scholarships" className="block text-center text-sm text-purple-400 hover:text-purple-300 font-bold py-2">
                  +{activeScholarships.length - 8} more scholarships →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ SHARED COMPONENTS ═══════════════ */
function StatCard({ icon, label, value, color }: { icon: string; label: string; value: any; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
  };
  return (
    <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/[0.05] transition-all">
      <div className="flex justify-between items-start mb-3">
        <span className="text-gray-400 font-medium text-sm">{label}</span>
        <span className={`p-2 rounded-lg text-lg ${colorMap[color]}`}>{icon}</span>
      </div>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
    </div>
  );
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="text-center py-12 text-gray-400">
      <div className="text-5xl mb-4 opacity-50">{icon}</div>
      <p>{message}</p>
    </div>
  );
}
