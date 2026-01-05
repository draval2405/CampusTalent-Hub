
import React from 'react';

interface SkillBadgeProps {
  skill: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
      {skill}
    </span>
  );
};

export default SkillBadge;
