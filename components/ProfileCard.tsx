
import React from 'react';
import { StudentProfile, AIRecommendation } from '../types';
import SkillBadge from './SkillBadge';

interface ProfileCardProps {
  student: StudentProfile | AIRecommendation;
  isAIResult?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ student, isAIResult }) => {
  const isStudentProfile = 'id' in student;

  return (
    <div className={`group relative glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] ${isAIResult ? 'ring-1 ring-blue-500/40 shadow-[0_0_25px_rgba(59,130,246,0.1)]' : ''}`}>
      {isAIResult && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] uppercase font-black px-2.5 py-1 rounded-md flex items-center gap-1.5 z-10 shadow-lg">
          <i className="fas fa-sparkles animate-pulse"></i> AI Recommended
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <img 
              src={(student as any).avatar || `https://picsum.photos/seed/${student.name}/200`} 
              alt={student.name} 
              className="w-16 h-16 rounded-xl object-cover border border-slate-700/50 shadow-inner group-hover:scale-105 transition-transform"
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${student.availability === 'Busy' ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-extrabold text-slate-100 truncate flex items-center gap-2">
              {student.name}
              {isStudentProfile && (
                <i className="fas fa-shield-check text-blue-500 text-sm" title="Verified Campus Identity"></i>
              )}
            </h3>
            <p className="text-xs text-slate-400 font-semibold leading-tight mb-1">{student.headline}</p>
            {isStudentProfile && (
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                <i className="fas fa-university mr-1"></i> {(student as StudentProfile).university}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {student.skills.slice(0, 3).map((skill) => (
            <SkillBadge key={skill} skill={skill} />
          ))}
          {student.skills.length > 3 && (
            <span className="text-[10px] text-slate-500 self-center font-bold">+{student.skills.length - 3}</span>
          )}
        </div>

        <div className="space-y-4">
          {isAIResult && (student as AIRecommendation).match_reason && (
            <div className="bg-blue-500/5 p-3 rounded-xl border border-blue-500/10 backdrop-blur-sm">
              <p className="text-[11px] text-blue-300 leading-relaxed font-medium italic">
                <i className="fas fa-brain-circuit mr-1.5 text-blue-400"></i> { (student as AIRecommendation).match_reason }
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button className="flex-1 py-2.5 bg-slate-100 text-slate-950 rounded-xl text-xs font-black hover:bg-white transition-all shadow-lg active:scale-95">
              Profile
            </button>
            <button className="px-3 py-2.5 bg-slate-800 text-slate-100 rounded-xl hover:bg-slate-700 border border-slate-700/50 transition-all active:scale-95">
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
