
import React, { useState, useMemo } from 'react';
import Sidebar, { ViewType } from './components/Sidebar';
import ProfileCard from './components/ProfileCard';
import SkillBadge from './components/SkillBadge';
import { MOCK_STUDENTS } from './constants';
import { StudentProfile, AIRecommendation } from './types';
import { getIntelligentMatches } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'ai'>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  // Instant local filtering for immediate feedback while AI thinks
  const localFilteredResults = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_STUDENTS;
    const lowerQuery = searchQuery.toLowerCase();
    return MOCK_STUDENTS.filter(s => 
      s.name.toLowerCase().includes(lowerQuery) ||
      s.headline.toLowerCase().includes(lowerQuery) ||
      s.skills.some(skill => skill.toLowerCase().includes(lowerQuery)) ||
      s.university.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setRecommendations([]);
      setActiveTab('all');
      return;
    }
    
    // Switch to AI tab immediately to show loading state
    setActiveTab('ai');
    setIsSearching(true);
    
    try {
      // While this is fetching, the UI will show the "isSearching" state 
      // but users can still see the filtered Public Directory if they switch back.
      const results = await getIntelligentMatches(searchQuery, MOCK_STUDENTS);
      setRecommendations(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const openStudentDetail = (student: StudentProfile | AIRecommendation) => {
    // Find the full profile if it's an AI recommendation
    const fullProfile = MOCK_STUDENTS.find(s => s.name === student.name);
    if (fullProfile) {
      setSelectedStudent(fullProfile);
    }
  };

  const renderPublicProfile = (student: StudentProfile) => (
    <div className="max-w-4xl mx-auto py-4">
      <button 
        onClick={() => setSelectedStudent(null)}
        className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest"
      >
        <i className="fas fa-arrow-left"></i> Back to results
      </button>
      
      <div className="glass-card rounded-[2.5rem] border-slate-800/50 overflow-hidden shadow-2xl">
        <div className="h-64 bg-gradient-to-br from-slate-900 via-indigo-900/40 to-slate-950 relative overflow-hidden">
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.5),transparent)]"></div>
           <div className="absolute top-10 right-10 flex gap-4">
              <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center text-slate-100 cursor-pointer hover:bg-slate-700/50 transition-all"><i className="fas fa-share-nodes"></i></div>
           </div>
        </div>
        <div className="px-12 pb-12">
          <div className="relative -mt-24 mb-8 flex items-end justify-between">
            <div className="relative group">
              <img src={student.avatar} className="w-44 h-44 rounded-[2rem] border-8 border-slate-950 shadow-2xl bg-slate-900" alt="Profile" />
              <div className="absolute inset-0 rounded-[2rem] border-2 border-blue-500/20"></div>
            </div>
            <div className="flex gap-4">
              <button className="bg-blue-600 px-8 py-3 rounded-2xl text-sm font-black text-white hover:bg-blue-500 shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2">
                <i className="fas fa-paper-plane"></i> Send Message
              </button>
              <button className="glass-card px-8 py-3 rounded-2xl text-sm font-black text-white hover:bg-slate-800 transition-all active:scale-95">
                Connect
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-10">
            <div className="flex-1">
              <h1 className="text-4xl font-black text-slate-50 tracking-tight">{student.name} <i className="fas fa-badge-check text-blue-500 text-2xl ml-1"></i></h1>
              <p className="text-lg text-slate-400 font-semibold mt-1 italic">{student.headline} at {student.university}</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-500/20">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               {student.availability}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-10">
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-slate-800"></span> Projects
                </h3>
                <div className="space-y-4">
                  {student.projects.map((proj, idx) => (
                    <div key={idx} className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-2xl hover:border-slate-700 transition-all">
                      <h4 className="text-lg font-black text-slate-100 mb-2">{proj.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-slate-800"></span> Tech Stack & Skills
                </h3>
                <div className="flex flex-wrap gap-3">
                  {student.skills.map(s => (
                    <div key={s} className="px-4 py-2 bg-slate-800/30 rounded-xl border border-slate-700/50 text-slate-200 text-sm font-bold">{s}</div>
                  ))}
                </div>
              </section>
            </div>
            <div className="space-y-6">
               <div className="glass-card p-6 rounded-[2rem] border-slate-700/30">
                  <h3 className="text-xs font-black uppercase text-slate-500 mb-6">Experience</h3>
                  <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50 text-center">
                    <div className="text-2xl font-black text-blue-400">{student.experience_level}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Level Verified</div>
                  </div>
               </div>
               <div className="glass-card p-6 rounded-[2rem] border-slate-700/30">
                  <h3 className="text-xs font-black uppercase text-slate-500 mb-6">University Link</h3>
                  <div className="flex items-center gap-3 bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20">
                     <i className="fas fa-university text-blue-400 text-xl"></i>
                     <div>
                       <p className="text-xs font-black text-blue-100">{student.university}</p>
                       <p className="text-[10px] text-blue-300/60 uppercase tracking-tighter">Verified Official Email</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDiscover = () => (
    <>
      <div className="mb-12 relative">
        <div className="absolute -left-10 top-0 w-24 h-24 bg-blue-500/10 blur-3xl rounded-full"></div>
        <h1 className="text-4xl font-black text-slate-100 mb-3 tracking-tight">Discover Talent</h1>
        <p className="text-slate-400 font-medium text-lg max-w-2xl">Find verified student collaborators across India using Gemini's semantic search.</p>
      </div>

      <div className="glass-card rounded-3xl p-8 mb-12 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <i className="fas fa-sparkles text-blue-500/60 group-focus-within:text-blue-400 transition-colors"></i>
          </div>
          <input 
            type="text" 
            placeholder="Search intent: 'Need a Flutter dev for Social Impact hackathon'..."
            className="block w-full pl-14 pr-40 py-5 glass-input rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all text-slate-100 placeholder:text-slate-500 text-lg font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit"
            disabled={isSearching}
            className="absolute right-2 inset-y-2 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50 flex items-center gap-3 active:scale-95"
          >
            {isSearching ? <><i className="fas fa-spinner animate-spin"></i> Analyzing</> : <>Find Matches</>}
          </button>
        </form>
        <div className="mt-6 flex flex-wrap gap-3 items-center">
          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mr-2">Top Skill Queries:</span>
          {['Cybersecurity', 'Solidity', 'PyTorch', 'System Design'].map(tag => (
            <button key={tag} onClick={() => { setSearchQuery(tag); }} className="text-xs px-4 py-2 bg-slate-800/50 text-slate-300 rounded-xl hover:bg-slate-700/50 border border-slate-700/50 transition-all font-bold">
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800/50 w-fit backdrop-blur-md">
          <button onClick={() => setActiveTab('all')} className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'all' ? 'bg-slate-100 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
            Public Directory ({localFilteredResults.length})
          </button>
          <button onClick={() => setActiveTab('ai')} className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeTab === 'ai' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-slate-500 hover:text-slate-300'}`}>
            AI Insights {recommendations.length > 0 && <span className="bg-white/20 px-2 rounded-lg text-[10px]">{recommendations.length}</span>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {activeTab === 'ai' ? (
          isSearching ? (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="inline-block p-4 bg-blue-500/10 rounded-full animate-pulse">
                <i className="fas fa-brain-circuit text-4xl text-blue-500"></i>
              </div>
              <h3 className="text-xl font-black text-slate-100">Gemini is analyzing {MOCK_STUDENTS.length} verified profiles...</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Cross-referencing project history, skill proficiency, and availability for the perfect match.</p>
            </div>
          ) : recommendations.length > 0 ? (
            recommendations.map((rec, idx) => (
              <div key={idx} onClick={() => openStudentDetail(rec)} className="cursor-pointer">
                <ProfileCard student={rec} isAIResult />
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <h3 className="text-xl font-black text-slate-100">Search to activate AI matching</h3>
              <p className="text-slate-500 mt-2">Our AI provides detailed reasoning for every recommendation.</p>
            </div>
          )
        ) : (
          localFilteredResults.map(student => (
            <div key={student.id} onClick={() => openStudentDetail(student)} className="cursor-pointer">
              <ProfileCard student={student} />
            </div>
          ))
        )}
      </div>
    </>
  );

  const renderProfile = () => (
    <div className="max-w-4xl mx-auto py-4">
      <div className="glass-card rounded-[2.5rem] border-slate-800/50 overflow-hidden shadow-2xl">
        <div className="h-64 bg-gradient-to-br from-slate-900 via-blue-900/40 to-slate-950 relative overflow-hidden">
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.5),transparent)]"></div>
           <div className="absolute top-10 right-10 flex gap-4">
              <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center text-slate-100 cursor-pointer hover:bg-slate-700/50 transition-all"><i className="fas fa-share-nodes"></i></div>
              <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center text-slate-100 cursor-pointer hover:bg-slate-700/50 transition-all"><i className="fas fa-qrcode"></i></div>
           </div>
        </div>
        <div className="px-12 pb-12">
          <div className="relative -mt-24 mb-8 flex items-end justify-between">
            <div className="relative group">
              <img src="https://picsum.photos/seed/currentuser/200" className="w-44 h-44 rounded-[2rem] border-8 border-slate-950 shadow-2xl bg-slate-900" alt="Profile" />
              <div className="absolute inset-0 rounded-[2rem] border-2 border-blue-500/20 group-hover:border-blue-500/50 transition-all"></div>
            </div>
            <button className="bg-slate-100 px-8 py-3 rounded-2xl text-sm font-black text-slate-950 hover:bg-white shadow-xl hover:-translate-y-1 transition-all active:scale-95">Edit Showcase</button>
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-10">
            <div className="flex-1">
              <h1 className="text-4xl font-black text-slate-50 tracking-tight">Aryan Verma <i className="fas fa-badge-check text-blue-500 text-2xl ml-1"></i></h1>
              <p className="text-lg text-slate-400 font-semibold mt-1 italic">Building the next generation of Fintech at IIT Delhi</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-500/20">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               Available to collaborate
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-10">
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-slate-800"></span> Bio & Mission
                </h3>
                <p className="text-slate-300 text-lg leading-relaxed font-medium">
                  I specialize in building secure microservices and modern frontend architectures. Currently exploring the intersection of AI and decentralised finance. Looking for Rust enthusiasts for an upcoming global hackathon.
                </p>
              </section>
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-slate-800"></span> Tech Stack
                </h3>
                <div className="flex flex-wrap gap-3">
                  {['Next.js 15', 'Go', 'Kubernetes', 'Prisma', 'TRPC', 'Tailwind', 'TensorFlow'].map(s => (
                    <div key={s} className="px-4 py-2 bg-slate-800/30 rounded-xl border border-slate-700/50 text-slate-200 text-sm font-bold hover:border-blue-500/30 transition-all cursor-default">{s}</div>
                  ))}
                </div>
              </section>
            </div>
            <div className="space-y-6">
               <div className="glass-card p-6 rounded-[2rem] border-slate-700/30">
                  <h3 className="text-xs font-black uppercase text-slate-500 mb-6">Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="text-center p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                        <div className="text-2xl font-black text-slate-50">14</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Projects</div>
                     </div>
                     <div className="text-center p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                        <div className="text-2xl font-black text-slate-50">8</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Hackathons</div>
                     </div>
                  </div>
               </div>
               <div className="glass-card p-6 rounded-[2rem] border-slate-700/30">
                  <h3 className="text-xs font-black uppercase text-slate-500 mb-6">Verification</h3>
                  <div className="flex items-center gap-3 bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20">
                     <i className="fas fa-university text-blue-400"></i>
                     <span className="text-xs font-bold text-blue-100">IIT Delhi Student ID Verified</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConnections = () => (
    <div>
      <h1 className="text-4xl font-black text-slate-50 mb-3 tracking-tight">Network Hub</h1>
      <p className="text-slate-500 font-medium mb-12">Building high-trust peer circles across India's top universities.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_STUDENTS.slice(0, 5).map(student => (
          <div key={student.id} onClick={() => setSelectedStudent(student)} className="glass-card p-6 rounded-3xl border-slate-800/50 group transition-all hover:border-blue-500/30 cursor-pointer">
            <div className="flex items-center gap-4">
              <img src={student.avatar} className="w-16 h-16 rounded-2xl border border-slate-700/50" alt={student.name} />
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-slate-100 truncate text-lg">{student.name}</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">{student.university}</p>
                <div className="mt-2 flex items-center gap-3">
                  <button className="text-[10px] font-black uppercase text-blue-500 tracking-widest hover:text-blue-400">Profile</button>
                  <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                  <button className="text-[10px] font-black uppercase text-slate-500 tracking-widest hover:text-slate-300">Message</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-50 mb-2 tracking-tight">Active Builds</h1>
          <p className="text-slate-500 font-medium italic">High-impact engineering projects currently in stealth.</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black shadow-xl shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all">+ Initialize Project</button>
      </div>
      <div className="space-y-6">
        {[
          { name: 'DeFi Risk Oracle', role: 'Architect', status: 'Alpha', members: 4, stack: ['Rust', 'Solana'] },
          { name: 'VectorDB Engine', role: 'Core Contributor', status: 'Stable', members: 2, stack: ['C++', 'Python'] }
        ].map(p => (
          <div key={p.name} className="glass-card p-8 rounded-[2rem] border-slate-800/50 flex flex-col md:flex-row justify-between md:items-center group">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-black text-2xl text-slate-50 tracking-tight group-hover:text-blue-400 transition-colors">{p.name}</h3>
                <span className="text-[9px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-md font-black uppercase tracking-widest">{p.status}</span>
              </div>
              <p className="text-sm text-slate-500 font-bold mb-4">Role: <span className="text-slate-300">{p.role}</span> • {p.members} active engineers</p>
              <div className="flex gap-2">
                {p.stack.map(s => <span key={s} className="text-[10px] text-slate-400 px-3 py-1 bg-slate-800/40 rounded-lg border border-slate-700/50">{s}</span>)}
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex -space-x-3">
                  {[1,2,3].map(i => <img key={i} src={`https://picsum.photos/seed/p${i}/50`} className="w-10 h-10 rounded-full border-4 border-slate-900 shadow-xl" />)}
               </div>
               <button className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-colors"><i className="fas fa-arrow-right"></i></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHackathons = () => (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-50 mb-3 tracking-tight">Arena</h1>
        <p className="text-slate-500 font-medium">Competitions curated for the top 1% student talent in India.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {[
          { name: 'India Fintech Summit', host: 'NPCI', date: 'Oct 15', tags: ['Web3', 'UPI 2.0'], img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Google Cloud Sprint', host: 'Alphabet', date: 'Nov 1', tags: ['MLOps', 'Serverless'], img: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1200&q=80' }
        ].map(h => (
          <div key={h.name} className="group glass-card rounded-[2.5rem] border-slate-800/50 overflow-hidden shadow-2xl transition-all hover:-translate-y-2">
            <div className="h-56 bg-slate-800 overflow-hidden relative">
              <img src={h.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" alt={h.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              <div className="absolute top-6 left-6 flex gap-2">
                 {h.tags.map(t => <span key={t} className="px-3 py-1 glass-card rounded-lg text-[10px] font-black text-white uppercase tracking-tighter">{t}</span>)}
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1">{h.host} Official Event</p>
                  <h3 className="font-black text-2xl text-slate-50">{h.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-slate-50 font-black text-lg block">{h.date}</span>
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Entry Closes</span>
                </div>
              </div>
              <button className="w-full py-4 bg-slate-100 text-slate-950 font-black rounded-2xl hover:bg-white shadow-xl hover:shadow-blue-500/10 transition-all active:scale-95">Find Squad</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="h-[calc(100vh-200px)] flex glass-card rounded-[2.5rem] border-slate-800/50 overflow-hidden shadow-2xl">
      <div className="w-80 border-r border-slate-800/50 flex flex-col bg-slate-950/40">
        <div className="p-8 border-b border-slate-800/30">
          <h2 className="font-black text-2xl text-slate-50">Comms</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {MOCK_STUDENTS.slice(0, 4).map(s => (
            <div key={s.id} className={`p-4 flex items-center gap-3 rounded-[1.5rem] transition-all cursor-pointer ${s.id === '1' ? 'bg-blue-500/10 border border-blue-500/20' : 'hover:bg-slate-800/50 border border-transparent'}`}>
              <div className="relative">
                 <img src={s.avatar} className="w-12 h-12 rounded-2xl border border-slate-700/50 shadow-lg" alt={s.name} />
                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <p className="font-black text-sm text-slate-100 truncate">{s.name}</p>
                  <span className="text-[9px] text-slate-500 font-bold">14:20</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate font-medium">Shared a repository link...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-8 border-b border-slate-800/50 flex items-center justify-between bg-slate-950/20">
          <div className="flex items-center gap-4">
             <img src={MOCK_STUDENTS[0].avatar} className="w-12 h-12 rounded-2xl border border-slate-700/50" alt="Selected" />
             <div>
               <h3 className="font-black text-slate-100 text-lg leading-tight">{MOCK_STUDENTS[0].name}</h3>
               <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1.5 mt-1"><i className="fas fa-circle text-[6px]"></i> Active Now</p>
             </div>
          </div>
          <div className="flex gap-4">
             <button className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-slate-400 hover:text-slate-100"><i className="fas fa-phone"></i></button>
             <button className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-slate-400 hover:text-slate-100"><i className="fas fa-ellipsis-v"></i></button>
          </div>
        </div>
        <div className="flex-1 p-8 flex flex-col justify-end gap-6 overflow-y-auto">
          <div className="max-w-md bg-slate-800/80 p-5 rounded-3xl rounded-bl-none border border-slate-700/50 text-sm text-slate-200 font-medium leading-relaxed">
            Hey Aryan! I saw you're looking for a backend dev for the India Fintech Summit. I've worked with Node.js and Redis before, would love to join your team!
          </div>
          <div className="max-w-md self-end bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-3xl rounded-br-none shadow-xl text-sm text-white font-medium leading-relaxed">
            That sounds great, Arjun! Do you have experience with WebSockets as well? The real-time trade engine needs high-throughput handling.
          </div>
        </div>
        <div className="p-8 border-t border-slate-800/50 bg-slate-950/40">
          <div className="glass-input rounded-2xl p-2 flex items-center">
            <input type="text" placeholder="Shift+Enter to send..." className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-sm text-slate-100 font-medium" />
            <div className="flex gap-2">
               <button className="text-slate-500 hover:text-slate-300 w-10 h-10"><i className="fas fa-paperclip"></i></button>
               <button className="bg-slate-100 text-slate-950 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white transition-all shadow-lg active:scale-95"><i className="fas fa-paper-plane"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const navigateToView = (view: ViewType) => {
    setCurrentView(view);
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen lg:pl-64">
      <Sidebar activeView={currentView} onViewChange={navigateToView} />

      <main className="max-w-[1400px] mx-auto p-6 md:p-12">
        {selectedStudent ? renderPublicProfile(selectedStudent) : (
          <>
            {currentView === 'discover' && renderDiscover()}
            {currentView === 'profile' && renderProfile()}
            {currentView === 'connections' && renderConnections()}
            {currentView === 'projects' && renderProjects()}
            {currentView === 'hackathons' && renderHackathons()}
            {currentView === 'messages' && renderMessages()}
          </>
        )}

        <footer className="mt-32 pt-12 border-t border-slate-800/50 text-center">
          <div className="inline-block bg-slate-900/50 px-6 py-2 rounded-2xl border border-slate-800 mb-8">
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">AI Intelligence Tier: Gemini 2.0 Flash</p>
          </div>
          <div className="flex justify-center gap-10 mb-10 opacity-20 grayscale invert">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/ed/Firebase_Logo.svg" alt="Firebase" className="h-5" />
          </div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
            &copy; 2025 CampusTalent Hub • Official Partner of Indian Academic Excellence
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
